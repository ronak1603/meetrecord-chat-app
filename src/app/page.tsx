import { Container } from "@mui/material";
import DetailsComponent from "@/components/LandingPage/Details";
import FooterSection from "@/components/LandingPage/Footer";
import HeaderComponent from "@/components/LandingPage/Header";

export default function Home() {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
      style={{ padding: "0px" }}
      maxWidth="xl"
    >
      <HeaderComponent />
      <DetailsComponent />
      <FooterSection />
    </Container>
  );
}
