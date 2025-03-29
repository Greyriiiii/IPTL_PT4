import express from "express";
import { 
  getFeedPosts, 
  getUserPosts, 
  likePost, 
  incrementShares, 
  postComment 
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* CREATE */
router.post("/:id/comment", verifyToken, postComment); // <-- Added correct route

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/share", verifyToken, incrementShares);

export default router;
