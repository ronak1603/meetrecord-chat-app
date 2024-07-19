"use client";
import { useAuth } from "@/context/AuthContext";
import useChatMessages from "@/services/useChatMessages";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const ChatRoom = () => {
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
      if ((!roomId && !linkId) || !doesExist) {
        router.push("/dashboard");
      }
    };

    verifyRoomId();
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
  }, [dbmessages]);

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
        id="chat-container"
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          my: 4,
          width: "100vw",
          borderBottom: 1,
          borderColor: "divider",
          boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25);",
          maxWidth: "50%",
          minHeight: "100vh",
          background: "#fff",
          paddingBottom: "100px",
        }}
      >
        {dbmessages?.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              mb: 2,
              gap: 2,
              flexDirection: msg.senderId === user?.uid ? "row-reverse" : "row",
            }}
          >
            {msg.senderId !== user?.uid && (
              <Avatar
                src={msg.avatarUrl}
                alt="user-avatar"
                sx={{ width: 40, height: 40 }}
              />
            )}
            <Box
              sx={{
                maxWidth: "75%",
                bgcolor: msg.senderId === user?.uid ? "#1E3A8A" : "grey.300",
                color:
                  msg.senderId === user?.uid
                    ? "primary.contrastText"
                    : "text.primary",
                borderRadius: 1,
                p: 1,
              }}
            >
              {msg.senderId !== user?.uid && (
                <Typography sx={{ fontWeight: "600" }}>{msg.name}</Typography>
              )}

              <Typography sx={{ flexWrap: "wrap", wordBreak: "break-word" }}>
                {msg.text}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
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
          endIcon={isSending ? <CircularProgress size={20} /> : null}
          disabled={isSending}
        >
          ↑
        </Button>
      </Box>
    </Container>
  );
};

export default ChatRoom;
