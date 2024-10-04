"use client";
import { CustomTable } from "@/components/CustomTable";
import { useMemo, useState } from "react";
import { useLoading, useProcessData } from "@/hooks/useProcessDataForTable";
import RemoveIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toastError, toastSuccess } from "@/utils/toast";
import { useCategory, useDeleteCategory } from "@/services/category.service";
import { generateFilePath } from "@/services/url.service";

export default function ViewCategory({ setId, setOpen }: any) {
  //STATES
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //USEMEMO
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  //DATA
  const { data: categories, isFetching, isLoading } = useCategory({}, pagination);
  const processedData = useProcessData(categories);
  const loading = useLoading(isFetching, isLoading);

  //COLUMNS
  const columns = useMemo(() => {
    let cols: any[] = [
      {
        header: "Thumbnail",
        cell: ({ row: { original: row } }: any) =>
          row.thumbnail ? (
            <img src={generateFilePath(row?.thumbnail)} alt="thumbnail" width={100} height={60} />
          ) : (
            "No thumbnail"
          ),
        id: "thumbnail",
      },
      {
        header: "Category",
        accessorFn: (row: any) => row.name,
        id: "category",
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
          return <RemoveIcon sx={{ cursor: "pointer", color: "red" }} onClick={() => handleDeleteCategory(row?._id)} />;
        },
        id: "action3",
      },
    ];
    return cols;
  }, []);

  //MUTANTS
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  //HANDLERS
  const handleDeleteCategory = async (id: any) => {
    try {
      if (window.confirm("Are you sure you want to delete the Category ?")) {
        const res = await deleteCategory(id);
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
