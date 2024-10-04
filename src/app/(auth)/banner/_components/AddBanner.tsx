"use client";
import {
  Box,
  Button,
  Container,
  DialogActions,
  FormControlLabel,
  Grid,
  InputLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from "react";
import { toastError, toastSuccess } from "@/utils/toast";
import { useAddBanner, useBannerById, useUpdateBanner } from "@/services/banner.service";
import { STATUS } from "@/common/constant.common";
import { ERROR } from "@/common/error.common";
import { generateFilePath } from "@/services/url.service";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Delete";

/* 
  {
   status: STATUS_TYPE;
   imagesArr: { 
    image: string; 
    title: string; 
    tagline: string; 
    releaseDate: string; 
    buttonText: string 
   }[];
}
*/

const FIELDS = {
  image: "image",
  title: "title",
  tagline: "tagline",
  releaseDate: "releaseDate",
  buttonText: "buttonText",
  url: "url",
} as const;
type FIELDS_TYPE = keyof typeof FIELDS;

export const AddBanner = ({ open, setOpen, id: bannerId, setId }: any) => {
  //IMPORTS
  const { register, handleSubmit, reset, control, setValue } = useForm();

  //STATES
  const [status, setStatus] = useState(false);
  const [imagesArr, setImagesArr] = useState<any[]>([
    { image: "", title: "", tagline: "", releaseDate: "", buttonText: "", url: "" },
  ]);

  //DATA
  const { data: banner } = useBannerById(bannerId, !!bannerId);

  //USEEFFECT
  useEffect(() => {
    if (banner) {
      const { status, imagesArr } = banner;
      setStatus(status === STATUS.ACTIVE ? true : false);
      setImagesArr(imagesArr);
    }
  }, [banner]);

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

  const imageOnChange = useCallback(async (file: any, index: number) => {
    let temp = await setFileToBase(file);
    setImagesArr((prevImagesArr) => {
      const updatedImagesArr = [...prevImagesArr];
      const updatedImageObj = { ...updatedImagesArr[index] };
      updatedImageObj.image = temp;
      updatedImagesArr[index] = updatedImageObj;
      return updatedImagesArr;
    });
  }, []);

  const textOnChange = useCallback(async (text: string, index: number, field: FIELDS_TYPE) => {
    setImagesArr((prevImagesArr) => {
      const updatedImagesArr = [...prevImagesArr];
      const updatedImageObj = { ...updatedImagesArr[index] };
      updatedImageObj[field] = text;
      updatedImagesArr[index] = updatedImageObj;
      return updatedImagesArr;
    });
  }, []);

  const handleAdd = useCallback(() => {
    setImagesArr((prev) => [...prev, { image: "", title: "", tagline: "", releaseDate: "", buttonText: "", url: "" }]);
  }, []);

  const handleRemove = useCallback((index: number) => {
    setImagesArr((prev) => prev.filter((_, i) => i !== index));
  }, []);

  //MUTANTS
  const { mutateAsync: addBanner } = useAddBanner();
  const { mutateAsync: updateBanner } = useUpdateBanner();

  //HANDLE ONSUBMIT
  const handleOnSubmit = async (data: any) => {
    try {
      const isValid = imagesArr.every(
        (imageObj) => imageObj.image && imageObj.title && imageObj.image.trim() !== "" && imageObj.title.trim() !== "",
      );

      if (!isValid) {
        throw new Error(ERROR.REQUIRED_FIELDS("Title and Image"));
      }
      const newObj = {
        imagesArr,
        status: status ? STATUS.ACTIVE : STATUS.INACTIVE,
      };

      let res: any = {};

      if (bannerId) {
        res = await updateBanner({ bannerId, ...newObj });
      } else {
        res = await addBanner(newObj);
      }

      if (res.data?.message) {
        toastSuccess(res.data.message);
        reset();
        setOpen(false);
        setId("");
        setImagesArr([{ image: "", title: "", tagline: "", releaseDate: "", buttonText: "", url: "" }]);
      }
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <Container sx={{ p: 1 }}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Grid container spacing={2}>
          {imagesArr &&
            imagesArr?.length > 0 &&
            imagesArr?.map((el: any, index: number) => (
              <React.Fragment key={index}>
                <Grid item xs={12}>
                  <Grid container spacing={2} sx={{ flexDirection: "column" }}>
                    <Grid item xs={12}>
                      <InputLabel id="file-upload">Image - {index + 1}</InputLabel>
                      <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        onChange={(e: any) => imageOnChange(e.target.files[0], index)}
                        type="file"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {el?.image && (
                        <img
                          src={el?.image && el.image.startsWith("data:") ? el?.image : generateFilePath(el.image)}
                          alt="banner_img"
                          width={400}
                          height={200}
                          style={{ marginTop: 5 }}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    onChange={(e: any) => textOnChange(e.target.value, index, FIELDS.title)}
                    value={el.title}
                    type="text"
                    fullWidth
                    label="Title"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    onChange={(e: any) => textOnChange(e.target.value, index, FIELDS.tagline)}
                    value={el.tagline}
                    type="text"
                    fullWidth
                    label="Tagline"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    onChange={(e: any) => textOnChange(e.target.value, index, FIELDS.releaseDate)}
                    value={el.releaseDate}
                    type="text"
                    fullWidth
                    label="Release"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    onChange={(e: any) => textOnChange(e.target.value, index, FIELDS.buttonText)}
                    value={el.buttonText}
                    type="text"
                    fullWidth
                    label="Button Text"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    size="small"
                    onChange={(e: any) => textOnChange(e.target.value, index, FIELDS.url)}
                    value={el.url}
                    type="text"
                    fullWidth
                    label="URL"
                    variant="outlined"
                  />
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    gap: 3,
                    pt: 5,
                    flex: 1,
                  }}
                >
                  {imagesArr?.length - 1 === index && (
                    <AddIcon onClick={() => handleAdd()} sx={{ cursor: "pointer", color: "blue" }} />
                  )}
                  <RemoveIcon onClick={() => handleRemove(index)} sx={{ cursor: "pointer", color: "red" }} />
                </Box>
              </React.Fragment>
            ))}
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
            <InputLabel id="file-upload" sx={{ mr: 2 }}>
              Status
            </InputLabel>
            <FormControlLabel
              control={<Switch checked={status} onChange={(e: any) => setStatus(e.target.checked)} />}
              label={status ? STATUS.ACTIVE : STATUS.INACTIVE}
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
