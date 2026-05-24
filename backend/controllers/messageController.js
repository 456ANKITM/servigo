import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { v2 as cloudinary } from "cloudinary";

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
    });

    res.json({
      success: true,
      url: result.secure_url,
      type: result.resource_type,
      originalName: file.originalname,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { conversationId, text, fileUrl, fileName, fileType, type } = req.body;

    // 1. Validate input
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId and text are required",
      });
    }

    // 2. Check conversation exists
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // 3. Authorization check
    if (
      !conversation.members.some((m) => m.toString() === senderId.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    // 4. Create message
    const message = await Message.create({
      conversationId,
      senderId,
      text: text || "",
      fileUrl,
      fileName,
      fileType,
      type: type || "text"

    });

 let lastMessageText = "Message";

if (type === "image") lastMessageText = "📷 Image";
else if (type === "file") lastMessageText = "📄 File";
else if (text) lastMessageText = text;

conversation.lastMessage = {
  text: lastMessageText,
  senderId,
  createdAt: new Date(),
};
    conversation.unreadBy = conversation.members.filter(
        (member) => member.toString() !== senderId.toString()
    )

    // 5. Update conversation (IMPORTANT)
    conversation.updatedAt = Date.now();
    await conversation.save();

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (!conversation.members.some((m) => m.toString() === userId.toString())) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    return res.json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      members: userId,
    })
      .populate("members", "name profileImage")
      .sort({ updatedAt: -1 });

    return res.json({ success: true, conversations });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const markConversationAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const {id} = req.params;

        const conversation = await Conversation.findById(id);

        if(!conversation) {
            return res.json({success:false, message:"Conversation not found"})
        }
        conversation.unreadBy = conversation.unreadBy.filter(
            (u) => u.toString() !== userId.toString()
        );

        await conversation.save();
        res.json({success:true, message:"Conversation marked as read"})
    } catch (error) {
        return res.json({success:false, message:"Server Error", error})
    }
}

export const getUnreadMessageCount = async (req, res) => {
    try{
        const userId = req.user._id;

        const count = await Conversation.countDocuments({unreadBy: userId})
        return res.json({success:true, count})
    } catch (error) {
        res.json({success:false, count, error})
    }
}
