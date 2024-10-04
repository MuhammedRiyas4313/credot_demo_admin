"use client";
import { CustomTable } from "@/components/CustomTable";
import { useMemo, useState } from "react";
import { useLoading, useProcessData } from "@/hooks/useProcessDataForTable";
import RemoveIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toastError, toastSuccess } from "@/utils/toast";
import { useProduct, useDeleteProduct, useUpdateIsBestSeller } from "@/services/product.service";
import { generateFilePath } from "@/services/url.service";

export default function ViewProduct({ setId, setOpen }: any) {
  //STATES
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //USEMEMO
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  //DATA
  const { data: categories, isFetching, isLoading } = useProduct({}, pagination);
  const processedData = useProcessData(categories);
  const loading = useLoading(isFetching, isLoading);

  //MUTANTS
  const { mutateAsync: updateIsBestSeller } = useUpdateIsBestSeller();

  //HANDLERS
  const updateStatus = async (id: string, isBestSeller: boolean) => {
    try {
      let res = await updateIsBestSeller({ productId: id, isBestSeller });
      if (res?.data) {
        toastSuccess(res.data?.message);
      }
    } catch (error) {
      toastError(error);
    }
  };

  //COLUMNS
  const columns = useMemo(() => {
    let cols: any[] = [
      {
        header: "Thumbnail",
        cell: ({ row: { original: row } }: any) =>
          row.thumbnail ? (
            <img src={generateFilePath(row?.thumbnail)} alt="thumbnail" width={100} height={60} />
          ) : (
            <img src={generateFilePath(row?.variants[0].image)} alt="thumbnail" width={100} height={60} />
          ),
        id: "thumbnail",
      },
      {
        header: "Product",
        accessorFn: (row: any) => row.name,
        id: "Product",
      },
      {
        header: "Category",
        accessorFn: (row: any) => row.categoryName,
        id: "category",
      },
      {
        header: "Brand",
        accessorFn: (row: any) => row.brandName,
        id: "brand",
      },
      // {
      //   header: "",
      //   cell: ({ row: { original: row } }: any) => {
      //     return (
      //       <FormControlLabel
      //         control={
      //           <Switch
      //             checked={row?.status === STATUS.ACTIVE}
      //             onChange={(e: any) => {
      //               console.log(e.target.checked, "checked");
      //               updateStatus(row?._id, e.target.checked);
      //             }}
      //           />
      //         }
      //         label={""}
      //       />
      //     );
      //   },
      //   id: "action1",
      // },
      {
        header: "",
        cell: ({ row: { original: row } }: any) => {
          return (
            <EditIcon
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setId(row?._id);
                setOpen(true);
              }}
            />
          );
        },
        id: "action4",
      },
      {
        header: "",
        cell: ({ row: { original: row } }: any) => {
          return <RemoveIcon sx={{ cursor: "pointer", color: "red" }} onClick={() => handleDeleteProduct(row?._id)} />;
        },
        id: "action3",
      },
    ];
    return cols;
  }, []);

  //MUTANTS
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  //HANDLERS
  const handleDeleteProduct = async (id: any) => {
    try {
      if (window.confirm("Are you sure you want to delete the Product ?")) {
        const res = await deleteProduct(id);
        if (res.data.message) {
          toastSuccess(res.data.message);
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <CustomTable
      data={processedData.rows}
      totalCount={processedData.total}
      columns={columns}
      pageIndex={pageIndex}
      pageSize={pageSize}
      loading={loading}
      serverPagination
      setPageIndex={setPageIndex}
      setPageSize={setPageSize}
    />
  );
}
