import {
  ManageAccountsOutlined,
  EditOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({ firstName: "", bio: "" }); // Added bio state
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("Fetched User Data:", data); // Debugging line
      setUser(data);
      setEditData({
        firstName: data.firstName,
        bio: data.bio || "", // Default to empty string if bio is undefined
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  

  const handleEditSave = async () => {
    console.log("Sending data:", editData); // Debugging line
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName: editData.firstName, bio: editData.bio }),
      });
  
      const updatedUser = await response.json();
      console.log("Updated User Data:", updatedUser); // Debugging line
      setUser(updatedUser);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const { firstName, bio, viewedProfile, impressions, friends } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem" onClick={() => navigate(`/profile/${userId}`)}>
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              fontWeight="500"
              sx={{
                "&:hover": { color: palette.primary.light, cursor: "pointer" },
              }}
            >
              {firstName}
            </Typography>
            <Typography color={palette.neutral.medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined sx={{ cursor: "pointer" }} onClick={() => setIsEditOpen(true)} />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW (Bio Section) */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" fontWeight="500" color={palette.neutral.main}>
          Bio
        </Typography>
        <Typography color={palette.neutral.medium}>
          {bio ? bio : "No bio available."}
        </Typography>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={palette.neutral.medium}>Who's viewed your profile</Typography>
          <Typography fontWeight="500">{viewedProfile}</Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={palette.neutral.medium}>Impressions of your post</Typography>
          <Typography fontWeight="500">{impressions}</Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={palette.neutral.main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={palette.neutral.main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={palette.neutral.medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: palette.neutral.main }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={palette.neutral.main} fontWeight="500">
                LinkedIn
              </Typography>
              <Typography color={palette.neutral.medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: palette.neutral.main }} />
        </FlexBetween>
      </Box>

      {/* EDIT MODAL */}
      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <Box p="2rem" bgcolor="background.paper" borderRadius="8px" width="400px" mx="auto" mt="10%">
          <Typography variant="h5" mb="1rem">Edit Profile</Typography>
          <TextField
            fullWidth
            label="Fullname"
            value={editData.firstName}
            onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
            sx={{ mb: "1rem" }}
          />
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={3}
            value={editData.bio}
            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
            sx={{ mb: "1rem" }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleEditSave}>
            Save
          </Button>
        </Box>
      </Modal>
    </WidgetWrapper>
  );
};

export default UserWidget;
