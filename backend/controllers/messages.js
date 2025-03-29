import Message from "../models/Message.js";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // Save files in the 'public/uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { text, recipientId, senderId } = req.body;

    console.log("Request Body:", req.body); // Log the request body
    console.log("Uploaded File:", req.file); // Log the uploaded file

    // Determine if the uploaded file is an image or video
    const fileUrl = req.file?.path || null;
    const isImage = req.file?.mimetype.startsWith("image/");
    const isVideo = req.file?.mimetype.startsWith("video/");

    const newMessage = new Message({
      text,
      recipientId,
      senderId,
      imageUrl: isImage ? fileUrl : null,
      videoUrl: isVideo ? fileUrl : null,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error("Error creating message:", err); // Log the error
    res.status(500).json({ message: err.message });
  }
};

// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId: friendId },
        { senderId: friendId, recipientId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};