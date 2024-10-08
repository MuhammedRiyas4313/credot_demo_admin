"use client";
import { Button, Container, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import ViewBrand from "./_components/ViewBrand";
import SetHeaderName from "@/components/SetHeaderName";
import CustomDialog from "@/components/CustomDialog";
import { AddBrand } from "./_components/AddBrand";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  return (
    <div style={{ backgroundColor: "#f0f0f2", padding: "20px", minHeight: "100vh" }}>
      <SetHeaderName name="Brand" />
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
          <ViewBrand setId={setId} setOpen={setOpen} />
        </Grid>
      </Container>
      <CustomDialog title={`${id ? "update" : "Add new"} brand`} open={open} setOpen={setOpen} setId={setId}>
        <AddBrand id={id} setId={setId} open={open} setOpen={setOpen} />
      </CustomDialog>
    </div>
  );
};

export default Page;
