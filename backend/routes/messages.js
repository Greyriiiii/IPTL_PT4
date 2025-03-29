import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getMessages, createMessage, upload } from "../controllers/messages.js";

const router = express.Router();

// Define the routes for messages
router.get("/:userId/:friendId", verifyToken, getMessages); // Get all messages between two users
router.post("/", verifyToken, upload.single("file"), createMessage); // Send a new message with optional file upload

export default router;