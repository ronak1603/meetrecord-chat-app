import { Button, Container } from "@mui/material";

const Dashboard = () => {
  return (
    <Container className="flex w-full justify-between gap-2">
      <Container className="bg-red-300">
        <Button type="button" className="bg-[#0b3a65ff] text-white">
          Join Chat Room
        </Button>
      </Container>
      <Container className="bg-gray-300">
        <Button type="button" className="bg-[#0b3a65ff] text-white">
          Create Chat Room
        </Button>
      </Container>
    </Container>
  );
};

export default Dashboard;
