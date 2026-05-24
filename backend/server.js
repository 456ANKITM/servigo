import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import notificationRoutes from "./routes/notificationRouter.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import { initSocket } from "./utils/socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// DB
connectDB();
await connectCloudinary();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5173" || "capacitor://localhost" || "http://localhost",
    credentials: true,
  })
);

app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("The Backend API is working");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);

// HTTP Server
const server = http.createServer(app);

// Socket init
initSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});