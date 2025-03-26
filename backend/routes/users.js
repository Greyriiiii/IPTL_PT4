import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUserPicture,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/* UPDATE PROFILE PICTURE */
router.patch("/:id/picture", verifyToken, upload.single("picture"), updateUserPicture);

export default router;
