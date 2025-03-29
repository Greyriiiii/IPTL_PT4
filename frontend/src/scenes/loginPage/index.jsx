import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      {/* Header */}
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
      >
        <Typography fontWeight="bold" fontSize="32px" color="lightblue">
          Friendzone.
        </Typography>
      </Box>

      {/* Login Form */}
      <Box
        width={isNonMobileScreens ? "40%" : "90%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)"
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem", textAlign: "center" }}>
          Discover more about your friends
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
