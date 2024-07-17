"use client";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";

const HeaderComponent = () => {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#60a5fa",
      }}
      padding="16px 12px 16px 12px"
    >
      <Typography
        variant="h4"
        color="white"
        sx={{
          fontSize: "24px",
          fontWeight: 600,
          textAlign: "center",
          color: "#000",
        }}
      >
        Chat<span className="font-bold text-[#eeab63ff]">Hub</span>
      </Typography>
      <Typography
        variant="h4"
        color="white"
        sx={{ fontSize: "18px", fontWeight: 400, textAlign: "center" }}
      >
        Connect Instantly, Chat Seamlessly, Anytime, Anywhere 💬
      </Typography>
      <Box sx={{ display: "flex", gap: "12px" }}>
        <Button
          type="button"
          sx={{
            background: "#eeab63ff",
            color: "white",
            padding: "8px 16px 8px 16px",
            textTransform: "none",
            "&:hover": {
              background: "#eeab63ff",
            },
          }}
          onClick={() => router.push("/register")}
        >
          Sign Up
        </Button>
        <Button
          type="button"
          sx={{
            background: "#eeab63ff",
            color: "white",
            padding: "8px 16px 8px 16px",
            textTransform: "none",
            "&:hover": {
              background: "#eeab63ff",
            },
          }}
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default HeaderComponent;
