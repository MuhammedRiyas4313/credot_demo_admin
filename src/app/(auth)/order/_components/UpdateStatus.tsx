"use client";
import { Button, Container, DialogActions, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toastError, toastSuccess } from "@/utils/toast";
import { useOrderById, useUpdateOrderStatus } from "@/services/order.service";
import { ERROR } from "@/common/error.common";
import { ORDER_STATUS, ORDER_STATUS_TYPE } from "@/common/constant.common";

export const UpdateStatus = ({ open, setOpen, id: orderId, setId }: any) => {
  //IMPORTS
  const { handleSubmit, reset } = useForm();

  //STATES
  const [status, setStatus] = useState<ORDER_STATUS_TYPE>();
  const [statusArr, setStatusArr] = useState<any[]>([]);

  //DATA
  const { data: order } = useOrderById(orderId, !!orderId);

  //USEEFFECT
  useEffect(() => {
    if (order) {
      const { status } = order;
      setStatus(status);
      let statusArr = [];
      if (status === ORDER_STATUS.INITIATED) {
        statusArr.push(ORDER_STATUS.PROCESSING);
      } else if (status === ORDER_STATUS.PROCESSING) {
        statusArr.push(ORDER_STATUS.CANCELLED);
      } else if (status === ORDER_STATUS.RETURNED_INITIATED) {
        statusArr.push(ORDER_STATUS.RETURNED_DELIVERED);
      }
      console.log(statusArr, "STATUS ARR");
      setStatusArr(statusArr);
    }
  }, [order]);

  //MUTANTS
  const { mutateAsync: updateOrder } = useUpdateOrderStatus();

  //HANDLE ONSUBMIT
  const handleOnSubmit = async (data: any) => {
    try {
      if (!status) throw new Error(ERROR.REQUIRED_FIELD("Status"));

      const newObj = {
        status,
      };

      let res: any = {};

      if (orderId) {
        res = await updateOrder({ orderId, ...newObj });
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
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label1">Order Status</InputLabel>
              <Select
                labelId="demo-simple-select-label1"
                id="demo-simple-select1"
                label="Order Status"
                size="small"
                onChange={(e: any) => setStatus(e.target.value)}
              >
                {Object.values(ORDER_STATUS) && Object.values(ORDER_STATUS)?.length > 0 ? (
                  Object.values(ORDER_STATUS)?.map((status: any) => (
                    <MenuItem key={status} value={status} disabled={!statusArr?.includes(status)}>
                      {status}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No data available</MenuItem>
                )}
              </Select>
            </FormControl>
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
