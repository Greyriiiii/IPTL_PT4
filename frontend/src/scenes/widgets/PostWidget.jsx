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
  styled
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from "react-share";
import copy from "copy-to-clipboard";
import {
  Facebook,
  Twitter,
  WhatsApp,
  Email,
  Link
} from "@mui/icons-material";

// Styled Components
const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '12px',
    minWidth: '220px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    padding: theme.spacing(0.5),
    border: `1px solid ${theme.palette.divider}`,
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: '8px',
  padding: theme.spacing(1, 1.5),
  margin: theme.spacing(0.25),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiListItemIcon-root': {
    minWidth: '36px',
    color: 'white',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

const platformStyles = {
  facebook: { color: '#1877F2' },
  twitter: { color: '#1DA1F2' },
  whatsapp: { color: '#25D366' },
  email: { color: '#EA4335' },
  copy: { color: '#5F6368' },
};

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const shareUrl = `http://localhost:3000/post/${postId}`;

  // Added the missing getShareText function
  const getShareText = () => {
    return `Check out this post by ${name}:`;
  };

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

  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    copy(shareUrl);
    setOpenSnackbar(true);
    handleShareClose();
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        userPicturePath={userPicturePath}
      />
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
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton onClick={handleShareClick}>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {/* Custom Styled Share Menu */}
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleShareClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        elevation={1}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Share this post
          </Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />

        <StyledMenuItem
          onClick={handleCopyLink}
          sx={{ color: 'white' }}
        >
          <ListItemIcon>
            <Link fontSize="small" sx={{ color: 'white' }} />
          </ListItemIcon>
          <Typography variant="body2">Copy Link</Typography>
        </StyledMenuItem>

        <StyledMenuItem
          component={FacebookShareButton}
          url={shareUrl}
          quote={getShareText()}
          sx={{ color: platformStyles.facebook.color }}
        >
          <ListItemIcon>
            <Facebook fontSize="small" sx={{ color: 'inherit' }} />
          </ListItemIcon>
          <Typography variant="body2">Facebook</Typography>
        </StyledMenuItem>

        <StyledMenuItem
          component={TwitterShareButton}
          url={shareUrl}
          title={getShareText()}
          sx={{ color: platformStyles.twitter.color }}
        >
          <ListItemIcon>
            <Twitter fontSize="small" sx={{ color: 'inherit' }} />
          </ListItemIcon>
          <Typography variant="body2">Twitter</Typography>
        </StyledMenuItem>

        <StyledMenuItem
          component={WhatsappShareButton}
          url={shareUrl}
          title={getShareText()}
          sx={{ color: platformStyles.whatsapp.color }}
        >
          <ListItemIcon>
            <WhatsApp fontSize="small" sx={{ color: 'inherit' }} />
          </ListItemIcon>
          <Typography variant="body2">WhatsApp</Typography>
        </StyledMenuItem>

        <StyledMenuItem
          component={EmailShareButton}
          url={shareUrl}
          subject={`Post by ${name}`}
          body={getShareText()}
          sx={{ color: platformStyles.email.color }}
        >
          <ListItemIcon>
            <Email fontSize="small" sx={{ color: 'inherit' }} />
          </ListItemIcon>
          <Typography variant="body2">Email</Typography>
        </StyledMenuItem>
      </StyledMenu>

      {/* Snackbar for copy confirmation */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
          elevation={6}
        >
          Post link copied to clipboard!
        </Alert>
      </Snackbar>

      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;