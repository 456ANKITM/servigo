import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  LogOut,
  MessageCircle,
  Bell,
  Trash2,
  Briefcase,
  Activity,
  Menu,
  X,
  PlusCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useDeleteAllNotificationsMutation,
  useGetUnreadCountQuery,
  useGetUnreadMessageCountQuery,
  useGetUserNotificationsQuery,
  useLogoutMutation,
  useMarkAsReadMutation,
} from "../redux/api/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { socket } from "../socket";
import { logoutUser } from "../redux/slices/authSlice";
import logo from "../assets/favicon.svg";

dayjs.extend(relativeTime);

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [text, setText] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileNotificationOpen, setMobileNotificationOpen] = useState(false);
  const notificationRef = useRef();
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isLoading, refetch } = useGetUserNotificationsQuery();
  const { data: unreadData, refetch: refetchUnread } = useGetUnreadCountQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteAllNotifications, { isLoading: isDeleting }] =
    useDeleteAllNotificationsMutation();
  const { data: unreadMessage, refetch: refetchUneadMessage } =
    useGetUnreadMessageCountQuery();
  const [logout] = useLogoutMutation();

  const unreadMessageCount = unreadMessage?.count;
  const user = useSelector((state) => state.auth);
  const currentUser = user?.user;
  const isLoggedIn = !!currentUser;
  const unreadCount = unreadData?.count ?? 0;

  // For Both Client and Worker Search
  const handleSearch = (e) => {
    e.preventDefault();
    if (currentUser.role === "client") {
      navigate(`/search-users?query=${text}`);
    } else {
      navigate(`/search-jobs?search=${text}`);
    }
  };

  // To toogle for the dropdown of the notifcation in desktop
  const handleNotificationToogle = async () => {
    const isOpening = !notificationOpen;
    setNotificationOpen(isOpening);

    if (isOpening) {
      try {
        await markAsRead();
        await refetchUnread();
        await refetch();
      } catch (error) {
        console.log("Error From updating count", error);
      }
    }
  };

  // Delete all notifcations button function
  const handleDeleteAll = async () => {
    try {
      let res = await deleteAllNotifications().unwrap();
      refetch();
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete the notifications");
    }
  };

  const handleLogout = async () => {
    try {
      let res = await logout().unwrap();
      dispatch(logoutUser());
      if (res.success) {
        toast.success(res.message);
        navigate("/");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to log out");
    }
  };

  // Toggle mobile notification to view notifcations in mobile
  const handleMobileNotificationOpen = async () => {
    setMobileNotificationOpen(true);

    await markAsRead();
    refetchUnread();
    refetch();
  };

  // useEffect to handle the outside click and close notifcations and profile in desktop
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close notification dropdown
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationOpen(false);
      }

      // Close profile dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useeffect for socket connection and getting some data
  useEffect(() => {
    socket.on("newUnreadMessage", () => {
      refetchUneadMessage(); //
    });

    return () => socket.off("newUnreadMessage");
  }, []);

  return (
    <nav className=" h-16 flex items-center justify-between px-4 md:px-10 lg:px-20 xl:px-28  bg-zinc-950 w-full  border-b border-white/10 shadow-lg sticky top-0 z-50 text-white ">
      {/* Logo - For Both Mobile and Desktop */}

      <img
        onClick={() => navigate("/")}
        src={logo}
        alt="logo"
        className="w-8 h-8  cursor-pointer hover:scale-105 transition"
      />

      {/* Search Box - For Both Mobile and Desktop   */}

      {currentUser && (
        <form
          onSubmit={handleSearch}
          className=" flex m-2 md:flex items-center  bg-zinc-900 border  border-white/10  h-10 md:h-11 w-full max-w-50 md:max-w-md rounded-xl px-2 md:px-3"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(e);
              }
            }}
            placeholder={
              currentUser.role === "client"
                ? "Search for skilled freelancer"
                : "Search for jobs"
            }
            className="w-full h-full bg-transparent outline-none text-xs md:text-sm text-gray-200  placeholder-gray-500"
            required
          />

          <button
            type="submit"
            className="bg-gray-700 hover:bg-gray-600 hidden md:flex active:scale-95 transition h-8 items-center px-4  rounded-lg text-sm text-white cursor-pointer"
          >
            Search
          </button>
        </form>
      )}

      {/* Client Job Section  */}
      {currentUser?.role === "client" && (
        <div className="hidden md:flex items-center gap-3"> 
          <button
          className='px-3 py-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600'
          onClick={()=>navigate("/post-job")}
          >
            <div className="flex gap-2 items-center">
              <PlusCircle size={18} />
               Post Job
            </div>
           
          </button>

          <button
          onClick={()=>navigate("/jobs-posted")}
          className='px-3 py-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600'
          >
            <div className="flex items-center gap-2">
              <Briefcase size={18} />  View Your Jobs
            </div>
           
          </button>
          <button
          onClick={()=>navigate("/jobs-agreements")}
          className='px-3 py-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600'
          >
            <div className="flex items-center gap-2">
              <Briefcase size={18} />  Jobs Agreements
            </div>
           
          </button>

        </div>
      )}

      {currentUser?.role === "worker" && (
        <div className="hidden md:flex items-center gap-3">
          <button 
          onClick={()=>navigate("/browse-jobs")}
          className="px-3 py-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600">
            <div className="flex items-center gap-2">
            <Briefcase size={18} /> Browse Jobs
            </div>
           
          </button>

           <button 
          onClick={()=>navigate("/jobs-agreements")}
          className="px-3 py-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600">
            <div className="flex items-center gap-2">
            <Briefcase size={18} /> Jobs Agreement
            </div>
           
          </button>

        </div>
      )}

      {/* Desktop Menu -  When users is not logged in  */}
      <div className=" hidden md:flex items-center gap-6 text-sm">
        {!isLoggedIn && (
          <>
            <Link className="hover:text-gray-500 transition" to="/">
              Home
            </Link>
            <Link className="hover:text-gray-500 transition" to="/about">
              About
            </Link>
            <Link className="hover:text-gray-500 transition" to="/contact">
              Contact
            </Link>
          </>
        )}

        {/* Chat + Notifications When user is logged in  */}

        <div className="flex items-center gap-4 md:gap-6">
          {/* MESSAGE ICON */}
          {currentUser && (
            <div
              onClick={() => navigate("/chat")}
              className="relative cursor-pointer"
            >
              <MessageCircle size={21} />

              {unreadMessageCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 px-1 rounded-full">
                  {unreadMessageCount}
                </span>
              )}
            </div>
          )}

          {/* NOTIFICATION ICON */}
          {currentUser && (
            <div className="relative" ref={notificationRef}>
              <div
                onClick={handleNotificationToogle}
                className="relative cursor-pointer"
              >
                <Bell size={21} />

                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>

              {/* DESKTOP DROPDOWN */}
              {notificationOpen && (
                <>
                  {/* ================= DESKTOP DROPDOWN ================= */}
                  <div
                    className="
        hidden sm:block
        absolute right-0 mt-3 w-80
        bg-zinc-900/95 backdrop-blur-xl
        border border-white/10
        rounded-xl shadow-2xl
        z-50 text-gray-200
      "
                  >
                    {/* HEADER */}
                    <div className="p-3 font-semibold border-b border-white/10 flex justify-between">
                      <span>Notifications</span>

                      <button
                        onClick={handleDeleteAll}
                        disabled={isDeleting}
                        className="text-gray-400 hover:text-red-400 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* LIST */}
                    <div className="max-h-64 overflow-y-auto">
                      {data?.notifications?.length > 0 ? (
                        data.notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className="p-3 hover:bg-white/5 cursor-pointer transition"
                          >
                            <p className="text-sm">{notification.message}</p>
                            <span className="text-xs text-gray-500">
                              {dayjs(notification.createdAt).fromNow()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ================= MOBILE FULL SCREEN ================= */}
                  <div
                    className="
        sm:hidden
        fixed inset-0 z-50
        bg-zinc-950 text-white
        flex flex-col
      "
                  >
                    {/* HEADER */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                      <h2 className="text-lg font-semibold">Notifications</h2>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleDeleteAll}
                          disabled={isDeleting}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>

                        <button
                          onClick={() => setNotificationOpen(false)}
                          className="text-white"
                        >
                          <X size={22} />
                        </button>
                      </div>
                    </div>

                    {/* LIST */}
                    <div className="flex-1 overflow-y-auto">
                      {data?.notifications?.length > 0 ? (
                        data.notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className="p-4 border-b border-white/10"
                          >
                            <p className="text-sm">{notification.message}</p>
                            <span className="text-xs text-gray-400">
                              {dayjs(notification.createdAt).fromNow()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-gray-400">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* User Section - for desktop */}
        <div className=" hidden md:flex relative">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="cursor-pointer flex items-center gap-2"
          >
            {currentUser?.profileImage ? (
              <img
                src={currentUser.profileImage}
                alt="profile"
                className="w-9 h-9 rounded-full border"
              />
            ) : currentUser?.name ? (
              <span className="font-medium">{currentUser.name}</span>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full"
              >
                Login
              </button>
            )}
          </div>

          {/* Dropdown */}
          {currentUser && dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-3 w-44 bg-zinc-900/95 backdrop-blur-xl 
border border-white/10 rounded-xl shadow-xl py-2 z-50 text-gray-200"
            >
              <div
                onClick={() => {
                  navigate(`/profile/${currentUser.role}`);
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 cursor-pointer transition"
              >
                <User size={16} /> Profile
              </div>

              {currentUser?.role === "worker" && (
                <div
                  onClick={() => {
                    navigate(`/your-jobs`);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 cursor-pointer"
                >
                  <Briefcase size={16} /> Jobs
                </div>
              )}

              <div
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-red-400 cursor-pointer"
              >
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition"
      >
        {open ? (
          <X size={22} className="text-white" />
        ) : (
          <Menu size={22} className="text-white" />
        )}
      </button>

      {mobileNotificationOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col text-white">
          {/* HEADER */}
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <X
              className="cursor-pointer"
              onClick={() => setMobileNotificationOpen(false)}
            />
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto p-4">
            {data?.notifications?.length > 0 ? (
              data.notifications.map((n) => (
                <div key={n._id} className="p-3 border-b border-white/10">
                  <p>{n.message}</p>
                  <span className="text-xs text-gray-400">
                    {dayjs(n.createdAt).fromNow()}
                  </span>
                </div>
              ))
            ) : (
              <p>No notifications</p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`absolute top-16  left-0 w-full bg-zinc-950 border-t border-white/10 z-50 shadow-xl 
  flex flex-col gap-4 px-6 py-6 text-sm sm:hidden text-gray-200
  transition-all duration-300 ease-in-out
  ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        {!isLoggedIn && (
          <>
            <Link onClick={() => setOpen(false)} to="/">
              Home
            </Link>
            <Link onClick={() => setOpen(false)} to="/about">
              About
            </Link>
            <Link onClick={() => setOpen(false)} to="/contact">
              Contact
            </Link>
          </>
        )}

        {/* Mobile User Section */}
        {currentUser ? (
          <div className="flex flex-col gap-3 mt-3 border-t pt-3">
            {/* <div className="flex items-center gap-3">
              {currentUser.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <User />
              )}
              <span className="font-medium">{currentUser.name}</span>
            </div> */}

            <button
              onClick={() => {
                navigate(`/profile/${currentUser?.role}`);
                setOpen(false);
              }}
              className="flex items-center gap-2"
            >
              <User size={16} /> Profile
            </button>
            {currentUser?.role ==="client" && 
            <button
            className="flex items-center gap-2"
            onClick={()=>navigate("/post-job")}
            >
              <div className="flex items-center gap-2">
                 <PlusCircle size={18} /> Post Job
              </div>
            </button>
            }
            {currentUser?.role ==="client" && 
            <button
            onClick={()=>navigate("/jobs-posted")}
            className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                 <Briefcase size={18} /> View Your Jobs
              </div>
             
            </button>
            }
            {currentUser?.role ==="client" && 
            <button
            onClick={()=>navigate("/jobs-agreements")}
            className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                 <Briefcase size={18} /> Jobs Agreements
              </div>
             
            </button>
            }
            {currentUser?.role === "worker" && 
            <button 
            onClick={()=>navigate("/your-jobs")}
            className="flex items-center gap-2"> 
               <div className="flex items-center gap-2">
                 <Briefcase size={18} /> Jobs 
              </div>
            </button>
            }
            {currentUser?.role === "worker" && 
            <button 
            onClick={()=>navigate("/browse-jobs")}
            className="flex items-center gap-2"> 
               <div className="flex items-center gap-2">
                 <Briefcase size={18} /> Browse Jobs
              </div>
            </button>
            }
            {currentUser?.role === "worker" && 
            <button 
            onClick={()=>navigate("/jobs-agreements")}
            className="flex items-center gap-2"> 
               <div className="flex items-center gap-2">
                 <Briefcase size={18} /> Jobs Agreement
              </div>
            </button>
            }

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              navigate("/login");
              setOpen(false);
            }}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 transition 
text-white rounded-full mt-2"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
