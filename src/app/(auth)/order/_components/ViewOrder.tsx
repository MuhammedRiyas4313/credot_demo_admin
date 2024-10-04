"use client";
import { CustomTable } from "@/components/CustomTable";
import { useMemo, useState } from "react";
import { useLoading, useProcessData } from "@/hooks/useProcessDataForTable";
import EditIcon from "@mui/icons-material/Edit";
import { useOrder } from "@/services/order.service";
import { format } from "date-fns";

export default function ViewOrder({ setId, setOpen }: any) {
  //STATES
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //USEMEMO
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  //DATA
  const { data: Orders, isFetching, isLoading } = useOrder({}, pagination);
  const processedData = useProcessData(Orders);
  const loading = useLoading(isFetching, isLoading);

  //COLUMNS
  const columns = useMemo(() => {
    let cols: any[] = [
      {
        header: "Date",
        accessorFn: (row: any) => (row.createdAt ? format(row?.createdAt, "dd/MM/yy hh:mm a") : ""),
        id: "date",
      },
      {
        header: "User Name",
        accessorFn: (row: any) => row?.userObj?.name,
        id: "userName",
      },
      {
        header: "Total",
        accessorFn: (row: any) => row?.grandTotal,
        id: "total",
      },
      {
        header: "Items",
        accessorFn: (row: any) => row?.itemsCount,
        id: "itemsCount",
      },
      {
        header: "status",
        accessorFn: (row: any) => row?.status,
        id: "status",
      },
      {
        header: "remark",
        accessorFn: (row: any) => row?.remark,
        id: "remark",
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
    ];
    return cols;
  }, []);

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
