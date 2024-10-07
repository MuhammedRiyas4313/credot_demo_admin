"use client";
import {
  Box,
  Button,
  Container,
  DialogActions,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from "react";
import { toastError, toastSuccess } from "@/utils/toast";
import { generateFilePath } from "@/services/url.service";
import { useAddProduct, useProductById, useUpdateProduct } from "@/services/product.service";
import { ERROR } from "@/common/error.common";
import { useCategory } from "@/services/category.service";
import { useBrand } from "@/services/brand.service";
import Textarea from "@mui/joy/Textarea";
import ReactQuillUtil from "@/componentsQuillComponents/ReactQuill";
import { useProcessData } from "@/hooks/useProcessDataForTable";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Delete";

/* 
  { 

  //THESE ARE REQUIRED BASIC FIELDS!
    name: string;
    sku: string;
    brandId: Types.ObjectId;
    brandName: string;
    categoryId: Types.ObjectId;
    categoryName: string;
    maxItemsPerOrder: number;
    
    //IF THERE IS NO VARIANTS THEN THESE FIELDS ARE REQUIRED!
    mrp: number;
    price: number;
    quantity: number;
    thumbnail: string;
    imagesArr: { image: string }[];
    description: string;
    specification: string;
    
    isBestSeller: boolean;

    variants: {
      
    
    //THESE ARE REQUIRED FIELDS IF THE VARIANT LENGTH > 0!
      name: string; //iPhone 12 Pro max 256GB Deep Purple
      title: string; // COLORS like red, silver, blue
      image: string;
      imagesArr: { image: string }[]; //to show multiple images of a variant.
      createdAt: Date;
      
      //IF THERE IS NO SUBVARIANTS THEN THESE FIELDS ARE REQUIRED!
      mrp: number;
      price: number;
      quantity: number;
      description: string;
      specification: string;
        
      subvariants: {
      //ALL THESE ARE MANDATORY IF THE SUB VARIANT ARR LENGHT > 0!
        title: string; 512 GB | 128GB | 1TB
        mrp: number;
        price: number;
        quantity: number;
        specification: string;
        description: string;
        createdAt: Date;
      }[];
    }[];
    isDeleted: boolean;
    metaTitle: string;
    metaDescription: string;
  }
*/

export const AddProduct = ({ open, setOpen, id: productId, setId }: any) => {
  //IMPORTS
  const { handleSubmit, reset } = useForm();

  //STATES
  const [name, setName] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [specification, setSpecification] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [maxItemsPerOrder, setMaxItemsPerOrder] = useState<number>(0);
  const [imagesArr, setImagesArr] = useState<any[]>([{ image: "" }]);
  const [price, setPrice] = useState<number>(0);
  const [mrp, setMrp] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [isBestSeller, setisBestSeller] = useState<boolean>(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  //DATA
  const { data: Product } = useProductById(productId, !!productId);
  const { data: categoriesList } = useCategory();
  const categories = useProcessData(categoriesList);
  const { data: brandsList } = useBrand();
  const brands = useProcessData(brandsList);

  //USEEFFECT
  useEffect(() => {
    if (Product) {
      const {
        name,
        sku,
        categoryId,
        brandId,
        specification,
        description,
        thumbnail,
        maxItemsPerOrder,
        imagesArr,
        price,
        mrp,
        quantity,
        isBestSeller,
        variants,
        metaTitle,
        metaDescription,
      } = Product;
      setThumbnail(thumbnail);
      setName(name);
      setSku(sku);
      setCategoryId(categoryId);
      setBrandId(brandId);
      setSpecification(specification);
      setDescription(description);
      setMaxItemsPerOrder(maxItemsPerOrder);
      setImagesArr(imagesArr);
      setPrice(price);
      setMrp(mrp);
      setQuantity(quantity);
      setisBestSeller(isBestSeller);
      setVariants(variants);
      setMetaTitle(metaTitle);
      setMetaDescription(metaDescription);
    }
  }, [Product]);

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

  //for prouduct image / thumbnail
  const thumbnailOnChange = useCallback(async (file: any) => {
    let thumbnail: any = await setFileToBase(file);
    setThumbnail(thumbnail);
  }, []);

  //for product details image gallery
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

  //for variant image / thumbnail onchange
  const variantThumbnailOnChange = useCallback(async (file: any, variantIndex: number) => {
    let image = await setFileToBase(file);
    setVariants((prev) => {
      const currentArr = [...prev];
      const currentObj = { ...currentArr[variantIndex] };
      currentObj.image = image;
      currentArr[variantIndex] = currentObj;
      return currentArr;
    });
  }, []);

  //for variant image gallery on change
  const variantImageOnChange = useCallback(async (file: any, variantIndex: number, imageIndex: number) => {
    let image = await setFileToBase(file);
    setVariants((prev) => {
      const currentArr = [...prev];
      const currentObj = { ...currentArr[variantIndex] };
      const currentImageArr = [...currentObj.imagesArr];
      const currentImageObj = { ...currentImageArr[imageIndex] };

      //updated image obj in imagesArr
      currentImageObj.image = image;

      currentImageArr[imageIndex] = currentImageObj;
      currentObj.imagesArr = currentImageArr;
      currentArr[variantIndex] = currentObj;
      return currentArr;
    });
  }, []);

  //add delete variants
  const addVariants = () => {
    setVariants([
      ...variants,
      {
        name: "",
        title: "",
        image: "",
        price: 0,
        mrp: 0,
        quantity: 0,
        specification: "",
        description: "",
        createdAt: new Date(),
        imagesArr: [{ image: "" }],
        subvariants: [],
      },
    ]);
  };
  const removeVariant = (index: number) => {
    setVariants((prev: any) => prev.filter((_: any, i: number) => i !== index));
  };

  //add delete sub variants
  const addSubVariants = (variantIndex: number) => {
    setVariants((prev) => {
      let currentArr = [...prev];
      let currentObj = { ...currentArr[variantIndex] };
      currentObj.subvariants = [
        ...currentObj.subvariants,
        {
          title: "",
          price: 0,
          mrp: 0,
          quantity: 0,
          specification: "",
          description: "",
          createdAt: new Date(),
        },
      ];

      currentArr[variantIndex] = currentObj;

      return currentArr;
    });
  };
  const removeSubvariant = (variantIndex: number, subvariantIndex: number) => {
    setVariants((prev) => {
      prev[variantIndex].subvariants[subvariantIndex];
      const currentArr = [...prev];
      const currentObj = { ...currentArr[variantIndex] };
      const fiteredSubArr = currentObj.subvariants.filter((_: any, i: number) => i !== subvariantIndex);

      currentArr[variantIndex].subvariants = fiteredSubArr;
      return currentArr;
    });
  };

  //For image gallery in product
  const handleAdd = useCallback(() => {
    setImagesArr((prev) => [...prev, { image: "" }]);
  }, []);
  const handleRemove = useCallback((index: number) => {
    setImagesArr((prev) => prev.filter((_, i) => i !== index));
  }, []);

  //For image gallery in variant
  const handleAddVariantImage = useCallback((variantIndex: number) => {
    setVariants((prev) => {
      const currentArr = [...prev];
      const currentObj = { ...currentArr[variantIndex] };
      currentObj.imagesArr = [...currentObj.imagesArr, { image: "" }];
      currentArr[variantIndex] = currentObj;

      return currentArr;
    });
  }, []);
  const handleRemoveVariantImage = useCallback((variantIndex: number, index: number) => {
    setVariants((prev) => {
      const currentArr = [...prev];
      const currentObj = { ...currentArr[variantIndex] };
      currentObj.imagesArr = currentObj.imagesArr.filter((_: any, i: number) => i !== index);
      currentArr[variantIndex] = currentObj;

      return currentArr;
    });
    setImagesArr((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /* Variant text onChange */
  const handleOnChangeVariantInputs = (value: any, field: string, variantIndex: number) => {
    setVariants((prev: any) => {
      const currentArr = [...prev];
      const currentObj = { ...currentArr[variantIndex] };
      currentObj[field] = value;
      currentArr[variantIndex] = currentObj;
      return currentArr;
    });
  };

  /* Sub variant text onChange */
  const handleOnChangeSubVariantInputs = (value: any, field: string, variantIndex: number, subVariantIndex: number) => {
    setVariants((prev: any) => {
      const currentArr = [...prev];
      const currentObj = { ...currentArr[variantIndex] };

      const currentSubArr = [...currentObj?.subvariants];
      const currentSubObj = { ...currentSubArr[subVariantIndex] };

      currentSubObj[field] = value;

      currentSubArr[subVariantIndex] = currentSubObj;

      currentObj.subvariants = currentSubArr;
      currentArr[variantIndex] = currentObj;

      return currentArr;
    });
  };

  //MUTANTS
  const { mutateAsync: addProduct } = useAddProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();

  //HANDLE ONSUBMIT
  const handleOnSubmit = async (data: any) => {
    try {
      //THESE ARE REQUIRED BASIC FIELDS!
      if (!name) throw new Error(ERROR.REQUIRED_FIELD("Name"));
      if (!sku) throw new Error(ERROR.REQUIRED_FIELD("Sku"));
      if (!categoryId) throw new Error(ERROR.REQUIRED_FIELD("Category"));
      if (!brandId) throw new Error(ERROR.REQUIRED_FIELD("Brand"));
      if (!maxItemsPerOrder) throw new Error(ERROR.REQUIRED_FIELD("Max item per order"));

      //IF THERE IS NO VARIANTS THEN THESE FIELDS ARE REQUIRED!
      if (!variants?.length) {
        if (!mrp) throw new Error(ERROR.REQUIRED_FIELD("MRP"));
        if (!price) throw new Error(ERROR.REQUIRED_FIELD("Price"));
        if (!quantity) throw new Error(ERROR.REQUIRED_FIELD("Quantity"));
        if (!thumbnail) throw new Error(ERROR.REQUIRED_FIELD("Thumbnail"));
        if (!specification) throw new Error(ERROR.REQUIRED_FIELD("Specification"));
        if (!description) throw new Error(ERROR.REQUIRED_FIELD("Description"));
        if (
          imagesArr?.some(
            (imgObj: any) => imgObj?.image === "" || imgObj?.image === undefined || imgObj?.image === null,
          )
        )
          throw new Error(ERROR.REQUIRED_FIELD("Images"));
      } else {
        for (const variant of variants) {
          //THESE ARE REQUIRED FIELDS IF THE VARIANT LENGTH > 0!
          if (!variant?.name) throw new Error(ERROR.REQUIRED_FIELD("Variant Name")); //iPhone 12 Pro max 256GB Deep Purple
          if (!variant?.title) throw new Error(ERROR.REQUIRED_FIELD("Variant Title")); //COLORS like red, silver, blue
          if (!variant?.image) throw new Error(ERROR.REQUIRED_FIELD("Variant Thumbnail"));
          if (
            variant?.imagesArr?.some(
              (imgObj: any) => imgObj?.image === "" || imgObj?.image === undefined || imgObj?.image === null,
            )
          )
            throw new Error(ERROR.REQUIRED_FIELD("Variant Images"));

          if (variant?.subvariants && variant?.subvariants?.length > 0) {
            for (const subvariant of variant?.subvariants) {
              //ALL THESE ARE MANDATORY IF THE SUB VARIANT ARR LENGHT > 0!
              if (!subvariant?.title) throw new Error(ERROR.REQUIRED_FIELD("Sub Variant Title"));
              if (!subvariant?.price) throw new Error(ERROR.REQUIRED_FIELD("Sub Variant Price"));
              if (!subvariant?.mrp) throw new Error(ERROR.REQUIRED_FIELD("Sub Variant MRP"));
              if (!subvariant?.quantity) throw new Error(ERROR.REQUIRED_FIELD("Sub Variant Quantity"));
              if (!subvariant?.specification) throw new Error(ERROR.REQUIRED_FIELD("Sub Variant Specification"));
              if (!subvariant?.description) throw new Error(ERROR.REQUIRED_FIELD("Sub Variant Description"));
            }
          } else {
            //IF THERE IS NO SUBVARIANTS THEN THESE FIELDS ARE REQUIRED!
            if (!variant?.price) throw new Error(ERROR.REQUIRED_FIELD("Variant Price"));
            if (!variant?.mrp) throw new Error(ERROR.REQUIRED_FIELD("Variant MRP"));
            if (!variant?.quantity) throw new Error(ERROR.REQUIRED_FIELD("Variant Quantity"));
            if (!variant?.description) throw new Error(ERROR.REQUIRED_FIELD("Variant Description"));
            if (!variant?.specification) throw new Error(ERROR.REQUIRED_FIELD("Variant Specification"));
          }
        }
      }

      const newObj = {
        name,
        sku,
        categoryId,
        brandId,
        specification,
        description,
        thumbnail,
        maxItemsPerOrder,
        imagesArr: variants?.length ? [] : imagesArr,
        price,
        mrp,
        quantity,
        isBestSeller,
        variants,
      };

      let res: any = {};

      if (productId) {
        res = await updateProduct({ productId, ...newObj });
      } else {
        res = await addProduct(newObj);
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
        <Typography sx={{ mb: 1 }} variant="h5">
          Product Details
        </Typography>
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
          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <TextField
              size="small"
              onChange={(e: any) => setSku(e.target.value)}
              value={sku}
              type="text"
              fullWidth
              label="SKU Code"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label1">Brand</InputLabel>
              <Select
                labelId="demo-simple-select-label1"
                id="demo-simple-select1"
                label="Brand"
                size="small"
                onChange={(e: any) => setBrandId(e.target.value)}
              >
                {brands?.rows && brands?.rows?.length > 0 ? (
                  brands?.rows?.map((brand: any) => (
                    <MenuItem key={brand._id} value={brand._id} dense={false}>
                      {brand.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label2">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label2"
                id="demo-simple-select2"
                label="Category"
                size="small"
                onChange={(e: any) => {
                  console.log(e.target, "E.TARGET");
                  setCategoryId(e.target.value);
                }}
              >
                {categories?.rows && categories?.rows.length > 0 ? (
                  categories?.rows.map((cat: any) => (
                    <MenuItem key={cat._id} value={cat._id} dense={false}>
                      {cat?.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              size="small"
              onChange={(e: any) => setMaxItemsPerOrder(e.target.value)}
              value={maxItemsPerOrder}
              type="number"
              fullWidth
              label="Max items per order"
              variant="outlined"
            />
          </Grid>

          {!variants?.length && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  onChange={(e: any) => setMrp(e.target.value)}
                  value={mrp}
                  type="number"
                  fullWidth
                  label="MRP"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  onChange={(e: any) => setPrice(e.target.value)}
                  value={price}
                  type="number"
                  fullWidth
                  label="Price"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  size="small"
                  onChange={(e: any) => setQuantity(e.target.value)}
                  value={quantity}
                  type="number"
                  fullWidth
                  label="Quantity"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} sx={{ flexDirection: "column" }}>
                  <Grid item xs={12} md={6}>
                    <InputLabel id="file-upload">Thumbnail</InputLabel>
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      onChange={(e: any) => thumbnailOnChange(e.target.files[0])}
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
                        height={250}
                        style={{ marginTop: 5 }}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
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
                              width={200}
                              height={150}
                              style={{ marginTop: 5 }}
                            />
                          )}
                        </Grid>
                      </Grid>
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
                      {imagesArr?.length > 1 && (
                        <RemoveIcon onClick={() => handleRemove(index)} sx={{ cursor: "pointer", color: "red" }} />
                      )}
                    </Box>
                  </React.Fragment>
                ))}

              <Grid item xs={12}>
                <Grid container spacing={2} sx={{ flexDirection: "column" }}>
                  <Grid item xs={12}>
                    <InputLabel id="spec">Description</InputLabel>
                    <Textarea
                      minRows={2}
                      onChange={(e: any) => setDescription(e.target.value)}
                      value={description}
                      name="description"
                      placeholder="Description..."
                      size="sm"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} sx={{ flexDirection: "column" }}>
                  <Grid item xs={12}>
                    <InputLabel id="spec">Specification</InputLabel>
                    <ReactQuillUtil
                      setterFunction={(e: any) => setSpecification(e)}
                      value={specification}
                      key={"specification"}
                      placeholder="Specification ..."
                    />
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
          {productId && (
            <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
              <InputLabel id="file-upload" sx={{ mr: 2 }}>
                Is best Seller ?
              </InputLabel>
              <FormControlLabel
                control={<Switch checked={isBestSeller} onChange={(e: any) => setisBestSeller(e.target.checked)} />}
                label={isBestSeller ? "Yes" : "No"}
              />
            </Grid>
          )}
        </Grid>
        <Divider sx={{ mt: 2, mb: 3 }} />
        {/* Variants Start */}
        {variants?.length > 0 && (
          <Typography sx={{ mb: 1, textDecoration: "#6d3481" }} variant="h5">
            Variant Details
          </Typography>
        )}
        {variants &&
          variants?.length > 0 &&
          variants?.map((variant: any, variantIndex: number) => (
            <React.Fragment key={variantIndex}>
              <Typography sx={{ mb: 1 }} variant="h6">
                variant - ({variantIndex + 1})
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <TextField
                    size="small"
                    onChange={(e: any) => handleOnChangeVariantInputs(e.target.value, "name", variantIndex)}
                    value={variant.name}
                    type="text"
                    fullWidth
                    label="Variant Name"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <TextField
                    size="small"
                    onChange={(e: any) => handleOnChangeVariantInputs(e.target.value, "title", variantIndex)}
                    value={variant.title}
                    type="text"
                    fullWidth
                    label="Variant Title"
                    variant="outlined"
                  />
                </Grid>
                {!variant?.subvariants?.length && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        size="small"
                        onChange={(e: any) => handleOnChangeVariantInputs(e.target.value, "mrp", variantIndex)}
                        value={variant?.mrp}
                        type="number"
                        fullWidth
                        label=" Variant MRP"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        size="small"
                        onChange={(e: any) => handleOnChangeVariantInputs(e.target.value, "price", variantIndex)}
                        value={variant?.price}
                        type="number"
                        fullWidth
                        label="Variant Price"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        size="small"
                        onChange={(e: any) => handleOnChangeVariantInputs(e.target.value, "quantity", variantIndex)}
                        value={variant?.quantity}
                        type="number"
                        fullWidth
                        label="Variant Quantity"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2} sx={{ flexDirection: "column" }}>
                        <Grid item xs={12}>
                          <InputLabel id="spec">Variant Description</InputLabel>
                          <Textarea
                            minRows={2}
                            onChange={(e: any) => setDescription(e.target.value)}
                            value={description}
                            name="description"
                            placeholder="Description..."
                            size="sm"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2} sx={{ flexDirection: "column" }}>
                        <Grid item xs={12}>
                          <InputLabel id="spec">Variant Specification</InputLabel>
                          <ReactQuillUtil
                            setterFunction={(e: any) => setSpecification(e)}
                            value={specification}
                            key={"specification"}
                            placeholder="Specification ..."
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <Grid container spacing={2} sx={{ flexDirection: "column" }}>
                    <Grid item xs={12} md={6}>
                      <InputLabel id="file-upload">Variant Thumbnail</InputLabel>
                      <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        onChange={(e: any) => variantThumbnailOnChange(e.target.files[0], variantIndex)}
                        type="file"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {variant?.image && (
                        <img
                          src={variant.image.startsWith("data:") ? variant.image : generateFilePath(variant.image)}
                          alt="thumbnail"
                          width={100}
                          height={100}
                          style={{ marginTop: 5, borderRadius: "50%" }}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                {variant?.imagesArr &&
                  variant?.imagesArr?.length > 0 &&
                  variant?.imagesArr?.map((el: any, index: number) => (
                    <React.Fragment key={index}>
                      <Grid item xs={12}>
                        <Grid container spacing={2} sx={{ flexDirection: "column" }}>
                          <Grid item xs={12}>
                            <InputLabel id="file-upload">Variant Image - {index + 1}</InputLabel>
                            <TextField
                              variant="outlined"
                              fullWidth
                              size="small"
                              onChange={(e: any) => variantImageOnChange(e.target.files[0], variantIndex, index)}
                              type="file"
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            {el?.image && (
                              <img
                                src={el?.image && el.image.startsWith("data:") ? el?.image : generateFilePath(el.image)}
                                alt="Variant image"
                                width={100}
                                height={150}
                                style={{ marginTop: 5 }}
                              />
                            )}
                          </Grid>
                        </Grid>
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
                        {variant?.imagesArr?.length - 1 === index && (
                          <AddIcon
                            onClick={() => handleAddVariantImage(variantIndex)}
                            sx={{ cursor: "pointer", color: "blue" }}
                          />
                        )}
                        {variant?.imagesArr?.length > 1 && (
                          <RemoveIcon
                            onClick={() => handleRemoveVariantImage(variantIndex, index)}
                            sx={{ cursor: "pointer", color: "red" }}
                          />
                        )}
                      </Box>
                    </React.Fragment>
                  ))}

                <Grid xs={12} spacing={2} sx={{ padding: 10, paddingRight: 5 }}>
                  {/* Sub variants */}
                  <Grid container spacing={2}>
                    {variant?.subvariants &&
                      variant?.subvariants?.length > 0 &&
                      variant?.subvariants?.map((sub: any, subVariantIndex: number) => (
                        <React.Fragment key={subVariantIndex}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              size="small"
                              onChange={(e: any) =>
                                handleOnChangeSubVariantInputs(e.target.value, "title", variantIndex, subVariantIndex)
                              }
                              value={sub.title}
                              type="text"
                              fullWidth
                              label="Sub variant Title"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              size="small"
                              onChange={(e: any) =>
                                handleOnChangeSubVariantInputs(e.target.value, "mrp", variantIndex, subVariantIndex)
                              }
                              value={sub?.mrp}
                              type="number"
                              fullWidth
                              label="Sub variant MRP"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              size="small"
                              onChange={(e: any) =>
                                handleOnChangeSubVariantInputs(e.target.value, "price", variantIndex, subVariantIndex)
                              }
                              value={sub?.price}
                              type="number"
                              fullWidth
                              label="Sub variant Price"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              size="small"
                              onChange={(e: any) =>
                                handleOnChangeSubVariantInputs(
                                  e.target.value,
                                  "quantity",
                                  variantIndex,
                                  subVariantIndex,
                                )
                              }
                              value={sub?.quantity}
                              type="number"
                              fullWidth
                              label="Sub variant Quantity"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container spacing={2} sx={{ flexDirection: "column" }}>
                              <Grid item xs={12}>
                                <InputLabel id="spec">Sub variant Description</InputLabel>
                                <Textarea
                                  minRows={2}
                                  onChange={(e: any) =>
                                    handleOnChangeSubVariantInputs(
                                      e.target.value,
                                      "description",
                                      variantIndex,
                                      subVariantIndex,
                                    )
                                  }
                                  value={sub?.description}
                                  name="description"
                                  placeholder="Sub variant Description..."
                                  size="sm"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container spacing={2} sx={{ flexDirection: "column" }}>
                              <Grid item xs={12}>
                                <InputLabel id="spec">Sub variant Specification</InputLabel>
                                <ReactQuillUtil
                                  setterFunction={(e: any) =>
                                    handleOnChangeSubVariantInputs(e, "specification", variantIndex, subVariantIndex)
                                  }
                                  value={sub?.specification}
                                  key={"specification"}
                                  placeholder="Sub variant Specification ..."
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "end",
                              paddingBottom: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                cursor: "pointer",
                              }}
                            >
                              Delete sub variant ({subVariantIndex + 1}) ?
                              <RemoveIcon
                                onClick={() => removeSubvariant(variantIndex, subVariantIndex)}
                                sx={{ cursor: "pointer", color: "red" }}
                              />
                            </Box>
                          </Grid>
                          <Divider sx={{ mt: 2, mb: 3 }} />
                        </React.Fragment>
                      ))}
                  </Grid>
                  {/* Sub variant End */}
                  <Box
                    sx={{
                      display: "flex",
                      cursor: "pointer",
                      justifyContent: "end",
                      marginBottom: 3,
                    }}
                  >
                    Add Sub variant ?
                    <AddIcon onClick={() => addSubVariants(variantIndex)} sx={{ cursor: "pointer", color: "blue" }} />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      gap: 3,
                      pt: 2,
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      Delete variant ({variantIndex + 1}) ?
                      <RemoveIcon
                        onClick={() => removeVariant(variantIndex)}
                        sx={{ cursor: "pointer", color: "red" }}
                      />
                    </Box>
                  </Box>
                  <Divider sx={{ mt: 2, mb: 3 }} />
                </Grid>
              </Grid>
            </React.Fragment>
          ))}
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            gap: 3,
            pt: 2,
            flex: 1,
          }}
        >
          Add variants ? <AddIcon onClick={() => addVariants()} sx={{ cursor: "pointer", color: "blue" }} />
        </Box>
        {/* Variants ends */}
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
