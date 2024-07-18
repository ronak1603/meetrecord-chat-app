import { Box, Divider, Typography } from "@mui/material";
import Link from "next/link";

const FooterSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        padding: "0px",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <Divider
        sx={{
          width: "100vw",
          background: "#e5e7eb",
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 48px 12px 48px",
          marginTop: "8px",
        }}
      >
        <Box>
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
            © Copyright 2024, All Rights Reserved
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
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
              color: "#9ca3af",
            }}
          >
            <Link href="#">Privacy</Link>
          </Typography>
          <Typography
            variant="h4"
            color="white"
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              flexWrap: "wrap",
              lineHeight: "24px",
              color: "#9ca3af",
            }}
          >
            <Link href="#">Terms & Conditions</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FooterSection;
