import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  Snackbar,
  Alert,
  TextField,
  Button,
  styled,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import copy from "copy-to-clipboard";
import { Link } from "@mui/icons-material";

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "12px",
    minWidth: "220px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
    padding: theme.spacing(0.5),
    border: `1px solid ${theme.palette.divider}`,
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1, 1.5),
  margin: theme.spacing(0.25),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  picturePath,
  userPicturePath,
  likes = {},
  comments = [],
}) => {
  const [isComments, setIsComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [commentText, setCommentText] = useState("");

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user); // Get full user object
  const loggedInUserId = loggedInUser?._id;
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const shareUrl = `http://localhost:3000/post/${postId}`;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleShareClick = (event) => setAnchorEl(event.currentTarget);
  const handleShareClose = () => setAnchorEl(null);

  const handleCopyLink = () => {
    copy(shareUrl);
    setOpenSnackbar(true);
    handleShareClose();
  };

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const postComment = async () => {
    if (!commentText.trim()) return;

    const newComment = {
      userId: loggedInUserId,
      name: `${loggedInUser?.firstName || ""} ${loggedInUser?.lastName || ""}`.trim(),
      userPicturePath: loggedInUser?.picturePath || "default-user.png",
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    // Instantly update UI for better experience
    dispatch(
      setPost({
        post: {
          postId,
          postUserId,
          name,
          description,
          picturePath,
          userPicturePath,
          likes,
          comments: [...comments, newComment], // Append new comment
        },
      })
    );

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, text: commentText }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error posting comment:", error);
    }

    setCommentText(""); // Clear input after posting
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend friendId={postUserId} name={name} userPicturePath={userPicturePath} />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        picturePath.endsWith(".mp4") ? (
          <video
            width="100%"
            height="auto"
            controls
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          >
            <source src={`http://localhost:3001/assets/${picturePath}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />
        )
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <IconButton onClick={patchLike}>
            {isLiked ? <FavoriteOutlined sx={{ color: primary }} /> : <FavoriteBorderOutlined />}
          </IconButton>
          <Typography>{likeCount}</Typography>

          <IconButton onClick={() => setIsComments(!isComments)}>
            <ChatBubbleOutlineOutlined />
          </IconButton>
          <Typography>{comments.length}</Typography>
        </FlexBetween>

        <IconButton onClick={handleShareClick}>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      <StyledMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleShareClose}>
        <StyledMenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <Link fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Copy Link</Typography>
        </StyledMenuItem>
      </StyledMenu>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Post link copied to clipboard!
        </Alert>
      </Snackbar>

      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${comment.userId}-${i}`} display="flex" alignItems="center" mt="0.5rem">
              <img
                src={`http://localhost:3001/assets/${comment.userPicturePath || "default-user.png"}`}
                alt="user"
                style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }}
              />
              <Box>
                <Typography fontWeight="bold">{comment.name || "Unknown User"}</Typography>
                <Typography sx={{ color: main }}>{comment.text}</Typography>
              </Box>
            </Box>
          ))}
          <Divider />
          <Box display="flex" alignItems="center" mt="0.5rem">
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button onClick={postComment} variant="contained" color="primary" disabled={!commentText.trim()}>
              Post
            </Button>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
