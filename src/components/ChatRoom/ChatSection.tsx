"use client";
import { useAuth } from "@/context/AuthContext";
import { Message } from "@/types/message";
import { Avatar, Box, Typography } from "@mui/material";

const ChatRoomSection = ({ messages }: { messages: Message[] | undefined }) => {
  const { user } = useAuth();

  return (
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
      {messages?.map((msg) => (
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
  );
};

export default ChatRoomSection;
