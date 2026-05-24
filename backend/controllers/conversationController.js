import Conversation from "../models/Conversation.js";

export const createConversation = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    // 1. check existing conversation
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    }).populate("members", "name profileImage");

    // 2. if not exist, create
    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });

      conversation = await conversation.populate(
        "members",
        "name profileImage"
      );
    }

    return res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};