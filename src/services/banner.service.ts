import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "./axios.service";
import url, { GeneralApiResponse, GeneralApiResponsePagination } from "./url.service";
import { PaginationState } from "@tanstack/react-table";

const baseUrl = `${url}/banner`;

const addBanner = (banner: any) => {
  return axios.post(`${baseUrl}`, banner);
};

export const useAddBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBanner,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["banner"] });
    },
  });
};

const getBanner = (pagination: PaginationState, searchObj: Record<string, any>) => {
  const query = new URLSearchParams({
    pageIndex: String(pagination.pageIndex),
    pageSize: String(pagination.pageSize),
    ...searchObj,
  }).toString();
  return axios.get<GeneralApiResponsePagination<any>>(`${baseUrl}?${query}`);
};

export const useBanner = (
  searchObj: Record<string, any> = {},
  pagination: PaginationState = {
    pageIndex: 0,
    pageSize: 10000,
  },
) => {
  return useQuery({
    queryKey: ["banner", pagination, searchObj],
    queryFn: () => getBanner(pagination, searchObj).then((res) => res.data),
  });
};

const getBannerById = (bannerId: string) => {
  return axios.get<GeneralApiResponse<any>>(`${baseUrl}/${bannerId}`);
};

export const useBannerById = (bannerId: any, enabled = true) => {
  return useQuery({
    queryKey: ["banner_by_id", bannerId],
    queryFn: () => getBannerById(bannerId).then((res) => res.data.data),
    enabled: enabled,
  });
};

const updateBanner = ({ bannerId, ...banner }: any) => {
  return axios.put(`${baseUrl}/${bannerId}`, banner);
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBanner,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["banner"] });
      queryClient.invalidateQueries({ queryKey: ["banner_by_id"] });
    },
  });
};

const deleteBanner = (bannerId: any) => {
  return axios.delete(`${baseUrl}/${bannerId}`);
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["banner"] });
      queryClient.invalidateQueries({ queryKey: ["banner_by_id"] });
    },
  });
};
