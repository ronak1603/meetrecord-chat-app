"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import useChatMessages from "@/services/useChatMessages";
import ChatRoomSection from "@/components/ChatRoom/ChatSection";
import LeaveAndCopytButton from "@/components/ChatRoom/ExtrsButtonSection";

const ChatRoomPage = () => {
  const { user, linkId, userDetails } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { linkId: roomId } = params;
  const { dbmessages, sendMessage, isLoading, isSending, checkRoomIdExists } =
    useChatMessages((roomId as string) || (linkId as string));
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyRoomId = async () => {
      const doesExist = await checkRoomIdExists(roomId as string);
      if (!linkId || !doesExist) {
        router.push("/not-exist");
      }
    };

    verifyRoomId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, linkId, router]);

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    sendMessage({
      senderId: user?.uid || "",
      text: message,
      avatarUrl: userDetails?.avatarUrl || "",
      name: userDetails?.name || "",
    });
    setMessage("");
  };

  useEffect(() => {
    if (!isLoading) {
      const chatContainer = document.getElementById("chat-container");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbmessages]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to right, #1E3A8A 30%, #1E3A8A 30%)",
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
          gap: "12px",
          position: "absolute",
          left: "16px",
          top: "16px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: "36px",
            fontWeight: 600,
            textAlign: "center",
            color: "#fff",
          }}
        >
          CHATHUB
        </Typography>
      </Box>

      <ChatRoomSection messages={dbmessages} />

      <Box
        sx={{
          display: "flex",
          gap: "16px",
          p: 2,
          position: "fixed",
          bottom: 0,
          zIndex: 50,
          borderTop: 1,
          width: "100%",
          borderColor: "divider",
          background: "#fff",
          maxWidth: "50%",
        }}
      >
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          sx={{
            display: "flex",
            flexGrow: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#1E3A8A",
              },
              "&:hover fieldset": {
                borderColor: "#1E3A8A",
              },
              "&.Mui-focused fieldset": {
                borderColor: "none",
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          sx={{
            textTransform: "none",
            height: "60px",
            fontSize: "24px",
            fontWeight: "500",
            borderRadius: "50%",
            color: "#fff",
            boxShadow: "0",
            background: isSending ? "#9ca3af" : "#1E3A8A",

            "&:hover": {
              background: "#1E3A8A",
            },
          }}
          onClick={handleSendMessage}
          // endIcon={isSending ? <CircularProgress size={20} /> : null}
          disabled={isSending}
        >
          {isSending ? <CircularProgress size={20} /> : "↑"}
        </Button>
      </Box>
      <LeaveAndCopytButton roomId={roomId as string} />
    </Container>
  );
};

export default ChatRoomPage;
