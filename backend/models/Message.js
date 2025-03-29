import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String, // URL for the uploaded image
    },
    videoUrl: {
      type: String, // URL for the uploaded video
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;