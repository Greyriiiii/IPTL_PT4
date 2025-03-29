import React, { useRef } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { ArrowBack, ArrowForward, Add } from "@mui/icons-material";

const StoryWidget = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const fileInputRef = useRef(null);

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the selected file (upload to server, etc.)
      console.log("Selected file:", file);
      // Add your file upload logic here
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        overflowX: "auto",
        padding: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        marginBottom: 2,
      }}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {/* Rest of your component remains the same */}
      
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1, 
          overflowX: "hidden", 
          position: "relative", 
          padding: "20px",
          width: "100%"
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            left: 0,
            backgroundColor: isDarkMode ? theme.palette.grey[700] : "#fff",
            color: isDarkMode ? theme.palette.text.primary : theme.palette.grey[800],
            boxShadow: 2,
            borderRadius: "50%",
            width: 40,
            height: 40,
            zIndex: 1,
            '&:hover': {
              backgroundColor: isDarkMode ? theme.palette.grey[600] : theme.palette.grey[200],
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        {/* Sample Stories */}
        {[...Array(5)].map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 100,
              height: 160,
              borderRadius: "12px",
              backgroundColor: isDarkMode ? theme.palette.grey[700] : theme.palette.grey[300],
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: 1,
              flexShrink: 0,
              marginLeft: "5px",
              position: "relative",
              color: theme.palette.text.primary,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 3
              }
            }}
          >
            Story {index + 1}

            {/* Add Button with file upload functionality */}
            <IconButton
              onClick={handleAddClick}
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: isDarkMode ? theme.palette.grey[600] : "#fff",
                color: isDarkMode ? theme.palette.text.primary : theme.palette.grey[800],
                boxShadow: 2,
                borderRadius: "50%",
                width: 28,
                height: 28,
                '&:hover': {
                  backgroundColor: isDarkMode ? theme.palette.grey[500] : theme.palette.grey[200],
                }
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>
        ))}
        {/* Right Navigation Button */}
        <IconButton
          sx={{
            position: "absolute",
            right: 0,
            backgroundColor: isDarkMode ? theme.palette.grey[700] : "#fff",
            color: isDarkMode ? theme.palette.text.primary : theme.palette.grey[800],
            boxShadow: 2,
            borderRadius: "50%",
            width: 40,
            height: 40,
            zIndex: 1,
            '&:hover': {
              backgroundColor: isDarkMode ? theme.palette.grey[600] : theme.palette.grey[200],
            }
          }}
        >
          <ArrowForward />
        </IconButton>
      </Box>
    </Box>
  );
};

export default StoryWidget;