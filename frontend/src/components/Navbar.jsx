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
  PlusCircle,
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
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [text, setText] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileNotificationOpen, setMobileNotificationOpen] =
    useState(false);

  const notificationRef = useRef();
  const dropdownRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, refetch } = useGetUserNotificationsQuery();
  const { data: unreadData, refetch: refetchUnread } =
    useGetUnreadCountQuery();

  const [markAsRead] = useMarkAsReadMutation();

  const [deleteAllNotifications, { isLoading: isDeleting }] =
    useDeleteAllNotificationsMutation();

  const { data: unreadMessage, refetch: refetchUneadMessage } =
    useGetUnreadMessageCountQuery();

  const [logout] = useLogoutMutation();

  const unreadMessageCount = unreadMessage?.count;
  const unreadCount = unreadData?.count ?? 0;

  const user = useSelector((state) => state.auth);
  const currentUser = user?.user;
  const isLoggedIn = !!currentUser;

  const handleSearch = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    if (currentUser.role === "client") {
      navigate(`/search-users?query=${text}`);
    } else {
      navigate(`/search-jobs?search=${text}`);
    }
  };

  const handleMobileNotificationOpen = async () => {
  setMobileNotificationOpen(true);

  try {
    await markAsRead();
    await refetchUnread();
    await refetch();
  } catch (error) {
    console.log(error);
  }
};

  const handleNotificationToogle = async () => {
    const isOpening = !notificationOpen;
    setNotificationOpen(isOpening);

    if (isOpening) {
      try {
        await markAsRead();
        await refetchUnread();
        await refetch();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteAll = async () => {
    try {
      const res = await deleteAllNotifications().unwrap();

      refetch();

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to delete notifications"
      );
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logout().unwrap();

      dispatch(logoutUser());

      if (res.success) {
        toast.success(res.message);
        navigate("/");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to logout");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationOpen(false);
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    socket.on("newUnreadMessage", () => {
      refetchUneadMessage();
    });

    return () => socket.off("newUnreadMessage");
  }, []);

  return (
    <nav className="h-16 flex items-center gap-4 px-4 md:px-8 lg:px-16 bg-zinc-950 w-full border-b border-white/10 shadow-lg sticky top-0 z-50 text-white">
      {/* LEFT SECTION */}
      <div className="flex items-center shrink-0">
        <img
          onClick={() => navigate("/")}
          src={logo}
          alt="logo"
          className="w-8 h-8 cursor-pointer hover:scale-105 transition"
        />
      </div>

      {/* CENTER SECTION */}
      {currentUser && (
        <div className="hidden md:flex flex-1 justify-center">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-zinc-900 border border-white/10 h-11 w-full max-w-xl rounded-xl px-3"
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                currentUser.role === "client"
                  ? "Search for skilled freelancer"
                  : "Search for jobs"
              }
              className="w-full h-full bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
              required
            />

            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 active:scale-95 transition h-8 items-center px-4 rounded-lg text-sm text-white cursor-pointer hidden md:flex"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* RIGHT SECTION */}
      <div className="hidden md:flex items-center gap-6 shrink-0 text-sm">
        {!isLoggedIn && (
          <>
            <Link
              className="hover:text-gray-400 transition"
              to="/"
            >
              Home
            </Link>

            <Link
              className="hover:text-gray-400 transition"
              to="/about"
            >
              About
            </Link>

            <Link
              className="hover:text-gray-400 transition"
              to="/contact"
            >
              Contact
            </Link>

            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-full"
            >
              Login
            </button>
          </>
        )}

        {currentUser && (
          <>
            {/* CHAT */}
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

            {/* NOTIFICATIONS */}
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

              {notificationOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 text-gray-200">
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

                  <div className="max-h-64 overflow-y-auto">
                    {data?.notifications?.length > 0 ? (
                      data.notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className="p-3 hover:bg-white/5 cursor-pointer transition"
                        >
                          <p className="text-sm">
                            {notification.message}
                          </p>

                          <span className="text-xs text-gray-500">
                            {dayjs(
                              notification.createdAt
                            ).fromNow()}
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
              )}
            </div>

            {/* PROFILE */}
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() =>
                  setDropdownOpen(!dropdownOpen)
                }
                className="cursor-pointer flex items-center gap-2"
              >
                {currentUser?.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt="profile"
                    className="w-9 h-9 rounded-full border border-white/20 object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User size={18} />
                  </div>
                )}
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl py-2 z-50 text-gray-200">
                  <div
                    onClick={() => {
                      navigate(
                        `/profile/${currentUser.role}`
                      );
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 cursor-pointer transition"
                  >
                    <User size={16} />
                    Profile
                  </div>

                  {/* CLIENT MENU */}
                  {currentUser?.role === "client" && (
                    <>
                      <div
                        onClick={() => {
                          navigate("/post-job");
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 cursor-pointer"
                      >
                        <PlusCircle size={16} />
                        Post Job
                      </div>

                      <div
                        onClick={() => {
                          navigate("/jobs-posted");
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 cursor-pointer"
                      >
                        <Briefcase size={16} />
                        View Your Jobs
                      </div>

                      <div
                        onClick={() => {
                          navigate("/jobs-agreements");
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 cursor-pointer"
                      >
                        <Activity size={16} />
                        Jobs Agreements
                      </div>
                    </>
                  )}

                  {/* WORKER MENU */}
                  {currentUser?.role === "worker" && (
                    <>
                      <div
                        onClick={() => {
                          navigate("/browse-jobs");
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 cursor-pointer"
                      >
                        <Briefcase size={16} />
                        Browse Jobs
                      </div>

                      <div
                        onClick={() => {
                          navigate("/your-jobs");
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 cursor-pointer"
                      >
                        <Briefcase size={16} />
                        Jobs
                      </div>

                      <div
                        onClick={() => {
                          navigate("/jobs-agreements");
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 cursor-pointer"
                      >
                        <Activity size={16} />
                        Jobs Agreement
                      </div>
                    </>
                  )}

                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-red-400 cursor-pointer"
                  >
                    <LogOut size={16} />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* MOBILE SEARCH */}
      {currentUser && (
        <div className="flex md:hidden flex-1 justify-center px-2">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-zinc-900 border border-white/10 h-10 w-full rounded-xl px-3"
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Search..."
              className="w-full h-full bg-transparent outline-none text-xs text-gray-200 placeholder-gray-500"
            />
          </form>
        </div>
      )}

      {/* MOBILE MENU BUTTON */}
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

      {/* MOBILE NOTIFICATIONS SCREEN */}
{mobileNotificationOpen && (
  <div className="fixed inset-0 bg-zinc-950 z-[100] flex flex-col text-white sm:hidden">
    
    {/* HEADER */}
    <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
      <div className="flex items-center gap-2">
        <Bell size={20} />
        <h2 className="text-lg font-semibold">
          Notifications
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleDeleteAll}
          disabled={isDeleting}
          className="text-gray-400 hover:text-red-400"
        >
          <Trash2 size={18} />
        </button>

        <button
          onClick={() =>
            setMobileNotificationOpen(false)
          }
          className="text-white"
        >
          <X size={24} />
        </button>
      </div>
    </div>

    {/* NOTIFICATIONS LIST */}
    <div className="flex-1 overflow-y-auto">
      {data?.notifications?.length > 0 ? (
        data.notifications.map((notification) => (
          <div
            key={notification._id}
            className="p-4 border-b border-white/10"
          >
            <p className="text-sm leading-relaxed">
              {notification.message}
            </p>

            <span className="text-xs text-gray-500 mt-1 block">
              {dayjs(notification.createdAt).fromNow()}
            </span>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No notifications
        </div>
      )}
    </div>
  </div>
)}

      {/* MOBILE MENU */}
      <div
        className={`absolute top-16 left-0 w-full bg-zinc-950 border-t border-white/10 z-50 shadow-xl flex flex-col gap-4 px-6 py-6 text-sm sm:hidden text-gray-200 transition-all duration-300 ease-in-out ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {!isLoggedIn ? (
          <>
            <Link onClick={() => setOpen(false)} to="/">
              Home
            </Link>

            <Link
              onClick={() => setOpen(false)}
              to="/about"
            >
              About
            </Link>

            <Link
              onClick={() => setOpen(false)}
              to="/contact"
            >
              Contact
            </Link>

            <button
              onClick={() => {
                navigate("/login");
                setOpen(false);
              }}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 transition text-white rounded-full mt-2"
            >
              Login
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3 mt-3 border-t pt-3">
            <button
              onClick={() => {
                navigate(`/profile/${currentUser?.role}`);
                setOpen(false);
              }}
              className="flex items-center gap-2"
            >
              <User size={16} /> Profile
            </button>

            <button
              onClick={() => {
                navigate("/chat");
                setOpen(false);
              }}
              className="flex items-center gap-2"
            >
              <MessageCircle size={16} /> Chat
            </button>
            <button
  onClick={handleMobileNotificationOpen}
  className="flex items-center justify-between"
>
  <div className="flex items-center gap-2">
    <Bell size={16} />
    Notifications
  </div>

  {unreadCount > 0 && (
    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
      {unreadCount}
    </span>
  )}
</button>

            {currentUser?.role === "client" && (
              <>
                <button
                  onClick={() => navigate("/post-job")}
                  className="flex items-center gap-2"
                >
                  <PlusCircle size={16} />
                  Post Job
                </button>

                <button
                  onClick={() => navigate("/jobs-posted")}
                  className="flex items-center gap-2"
                >
                  <Briefcase size={16} />
                  View Your Jobs
                </button>

                <button
                  onClick={() =>
                    navigate("/jobs-agreements")
                  }
                  className="flex items-center gap-2"
                >
                  <Activity size={16} />
                  Jobs Agreements
                </button>
              </>
            )}

            {currentUser?.role === "worker" && (
              <>
                <button
                  onClick={() => navigate("/your-jobs")}
                  className="flex items-center gap-2"
                >
                  <Briefcase size={16} />
                  Jobs
                </button>

                <button
                  onClick={() => navigate("/browse-jobs")}
                  className="flex items-center gap-2"
                >
                  <Briefcase size={16} />
                  Browse Jobs
                </button>

                <button
                  onClick={() =>
                    navigate("/jobs-agreements")
                  }
                  className="flex items-center gap-2"
                >
                  <Activity size={16} />
                  Jobs Agreement
                </button>
              </>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;