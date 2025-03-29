import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import http from "http";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import messageRoutes from "./routes/messages.js"; // Import the messages route
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import "./middleware/passportSetup.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const server = http.createServer(app); // Create an HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3002"], // Allow both origins
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Update the CORS configuration
const allowedOrigins = ["http://localhost:3000", "http://localhost:3002"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Block the request
    }
  },
  credentials: true, // Allow credentials (cookies, HTTP authentication)
};

app.use(cors(corsOptions));

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/public", express.static("public"));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes); // This registers the users.js routes
app.use("/posts", postRoutes);
app.use("/api/messages", messageRoutes); // Use the messages route

/* SOCKET.IO SETUP */
const activeUsers = new Set(); // Store active user IDs

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Add the user to the active users set
  socket.on("user-connected", (userId) => {
    activeUsers.add(userId);
    console.log("Active users:", Array.from(activeUsers));
  });

  // Remove the user from the active users set on disconnect
  socket.on("disconnect", () => {
    activeUsers.forEach((userId) => {
      if (socket.id === userId) {
        activeUsers.delete(userId);
      }
    });
    console.log("A user disconnected:", socket.id);
    console.log("Active users:", Array.from(activeUsers));
  });
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port: ${PORT}`)); // Use server.listen for Socket.IO

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));