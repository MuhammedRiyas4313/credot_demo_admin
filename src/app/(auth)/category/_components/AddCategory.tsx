"use client";
import { Button, Container, DialogActions, Grid, InputLabel, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { toastError, toastSuccess } from "@/utils/toast";
import { generateFilePath } from "@/services/url.service";
import { useAddCategory, useCategoryById, useUpdateCategory } from "@/services/category.service";
import { ERROR } from "@/common/error.common";

/* 
  { 
    name: string;
    thumbnail: string;
  }
*/

export const AddCategory = ({ open, setOpen, id: categoryId, setId }: any) => {
  //IMPORTS
  const { handleSubmit, reset } = useForm();

  //STATES
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState<any>("");

  //DATA
  const { data: category } = useCategoryById(categoryId, !!categoryId);

  //USEEFFECT
  useEffect(() => {
    if (category) {
      const { name, thumbnail } = category;
      setThumbnail(thumbnail);
      setName(name);
    }
  }, [category]);

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
    let thumbnail: any = await setFileToBase(file);
    setThumbnail(thumbnail);
  }, []);

  //MUTANTS
  const { mutateAsync: addCategory } = useAddCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  //HANDLE ONSUBMIT
  const handleOnSubmit = async (data: any) => {
    try {
      if (!name) throw new Error(ERROR.REQUIRED_FIELD("Name"));
      if (!thumbnail) throw new Error(ERROR.REQUIRED_FIELD("Thumbnail"));

      const newObj = {
        thumbnail,
        name,
      };

      let res: any = {};

      if (categoryId) {
        res = await updateCategory({ categoryId, ...newObj });
      } else {
        res = await addCategory(newObj);
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
          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
          <Grid item xs={12}>
            <Grid container spacing={2} sx={{ flexDirection: "column" }}>
              <Grid item xs={12} md={6}>
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
                {thumbnail && (
                  <img
                    src={thumbnail.startsWith("data:") ? thumbnail : generateFilePath(thumbnail)}
                    alt="thumbnail"
                    width={200}
                    height={200}
                    style={{ marginTop: 5 }}
                  />
                )}
              </Grid>
            </Grid>
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
