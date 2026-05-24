import express from "express";
import { protect } from "../middleware/auth.js";
import { createConversation } from "../controllers/conversationController.js";
import { getUserConversations } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protect, createConversation )
router.get("/:userId", protect, getUserConversations);


export default router;