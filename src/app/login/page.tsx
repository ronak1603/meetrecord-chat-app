import Image from "next/image";
import { Container, Box, Typography } from "@mui/material";

import authImage from "@/assets/images/authImage.svg";
import Signin from "@/components/Login";

const LoginPage = () => {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "space-between",
        height: "100vh",
        width: "100vw",
      }}
      style={{ padding: "0px" }}
      maxWidth="xl"
    >
      <Box
        className="flex w-full justify-center items-center bg-blue-400"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          justifyContent: "center",
          alignItems: "center",
          background: "#1E3A8A",
          padding: "0px",
        }}
      >
        <Typography
          variant="h4"
          color="white"
          sx={{ fontSize: "32px", fontWeight: 600, textAlign: "center" }}
        >
          Connect Instantly, Chat Seamlessly,
        </Typography>
        <Typography
          variant="h4"
          color="white"
          sx={{ fontSize: "32px", fontWeight: 600, textAlign: "center" }}
        >
          Anytime, Anywhere.
        </Typography>
        <Image src={authImage} alt="authImage" />
      </Box>
      <Signin />
    </Container>
  );
};

export default LoginPage;
