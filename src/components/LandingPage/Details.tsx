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
            Frineds, Anytime
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
          <Button
            type="button"
            sx={{
              background: "#eeab63ff",
              color: "white",
              marginTop: "24px",
              padding: "8px 16px 8px 16px",
              textTransform: "none",
              "&:hover": {
                background: "#eeab63ff",
              },
            }}
            onClick={() => router.push("/login")}
          >
            Start Chatting Now →
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
