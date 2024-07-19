import { useAuth } from "@/context/AuthContext";
import useChatMessages from "@/services/useChatMessages";
import { MoreVert } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Fragment, useState } from "react";

const LeaveAndCopytButton = ({ roomId }: { roomId: string }) => {
  const { isleavingRoom, leaveChatRoom } = useChatMessages(roomId);

  const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null);
  const open = Boolean(openMenu);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenu(event.currentTarget);
  };

  const handleClose = () => {
    setOpenMenu(null);
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    handleClose();
  };

  return (
    <Fragment>
      <Button
        variant="contained"
        color="secondary"
        sx={{
          textTransform: "none",
          height: "48px",
          padding: "12px 24px 12px 24px",
          fontSize: "14px",
          position: "fixed",
          right: "16px",
          top: "16px",
          fontWeight: "500",
          border: "1px solid #1E3A8A",
          color: "#1A1A1A",
          boxShadow: "0",
          background: isleavingRoom ? "#9ca3af" : "#fff",

          "&:hover": {
            background: "#fff",
          },
        }}
        onClick={() => leaveChatRoom(roomId as string)}
        endIcon={isleavingRoom ? <CircularProgress size={20} /> : null}
        disabled={isleavingRoom}
      >
        End Room Session
      </Button>
      <IconButton
        aria-label="more options"
        sx={{
          textTransform: "none",
          height: "48px",
          padding: "0px",
          fontSize: "14px",
          position: "fixed",
          left: "16px",
          bottom: "16px",
          fontWeight: "500",
          color: "#fff",
          boxShadow: "0",
          "&:hover": {
            boxShadow: "0",
          },
        }}
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>

      <Menu
        anchorEl={openMenu}
        open={open}
        onClose={handleClose}
        sx={{
          width: 200,
          maxWidth: "calc(100% - 48px)",
        }}
      >
        <MenuItem onClick={handleCopyRoomId}>Copy Room ID</MenuItem>
      </Menu>
    </Fragment>
  );
};

export default LeaveAndCopytButton;
