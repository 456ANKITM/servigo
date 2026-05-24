import express from "express";
import { protect } from "../middleware/auth.js";
import { deleteAllNotifications, getUnreadCount, getUserNotifications, markAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getUserNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.patch("/mark-read-all", protect, markAsRead);
router.delete("/delete-all", protect, deleteAllNotifications);

export default router;