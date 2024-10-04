import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "./axios.service";
import url, { GeneralApiResponse, GeneralApiResponsePagination } from "./url.service";
import { PaginationState } from "@tanstack/react-table";

const baseUrl = `${url}/product`;

const addProduct = (product: any) => {
  return axios.post(`${baseUrl}`, product);
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProduct,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};

const getProduct = (pagination: PaginationState, searchObj: Record<string, any>) => {
  const query = new URLSearchParams({
    pageIndex: String(pagination.pageIndex),
    pageSize: String(pagination.pageSize),
    ...searchObj,
  }).toString();
  return axios.get<GeneralApiResponsePagination<any>>(`${baseUrl}?${query}`);
};

export const useProduct = (
  searchObj: Record<string, any> = {},
  pagination: PaginationState = {
    pageIndex: 0,
    pageSize: 10000,
  },
) => {
  return useQuery({
    queryKey: ["product", pagination, searchObj],
    queryFn: () => getProduct(pagination, searchObj).then((res) => res.data),
  });
};

const getProductById = (productId: string) => {
  return axios.get<GeneralApiResponse<any>>(`${baseUrl}/${productId}`);
};

export const useProductById = (productId: any, enabled = true) => {
  return useQuery({
    queryKey: ["product_by_id", productId],
    queryFn: () => getProductById(productId).then((res) => res.data.data),
    enabled: enabled,
  });
};

const updateProduct = ({ productId, ...Product }: any) => {
  return axios.put(`${baseUrl}/${productId}`, Product);
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["product_by_id"] });
    },
  });
};

const updateIsBestSeller = ({ productId, ...Product }: any) => {
  return axios.patch(`${baseUrl}/${productId}`, Product);
};

export const useUpdateIsBestSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateIsBestSeller,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["product_by_id"] });
    },
  });
};

const deleteProduct = (productId: any) => {
  return axios.delete(`${baseUrl}/${productId}`);
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["product_by_id"] });
    },
  });
};
