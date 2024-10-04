"use client";
import { CustomTable } from "@/components/CustomTable";
import { useMemo, useState } from "react";
import { useLoading, useProcessData } from "@/hooks/useProcessDataForTable";
import EditIcon from "@mui/icons-material/Edit";
import { useUpdateUserStatus, useUser } from "@/services/user.service";
import { format } from "date-fns";
import { FormControlLabel, Switch } from "@mui/material";
import { STATUS, USER_STATUS } from "@/common/constant.common";
import { toastError, toastSuccess } from "@/utils/toast";

export default function ViewUser({ setId, setOpen }: any) {
  //STATES
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //USEMEMO
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  //DATA
  const { data: Users, isFetching, isLoading } = useUser({}, pagination);
  const processedData = useProcessData(Users);
  const loading = useLoading(isFetching, isLoading);

  //MUTANTS
  const { mutateAsync: updateUserStatus } = useUpdateUserStatus();

  //COLUMNS
  const columns = useMemo(() => {
    let cols: any[] = [
      {
        header: "Created At",
        accessorFn: (row: any) => (row.createdAt ? format(row?.createdAt, "dd/MM/yy hh:mm a") : ""),
        id: "date",
      },
      {
        header: "Name",
        accessorFn: (row: any) => row?.name,
        id: "userName",
      },
      {
        header: "status",
        accessorFn: (row: any) => row?.status,
        id: "status",
      },
      {
        header: "",
        cell: ({ row: { original: row } }: any) => {
          return (
            <FormControlLabel
              control={
                <Switch
                  checked={row?.status === STATUS.ACTIVE}
                  onChange={(e: any) => {
                    updateStatus({
                      ...row,
                      status: e.target.checked ? USER_STATUS.ACTIVE : USER_STATUS.BLOCKED,
                      userId: row?._id,
                    });
                  }}
                />
              }
              label={""}
            />
          );
        },
        id: "action1",
      },
    ];
    return cols;
  }, []);

  //HANDLERS
  const updateStatus = async (obj: any) => {
    try {
      const res = await updateUserStatus(obj);
      if (res.data?.message) {
        toastSuccess(res?.data.message);
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
