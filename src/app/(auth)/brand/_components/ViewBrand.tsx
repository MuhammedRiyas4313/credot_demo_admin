"use client";
import { CustomTable } from "@/components/CustomTable";
import { useMemo, useState } from "react";
import { useLoading, useProcessData } from "@/hooks/useProcessDataForTable";
import RemoveIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toastError, toastSuccess } from "@/utils/toast";
import { useBrand, useDeleteBrand } from "@/services/brand.service";
import { generateFilePath } from "@/services/url.service";

export default function ViewBrand({ setId, setOpen }: any) {
  //STATES
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //USEMEMO
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  //DATA
  const { data: brands, isFetching, isLoading } = useBrand({}, pagination);
  const processedData = useProcessData(brands);
  const loading = useLoading(isFetching, isLoading);

  //COLUMNS
  const columns = useMemo(() => {
    let cols: any[] = [
      {
        header: "Logo",
        cell: ({ row: { original: row } }: any) =>
          row.logo ? <img src={generateFilePath(row?.logo)} alt="LOGO" width={100} height={60} /> : "No Logo",
        id: "logo",
      },
      {
        header: "Brand",
        accessorFn: (row: any) => row.name,
        id: "brand",
      },
      {
        header: "Priority",
        accessorFn: (row: any) => (row.priority ? row.priority : "No priority"),
        id: "priority",
      },
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
          return <RemoveIcon sx={{ cursor: "pointer", color: "red" }} onClick={() => handleDeleteBrand(row?._id)} />;
        },
        id: "action3",
      },
    ];
    return cols;
  }, []);

  //MUTANTS
  const { mutateAsync: deleteBrand } = useDeleteBrand();

  //HANDLERS
  const handleDeleteBrand = async (id: any) => {
    try {
      if (window.confirm("Are you sure you want to delete the brand ?")) {
        const res = await deleteBrand(id);
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
