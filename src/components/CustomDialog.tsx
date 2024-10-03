import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";

export default function CustomDialog({
  children,
  open,
  setOpen,
  setId,
  title,
}: {
  children: any;
  open: any;
  setOpen: any;
  setId: any;
  title: string;
}) {
  const handleClose = (e: any, reason: any) => {
    if (reason === "backdropClick") return;
    setOpen(false);
    if (setId) {
      setId("");
    }
  };

  return (
    <Dialog fullWidth={true} maxWidth={"md"} open={open} onClose={handleClose}>
      <DialogTitle
        sx={{ bgcolor: "#6d3481", color: "#fff", mb: 2, p: 1, px: 4, display: "flex", justifyContent: "space-between" }}
      >
        <Box>{title}</Box>
        <Box
          sx={{ ":hover": { cursor: "pointer" } }}
          onClick={() => {
            setOpen(false);
            setId("");
          }}
        >
          X
        </Box>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
