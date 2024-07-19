"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Box, Button, Typography } from "@mui/material";
import header from "@/assets/images/header.svg";

const DetailsComponent = () => {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "24px",
        background: "#fff",
      }}
      padding="16px 12px 16px 12px"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "48px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: "72px",
              fontWeight: 700,
              // fontFamily: "initial",
              color: "#1E3A8A",
            }}
          >
            CHATHUB
          </Typography>
          <Typography
            variant="h4"
            color="white"
            sx={{
              fontSize: "30px",
              fontWeight: 600,
              lineHeight: "36px",
              color: "#000",
            }}
          >
            Start Chatting with
          </Typography>
          <Typography
            variant="h4"
            color="white"
            sx={{
              fontSize: "30px",
              fontWeight: 600,
              lineHeight: "36px",
              color: "#000",
            }}
          >
            Friends, Anytime
          </Typography>
          <Typography
            variant="h4"
            color="white"
            sx={{
              fontSize: "30px",
              fontWeight: 600,
              lineHeight: "36px",
              color: "#000",
            }}
          >
            anywhere with ChatHub
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginTop: "24px",
          }}
        >
          <Typography
            variant="h4"
            color="white"
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              flexWrap: "wrap",
              lineHeight: "24px",
              color: "#000",
            }}
          >
            Great software that allows you to chat from any
          </Typography>
          <Typography
            variant="h4"
            color="white"
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              flexWrap: "wrap",
              lineHeight: "24px",
              color: "#000",
            }}
          >
            place at any time without any interruption.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              height: "48px",
              padding: "12px 24px 12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              border: "1px solid #1E3A8A",
              color: "#1A1A1A",
              boxShadow: "0",
              background: "#fff",
              "&:hover": {
                background: "#fff",
              },
              marginTop: "16px",
            }}
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              textTransform: "none",
              height: "48px",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#1A1A1A",
              background: "none",
              boxShadow: "0",
              "&:hover": {
                background: "none",
                boxShadow: "0",
              },
              marginTop: "16px",
            }}
            onClick={() => router.push("/register")}
          >
            Join Chathub →
          </Button>
        </Box>
      </Box>
      <Box sx={{ padding: "0px 48px 0px 48px" }}>
        <Image src={header} alt="user-img" height={550} width={550} />
      </Box>
    </Box>
  );
};

export default DetailsComponent;
