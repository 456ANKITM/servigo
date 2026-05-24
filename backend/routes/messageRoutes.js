import express from "express";
import { protect } from "../middleware/auth.js";
import { getMessages, getUnreadMessageCount, markConversationAsRead, sendMessage, uploadFile } from "../controllers/messageController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.post("/upload", protect, upload.single("file"), uploadFile)
router.get("/unread-count", protect, getUnreadMessageCount);
router.get("/:conversationId", protect, getMessages);
router.patch("/:id/read", protect, markConversationAsRead);


export default router;