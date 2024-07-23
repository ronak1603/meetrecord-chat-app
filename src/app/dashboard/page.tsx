"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import chatlogo from "@/assets/images/chatlogo.svg";
import useChatMessages from "@/services/useChatMessages";
import { firestore } from "@/services/firebase";

const Dashboard = () => {
  const { linkId, logout } = useAuth();
  const router = useRouter();

  const { createRoom } = useChatMessages(linkId);

  const [roomIdInput, setRoomIdInput] = useState<string>("");

  const { mutate, isLoading } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.push(`/login`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const checkRoomIdExists = async (roomId: string): Promise<boolean> => {
    try {
      const roomDoc = await getDoc(doc(firestore, "chatRooms", roomId));
      return roomDoc.exists();
    } catch (error) {
      return false;
    }
  };

  const handleJoin = async (e: any) => {
    e.preventDefault();
    const exists = await checkRoomIdExists(roomIdInput);
    if (exists) {
      router.push(`/chats/${roomIdInput}`);
    } else {
      router.push("/not-exist");
    }
  };

  const handleCreateRoom = () => {
    if (linkId) {
      createRoom(linkId);
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(45deg, #1E3A8A, #1E3A8A 50%, #ffffff 50px);",
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
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
          sx={{
            paddingBottom: "12px",
          }}
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
            background: "#1E3A8A",
            boxShadow: "0",
            "&:hover": {
              background: "#1E3A8A",
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
            background: "#1E3A8A",
            boxShadow: "0",
            "&:hover": {
              background: "#1E3A8A",
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
          border: "1px solid #1E3A8A",
          color: "#1A1A1A",
          boxShadow: "0",
          background: isLoading ? "#9ca3af" : "#fff",

          "&:hover": {
            background: "#fff",
          },
        }}
        onClick={() => mutate()}
        endIcon={isLoading ? <CircularProgress size={20} /> : null}
        disabled={isLoading}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;
