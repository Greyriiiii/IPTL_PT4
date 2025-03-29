import Post from "../models/Post.js";
import User from "../models/User.js";

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    // Populate user details in comments
    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        const populatedComments = await Promise.all(
          post.comments.map(async (comment) => {
            const user = await User.findById(comment.userId).select("firstName lastName picturePath");
            return {
              ...comment,
              name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Unknown User",
              userPicturePath: user?.picturePath || null,
            };
          })
        );

        return { ...post, comments: populatedComments };
      })
    );

    res.status(200).json(updatedPosts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 }); // Newest first
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
      shares: 0,
    });

    await newPost.save();
    const posts = await Post.find().sort({ createdAt: -1 }); // Return all posts sorted
    res.status(201).json(posts);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* INCREMENT SHARES */
export const incrementShares = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { shares: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* POST COMMENT */
export const postComment = async (req, res) => {
  try {
    console.log("Request received:", req.params, req.body);

    const { id } = req.params;
    const { userId, text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ userId, text });
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.error("Error in postComment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
