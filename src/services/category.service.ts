import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "./axios.service";
import url, { GeneralApiResponse, GeneralApiResponsePagination } from "./url.service";
import { PaginationState } from "@tanstack/react-table";

const baseUrl = `${url}/category`;

const addCategory = (category: any) => {
  return axios.post(`${baseUrl}`, category);
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCategory,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });
};

const getCategory = (pagination: PaginationState, searchObj: Record<string, any>) => {
  const query = new URLSearchParams({
    pageIndex: String(pagination.pageIndex),
    pageSize: String(pagination.pageSize),
    ...searchObj,
  }).toString();
  return axios.get<GeneralApiResponsePagination<any>>(`${baseUrl}?${query}`);
};

export const useCategory = (
  searchObj: Record<string, any> = {},
  pagination: PaginationState = {
    pageIndex: 0,
    pageSize: 10000,
  },
) => {
  return useQuery({
    queryKey: ["category", pagination, searchObj],
    queryFn: () => getCategory(pagination, searchObj).then((res) => res.data),
  });
};

const getCategoryById = (categoryId: string) => {
  return axios.get<GeneralApiResponse<any>>(`${baseUrl}/${categoryId}`);
};

export const useCategoryById = (categoryId: any, enabled = true) => {
  return useQuery({
    queryKey: ["category_by_id", categoryId],
    queryFn: () => getCategoryById(categoryId).then((res) => res.data.data),
    enabled: enabled,
  });
};

const updateCategory = ({ categoryId, ...category }: any) => {
  return axios.put(`${baseUrl}/${categoryId}`, category);
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["category_by_id"] });
    },
  });
};

const deleteCategory = (categoryId: any) => {
  return axios.delete(`${baseUrl}/${categoryId}`);
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["category_by_id"] });
    },
  });
};
