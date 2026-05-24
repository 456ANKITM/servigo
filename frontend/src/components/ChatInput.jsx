import { useState } from "react";
import { Smile, Paperclip, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const ChatInput = ({ handleSend, sending }) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);


  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    // Preview for images
    if (file.type.startsWith("image")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const onSend = () => {
    handleSend({ text: newMessage, file: selectedFile });
    setNewMessage("");
    removeFile();
  };

  return (
    <div className=" sticky bottom-0 border-t border-zinc-800 bg-zinc-900 p-3">
      
      {/* PREVIEW */}
      {selectedFile && (
        <div className="mb-2 flex items-center gap-3 bg-zinc-800 p-2 rounded-lg">
          
          {preview ? (
            <img
              src={preview}
              className="w-14 h-14 object-cover rounded-md"
            />
          ) : (
            <div className="text-sm text-zinc-300">
              📄 {selectedFile.name}
            </div>
          )}

          <button onClick={removeFile}>
            <X size={18} className="text-red-400" />
          </button>
        </div>
      )}

      {/* INPUT ROW */}
      <div className="flex items-center gap-2">
        
        {/* Emoji Button */}
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2 hover:bg-zinc-800 rounded-full"
        >
          <Smile size={20} />
        </button>

        {/* File Upload */}
        {/* <input
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          id="fileInput"
        /> */}
{/* 
        <label
          htmlFor="fileInput"
          className="p-2 hover:bg-zinc-800 rounded-full cursor-pointer"
        >
          <Paperclip size={20} />
        </label> */}

        {/* Text Input */}
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-white outline-none text-sm md:text-base"
        />

        {/* Send Button */}
        <button
          onClick={onSend}
          className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-zinc-200 transition"
        >
          {sending ? "Sending Message" : "Send"}
        </button>
      </div>

      {/* EMOJI PICKER */}
      {showEmoji && (
        <div className="absolute bottom-20 right-4 z-50">
          <EmojiPicker
            onEmojiClick={(emojiData) =>
              setNewMessage((prev) => prev + emojiData.emoji)
            }
          />
        </div>
      )}
    </div>
  );
};

export default ChatInput;