import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "./axios.service";
import url, { GeneralApiResponse, GeneralApiResponsePagination } from "./url.service";
import { PaginationState } from "@tanstack/react-table";

const baseUrl = `${url}/brand`;

const addBrand = (brand: any) => {
  return axios.post(`${baseUrl}`, brand);
};

export const useAddBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBrand,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["brand"] });
    },
  });
};

const getBrand = (pagination: PaginationState, searchObj: Record<string, any>) => {
  const query = new URLSearchParams({
    pageIndex: String(pagination.pageIndex),
    pageSize: String(pagination.pageSize),
    ...searchObj,
  }).toString();
  return axios.get<GeneralApiResponsePagination<any>>(`${baseUrl}?${query}`);
};

export const useBrand = (
  searchObj: Record<string, any> = {},
  pagination: PaginationState = {
    pageIndex: 0,
    pageSize: 10000,
  },
) => {
  return useQuery({
    queryKey: ["brand", pagination, searchObj],
    queryFn: () => getBrand(pagination, searchObj).then((res) => res.data),
  });
};

const getBrandById = (brandId: string) => {
  return axios.get<GeneralApiResponse<any>>(`${baseUrl}/${brandId}`);
};

export const useBrandById = (brandId: any, enabled = true) => {
  return useQuery({
    queryKey: ["brand_by_id", brandId],
    queryFn: () => getBrandById(brandId).then((res) => res.data.data),
    enabled: enabled,
  });
};

const updateBrand = ({ brandId, ...brand }: any) => {
  return axios.put(`${baseUrl}/${brandId}`, brand);
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBrand,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["brand"] });
      queryClient.invalidateQueries({ queryKey: ["brand_by_id"] });
    },
  });
};

const deleteBrand = (brandId: any) => {
  return axios.delete(`${baseUrl}/${brandId}`);
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["brand"] });
      queryClient.invalidateQueries({ queryKey: ["brand_by_id"] });
    },
  });
};
