"use client";
import { Button, Container, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import SetHeaderName from "@/components/SetHeaderName";
// import CustomDialog from "@/components/CustomDialog";
import ViewUser from "./_components/ViewUser";

const Page = () => {
  // const [open, setOpen] = useState(false);
  // const [id, setId] = useState("");

  return (
    <div style={{ backgroundColor: "#f0f0f2", padding: "20px", minHeight: "100vh" }}>
      <SetHeaderName name="User" />
      <Container sx={{ mt: 2 }}>
        <Grid>
          <ViewUser />
        </Grid>
      </Container>
    </div>
  );
};

export default Page;
