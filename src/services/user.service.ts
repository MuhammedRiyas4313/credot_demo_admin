import axios from "axios";
import url, { GeneralApiResponse, GeneralApiResponsePagination } from "./url.service";
import { PaginationState } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const baseUrl = `${url}/user`;

export const webLogin = async (obj: { email: string; password: string }) => {
  return axios.post(`${baseUrl}/login`, obj);
};

const getUser = (pagination: PaginationState, searchObj: Record<string, any>) => {
  const query = new URLSearchParams({
    pageIndex: String(pagination.pageIndex),
    pageSize: String(pagination.pageSize),
    ...searchObj,
  }).toString();
  return axios.get<GeneralApiResponsePagination<any>>(`${baseUrl}?${query}`);
};

export const useUser = (
  searchObj: Record<string, any> = {},
  pagination: PaginationState = {
    pageIndex: 0,
    pageSize: 10000,
  },
) => {
  return useQuery({
    queryKey: ["user", pagination, searchObj],
    queryFn: () => getUser(pagination, searchObj).then((res) => res.data),
  });
};

const getUserById = (userId: string) => {
  return axios.get<GeneralApiResponse<any>>(`${baseUrl}/${userId}`);
};

export const useUserById = (userId: any, enabled = true) => {
  return useQuery({
    queryKey: ["user_by_id", userId],
    queryFn: () => getUserById(userId).then((res) => res.data.data),
    enabled: enabled,
  });
};

const updateUserStatus = ({ userId, ...user }: any) => {
  return axios.patch(`${baseUrl}/${userId}`, user);
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user_by_id"] });
    },
  });
};
