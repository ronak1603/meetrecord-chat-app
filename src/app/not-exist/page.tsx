"use client";

import { useRouter } from "next/navigation";
import { Button, Container, Typography, Box } from "@mui/material";

const InvalidRoomPage = () => {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Invalid Room ID
      </Typography>
      <Typography variant="body1" paragraph>
        The room ID you entered does not exist or is incorrect. Please check the
        room ID and try again.
      </Typography>
      <Box mt={2}>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            textTransform: "none",
            height: "48px",
            padding: "12px 24px 12px 24px",
            fontSize: "14px",
            fontWeight: "500",
            border: "1px solid #1E3A8A",
            color: "#1A1A1A",
            boxShadow: "0",
            background: "#fff",

            "&:hover": {
              background: "#fff",
            },
          }}
          onClick={handleGoToDashboard}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default InvalidRoomPage;
