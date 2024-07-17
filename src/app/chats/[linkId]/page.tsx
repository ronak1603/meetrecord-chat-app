"use client";
import { useAuth } from "@/context/AuthContext";
import useChatMessages from "@/services/useChatMessages";
import { TextField, Button, Box, Container, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const ChatRoom: React.FC = () => {
  const { user, linkId } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { linkId: roomId } = params;
  const { dbmessages, sendMessage, isLoading, isSending } = useChatMessages(
    (roomId as string) || (linkId as string)
  );
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    sendMessage({ senderId: user?.uid || "", text: message });
    setMessage("");
  };

  useEffect(() => {
    if (!roomId && !linkId) {
      router.push("/dashboard");
    }
  }, [roomId, linkId, router]);

  useEffect(() => {
    if (!isLoading) {
      const chatContainer = document.getElementById("chat-container");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [dbmessages, isLoading]);

  return (
    <Container className="flex flex-col h-full">
      <Box id="chat-container" className="flex-1 overflow-y-auto p-4 border-b">
        {dbmessages?.map((msg) => (
          <Box
            key={msg.id}
            className={`mb-2 ${msg.senderId === user?.uid ? "text-right" : ""}`}
          >
            <Box
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.senderId === user?.uid
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              <Typography>{msg.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box className="p-4 border-t">
        <TextField
          fullWidth
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="mb-2"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={isSending}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default ChatRoom;
