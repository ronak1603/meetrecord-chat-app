"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import chatlogo from "@/assets/images/chatlogo.svg";

const Dashboard = () => {
  const { linkId, logout } = useAuth();
  const [newLinkId, setNewLinkId] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (newLinkId.trim() === "") return;
    router.push(`/chats/${newLinkId}`);
  };

  const handleCreateRoom = () => {
    router.push(`/chats/${linkId}`);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(45deg, #1E3ABA, #1E3ABA 50%, #ffffff 50px);",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        justifyContent: "center",
      }}
      style={{ padding: "0px" }}
      maxWidth="xl"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "448px",
          background: "#fff",
          boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25);",
          width: "100%",
          padding: "24px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
        }}
      >
        <Image src={chatlogo} alt="logo" width={50} height={50} />

        <Typography
          variant="h4"
          sx={{
            fontSize: "36px",
            fontWeight: 600,
            // fontFamily: "initial",
            textAlign: "center",
            color: "#1A1A1A",
          }}
        >
          CHATHUB
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            flexWrap: "wrap",
            textAlign: "center",
            lineHeight: "30px",
            color: "#4B5563",
            paddingX: "60px",
            paddingBottom: "12px",
          }}
        >
          ChatHub allows users to chat seamlessly in a single room with a link
          ID.
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          label="Enter the Link id"
          value={newLinkId}
          onChange={(e) => setNewLinkId(e.target.value)}
          sx={{ paddingBottom: "12px" }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleJoin}
          sx={{
            textTransform: "none",
            height: "48px",
            fontSize: "14px",
            fontWeight: "500",
            background: "#1E3ABA",
            boxShadow: "0",
            "&:hover": {
              background: "#1E3ABA",
            },
          }}
        >
          Join Chat Room
        </Button>
        <Box
          sx={{
            display: "flex",
            gap: "6px",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Divider
            sx={{
              flexGrow: 1,
              background: "#e5e7eb",
            }}
          />
          <Typography
            variant="h6"
            color="#1A1A1A"
            sx={{ fontSize: "18px", fontWeight: 400, textAlign: "center" }}
          >
            Or
          </Typography>
          <Divider
            sx={{
              flexGrow: 1,
              background: "#e5e7eb",
            }}
          />
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            height: "48px",
            fontSize: "14px",
            fontWeight: "500",
            background: "#1E3ABA",
            boxShadow: "0",
            "&:hover": {
              background: "#1E3ABA",
            },
          }}
          onClick={handleCreateRoom}
        >
          Create Chat Room
        </Button>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        sx={{
          textTransform: "none",
          height: "48px",
          padding: "12px 24px 12px 24px",
          fontSize: "14px",
          position: "fixed",
          right: "16px",
          top: "16px",
          fontWeight: "500",
          border: "1px solid #1E3ABA",
          color: "#1A1A1A",
          boxShadow: "0",
          background: "#fff",
          "&:hover": {
            background: "#fff",
          },
        }}
        onClick={logout}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;
