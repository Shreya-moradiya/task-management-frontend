import { AxiosInstance } from "../../../Axios/AxiosService";

export const AddUserService = async (payload) => {
  const response = await AxiosInstance.post("/api/addUser", payload);
  return response.data;
};
