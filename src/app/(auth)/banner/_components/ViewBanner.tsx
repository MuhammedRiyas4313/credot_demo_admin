"use client";
import { CustomTable } from "@/components/CustomTable";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useLoading, useProcessData } from "@/hooks/useProcessDataForTable";
import RemoveIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toastError, toastSuccess } from "@/utils/toast";
import { FormControlLabel, Switch } from "@mui/material";
import { STATUS } from "@/common/constant.common";
import { useBanner, useDeleteBanner, useUpdateBanner } from "@/services/banner.service";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Image from "next/image";
import { generateFilePath } from "@/services/url.service";

export default function ViewBanner({ setId, setOpen }: any) {
  //STATES
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //USEMEMO
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  //DATA
  const { data: banners, isFetching, isLoading } = useBanner({}, pagination);
  const processedData = useProcessData(banners);
  const loading = useLoading(isFetching, isLoading);

  //COLUMNS
  const columns = useMemo(() => {
    let cols: any[] = [
      {
        header: "Created",
        accessorFn: (row: any) => row.createdAt && format(row.createdAt, "dd/MM/yy"),
        id: "created",
      },
      {
        header: "Image",
        cell: ({ row: { original: row } }: any) => {
          return (
            <Swiper
              style={{ height: "100px", width: "225px" }}
              slidesPerView={1}
              modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
              pagination={{ clickable: true }}
              watchSlidesProgress
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              loop={true}
              effect="card"
            >
              {row?.imagesArr?.map((el: any) => (
                <SwiperSlide key={el?.image}>
                  <Image
                    src={generateFilePath(el?.image)}
                    height="100"
                    width="225"
                    alt="Banner"
                    style={{ objectFit: "fill" }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          );
        },
        id: "bannerImg",
      },
      ,
      {
        header: "Status",
        cell: ({ row: { original: row } }: any) => {
          return (
            <FormControlLabel
              control={
                <Switch
                  checked={row?.status === STATUS.ACTIVE}
                  onChange={(e: any) => {
                    console.log(e.target.checked, "checked");
                    updateStatus({
                      ...row,
                      status: e.target.checked ? STATUS.ACTIVE : STATUS.INACTIVE,
                      bannerId: row?._id,
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
          return <RemoveIcon sx={{ cursor: "pointer", color: "red" }} onClick={() => handleDeleteBanner(row?._id)} />;
        },
        id: "action3",
      },
    ];
    return cols;
  }, []);

  //MUTANTS
  const { mutateAsync: updateBannerStatus } = useUpdateBanner();
  const { mutateAsync: deleteBanner } = useDeleteBanner();

  //HANDLERS
  const handleDeleteBanner = async (id: any) => {
    try {
      if (window.confirm("Are you sure you want to delete the banner ?")) {
        const res = await deleteBanner(id);
        if (res.data.message) {
          toastSuccess(res.data.message);
        }
      }
    } catch (error) {
      toastError(error);
    }
  };
  const updateStatus = async (obj: any) => {
    try {
      const res = await updateBannerStatus(obj);
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
