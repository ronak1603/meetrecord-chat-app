import { Box } from "@mui/material";
import Image from "next/image";
import chatlogo from "@/assets/images/chatlogo.svg";

const HeaderComponent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
      }}
      padding="16px 48px 16px 48px"
    >
      <Image src={chatlogo} alt="logo" width={50} height={50} />
    </Box>
  );
};

export default HeaderComponent;
