"use client";
import { Button, Container, DialogActions, Grid, InputLabel, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { toastError, toastSuccess } from "@/utils/toast";
import { useAddBanner, useUpdateBanner } from "@/services/banner.service";
import { generateFilePath } from "@/services/url.service";
import { useAddBrand, useBrandById, useUpdateBrand } from "@/services/brand.service";
import { ERROR } from "@/common/error.common";

/* 
  { 
    name: string;
    logo: string;
    priority: any; //for sort to show in a specific order for user not a required field either null or number
    isDeleted: boolean;
  }
*/

export const AddBrand = ({ open, setOpen, id: brandId, setId }: any) => {
  //IMPORTS
  const { handleSubmit, reset } = useForm();

  //STATES
  const [logo, setLogo] = useState<any>("");
  const [name, setName] = useState("");
  const [priority, setPriority] = useState();

  //DATA
  const { data: brand } = useBrandById(brandId, !!brandId);

  //USEEFFECT
  useEffect(() => {
    if (brand) {
      const { name, logo, priority } = brand;
      setPriority(priority);
      setName(name);
      setLogo(logo);
    }
  }, [brand]);

  //HANDLE CHANGERS
  const setFileToBase = useCallback((file: any) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const result = reader?.result;
        resolve(result);
      };
    });
  }, []);
  const imageOnChange = useCallback(async (file: any) => {
    let logo: any = await setFileToBase(file);
    setLogo(logo);
  }, []);

  //MUTANTS
  const { mutateAsync: addBrand } = useAddBrand();
  const { mutateAsync: updateBrand } = useUpdateBrand();

  //HANDLE ONSUBMIT
  const handleOnSubmit = async (data: any) => {
    try {
      if (!name) throw new Error(ERROR.REQUIRED_FIELD("Name"));
      if (!logo) throw new Error(ERROR.REQUIRED_FIELD("Logo"));

      const newObj = {
        logo,
        name,
        priority,
      };

      let res: any = {};

      if (brandId) {
        res = await updateBrand({ brandId, ...newObj });
      } else {
        res = await addBrand(newObj);
      }

      if (res.data?.message) {
        toastSuccess(res.data.message);
        reset();
        setOpen(false);
        setId("");
      }
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <Container sx={{ p: 1 }}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Grid container spacing={2} sx={{ flexDirection: "column" }}>
              <Grid item xs={12}>
                <InputLabel id="file-upload">Image</InputLabel>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  onChange={(e: any) => imageOnChange(e.target.files[0])}
                  type="file"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <img
                  src={logo.startsWith("data:") ? logo : generateFilePath(logo)}
                  alt="brand_logo"
                  width={200}
                  height={200}
                  style={{ marginTop: 5 }}
                />
                ,
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              size="small"
              onChange={(e: any) => setName(e.target.value)}
              value={name}
              type="text"
              fullWidth
              label="Name"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              size="small"
              onChange={(e: any) => setPriority(e.target.value)}
              value={priority}
              type="number"
              fullWidth
              label="Priority"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <DialogActions sx={{ mt: 4 }}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#b31b10", ":hover": { bgcolor: "#c91d10" } }}
            onClick={() => {
              setOpen(false);
              setId("");
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" sx={{ bgcolor: "#6d3481", ":hover": { bgcolor: "#823f99" } }} type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Container>
  );
};
