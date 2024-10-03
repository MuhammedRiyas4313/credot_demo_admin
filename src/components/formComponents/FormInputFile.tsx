import React from "react";
import { TextField, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import { Control, Controller } from "react-hook-form";

const Input = styled("input")({
  display: "none",
});

export const FormInputFile = ({ control, name, label }: { control: any; name: string; label: string }) => {
  const handleChange = (event: any) => {
    // Handle file input change
    const file = event.target.files[0];
    console.log(file);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="file-upload">{label}</label>
          <TextField
            variant="outlined"
            fullWidth
            type="file"
            name={name}
            value={value}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
      )}
    />
  );
};
