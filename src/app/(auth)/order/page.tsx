"use client";
import { Button, Container, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import SetHeaderName from "@/components/SetHeaderName";
import CustomDialog from "@/components/CustomDialog";
import { UpdateStatus } from "./_components/UpdateStatus";
import ViewOrder from "./_components/ViewOrder";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  return (
    <div style={{ backgroundColor: "#f0f0f2", padding: "20px", minHeight: "100vh" }}>
      <SetHeaderName name="Oder" />
      <Container sx={{ mt: 2 }}>
        <Grid>
          <ViewOrder setId={setId} setOpen={setOpen} />
        </Grid>
      </Container>
      <CustomDialog title={`update Order`} open={open} setOpen={setOpen} setId={setId}>
        <UpdateStatus id={id} setId={setId} open={open} setOpen={setOpen} />
      </CustomDialog>
    </div>
  );
};

export default Page;
