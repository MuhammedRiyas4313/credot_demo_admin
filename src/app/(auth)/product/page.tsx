"use client";
import { Button, Container, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import ViewProduct from "./_components/ViewProduct";
import SetHeaderName from "@/components/SetHeaderName";
import CustomDialog from "@/components/CustomDialog";
import { AddProduct } from "./_components/AddProduct";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  return (
    <div style={{ backgroundColor: "#f0f0f2", padding: "20px", minHeight: "100vh" }}>
      <SetHeaderName name="Product" />
      <Container sx={{ mt: 2 }}>
        <Grid sx={{ mb: 2 }}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#6d3481", ":hover": { bgcolor: "#823f99" } }}
            onClick={() => setOpen(true)}
          >
            Add <AddIcon sx={{ ml: 1 }} />
          </Button>
        </Grid>
        <Grid>
          <ViewProduct setId={setId} setOpen={setOpen} />
        </Grid>
      </Container>
      <CustomDialog title={`${id ? "update" : "Add new"} Product`} open={open} setOpen={setOpen} setId={setId}>
        <AddProduct id={id} setId={setId} open={open} setOpen={setOpen} />
      </CustomDialog>
    </div>
  );
};

export default Page;
