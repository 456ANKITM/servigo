import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useGetUnreadMessageCountQuery,
  useMarkMessageAsReadMutation,
  useSendMessageMutation,
  useUploadFileMutation,
} from "../redux/api/api";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { socket } from "../socket";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import ChatInput from "../components/ChatInput";
import SplashScreen from "./SplashScreen";
import ErrorPage from "../components/Error";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [localMessages, setLocalMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("")
  const [localChats, setLocalChats] = useState([]);
  const [mobileView, setMobileView] = useState("list");
  const [sending, setSending] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  const { data: convoData, isLoading: convoLoading, error } = useGetConversationsQuery(
    user?._id,
    { skip: !user?._id },
  );

  const { data: msgData } = useGetMessagesQuery(selectedChat?._id, {
    skip: !selectedChat,
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markAsRead] = useMarkMessageAsReadMutation();

  const { data: unreadMessage, refetch: refetchUnreadMessage } =
    useGetUnreadMessageCountQuery();

  const [uploadFile] = useUploadFileMutation();

  const chats = convoData?.conversations || [];

  const handleCloseChat = () => {
    setMobileView("list");
    setSelectedChat(null);
  };

  const selectedUser = selectedChat
    ? selectedChat.members?.find((m) => m._id !== user?._id)
    : null;

  const handleSend = async ({ text, file }) => {
    if (!text && !file) return;
    setSending(true);
    let fileData = {};
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const data = await uploadFile(formData).unwrap();

        fileData = {
          fileUrl: data.url,
          fileName: data.originalName,
          fileType: data.type,
          type: data.type === "image" ? "image" : "file",
        };
      }
      console.log("File Has been Uploaded");

      console.log("Sending Text");

      const res = await sendMessage({
        conversationId: selectedChat._id,
        text,
        ...fileData,
      }).unwrap();

      const receiverId = selectedChat.members.find(
        (m) => m._id !== user._id,
      )?._id;

      socket.emit("sendMessage", {
        conversationId: selectedChat._id,
        senderId: user._id,
        receiverId,
        text: text,
        fileUrl: fileData.fileUrl || null,
        fileName: fileData.fileName || null,
        type: fileData.type || "text",
      });

      const newMessage = {
        _id: Date.now(),
        senderId: user._id,
        text,
        fileUrl: fileData.fileUrl || null,
        fileName: fileData.fileName || null,
        type: fileData.type || "text",
      };

      setLocalMessages((prev) => [...prev, newMessage]);

      setSending(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send message");
    }
  };

  useEffect(() => {
    if (msgData?.messages) setLocalMessages(msgData.messages);
  }, [msgData]);

  useEffect(() => {
    if (chats.length) setLocalChats(chats);
  }, [chats]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (selectedChat?.members?.some((m) => m._id === data.senderId)) {
        setLocalMessages((prev) => [
          ...prev,
          {
            _id: Date.now(),
            senderId: data.senderId,
            text: data.text,
            fileUrl: data.fileUrl || null,
            fileName: data.fileName || null,
            type: data.type || "text",
          },
        ]);
      }

      setLocalChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === data.conversationId
            ? {
                ...chat,
                lastMessage: {
                  text: data.text,
                  senderId: data.senderId,
                  createdAt: new Date(),
                },
                unreadBy: chat.members
                  .filter((m) => m._id !== data.senderId)
                  .map((m) => m._id),
              }
            : chat,
        ),
      );
    });

    return () => socket.off("getMessage");
  }, [selectedChat]);

  useEffect(() => {
    if (location.state?.conversation) {
      setSelectedChat(location.state.conversation);
    }
  }, [location.state]);

  useEffect(() => {
    if (!selectedChat?._id) return;

    markAsRead(selectedChat._id);

    setLocalChats((prev) =>
      prev.map((chat) =>
        chat._id === selectedChat._id
          ? {
              ...chat,
              unreadBy: chat.unreadBy?.filter((id) => id !== user._id),
            }
          : chat,
      ),
    );
  }, [selectedChat]);

  if(convoLoading) return <SplashScreen />
  if(error) return <ErrorPage />

  return (
    <div className="bg-zinc-950 h-screen  flex flex-col text-white overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}

        <div
          className={`w-full md:w-1/3 lg:w-1/4 border-r border-zinc-800 bg-zinc-900 flex flex-col scrollbar-hide
  ${mobileView === "chat" ? "hidden md:flex" : "flex"}`}
        >
          <div className="p-5 border-b border-zinc-800">
            <h2 className="text-lg font-semibold">Chats</h2>
          </div>

          <div className="overflow-y-auto flex-1">
            {convoLoading ? (
              <p className="p-4 text-zinc-400">Loading...</p>
            ) : chats.length === 0 ? (
              <p className="p-4 text-zinc-400">No Conversations</p>
            ) : (
              localChats.map((chat) => {
                const otherUser =
                  typeof chat.members?.[0] === "object"
                    ? chat.members.find((m) => m._id !== user._id)
                    : null;

                const isUnread = chat.unreadBy?.includes(user._id);

                return (
                  <div
                    key={chat._id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setMobileView("chat");
                    }}
                    className={`p-4 cursor-pointer border-b border-zinc-800 hover:bg-zinc-800 transition ${
                      selectedChat?._id === chat._id ? "bg-zinc-800" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          otherUser?.profileImage ||
                          "https://randomuser.me/api/portraits/men/10.jpg"
                        }
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {otherUser?.name}
                        </p>
                        <p
                          className={`text-sm truncate ${
                            isUnread
                              ? "text-white font-semibold"
                              : "text-zinc-400"
                          }`}
                        >
                          {chat.lastMessage?.text || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CHAT AREA */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden
          ${mobileView === "list" ? "hidden md:flex" : "flex"}`}
        >
          {selectedChat ? (
            <>
              <div className="flex items-center justify-between p-3 md:p-4 bg-zinc-900 border-b border-zinc-800 shrink-0">
                {/* user info */}
                <div
                  onClick={() =>
                    selectedUser?._id &&
                    navigate(`/public/worker-profile/${selectedUser._id}`)
                  }
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={
                      selectedUser?.profileImage ||
                      "https://randomuser.me/api/portraits/men/10.jpg"
                    }
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
                  />

                  <p className="font-semibold text-sm md:text-base">
                    {selectedUser?.name || "Loading..."}
                  </p>
                </div>

                {/* close button only mobile */}
                <button
                  onClick={handleCloseChat}
                  className="md:hidden text-zinc-400 text-xl px-2"
                >
                  ✕
                </button>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 p-3 md:p-4 s space-y-3 bg-zinc-950 overflow-y-auto scrollbar-hide">
                {localMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.senderId === user._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 md:px-4 md:py-2  rounded-2xl max-w-[80%] md:max-w-[70%] text-sm ${
                        msg.senderId === user._id
                          ? "bg-white text-black"
                          : "bg-zinc-800 text-white"
                      }`}
                    >
                      {msg.type === "text" && <p>{msg.text}</p>}

                      {msg.type === "image" && (
                        <img
                          src={msg.fileUrl}
                          className="max-w-xs rounded-lg h-40 md:h-50"
                        />
                      )}

                      {msg.type === "file" && (
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          className="text-blue-400 underline"
                        >
                          📄 {msg.fileName}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="shrink-0">
                <ChatInput handleSend={handleSend} sending={sending} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              <MessageCircle size={60} />
            </div>
          )}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Chat;
