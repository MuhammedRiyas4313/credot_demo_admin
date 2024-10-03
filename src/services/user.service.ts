import axios from "axios";
import url from "./url.service";

const baseUrl = `${url}/user`;

export const webLogin = async (obj: { email: string; password: string }) => {
  return axios.post(`${baseUrl}/login`, obj);
};
