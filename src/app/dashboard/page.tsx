"use client";
import { useAuth } from "@/context/AuthContext";
import { Button, Container, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Dashboard = () => {
  const { linkId } = useAuth();
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
    <Container className="flex flex-col items-center justify-center h-screen space-y-4">
      <Container className="bg-red-300 p-4 rounded shadow-md w-full max-w-sm">
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          label="Enter the Link id"
          value={newLinkId}
          onChange={(e) => setNewLinkId(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleJoin}
        >
          Join Chat Room
        </Button>
      </Container>
      <Container className="bg-gray-300 p-4 rounded shadow-md w-full max-w-sm">
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleCreateRoom}
        >
          Create Chat Room
        </Button>
      </Container>
    </Container>
  );
};

export default Dashboard;
