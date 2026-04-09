import { AxiosInstance } from "../../../Axios/AxiosService"

export const AddTaskServices = async (formData) => {
    const response = await AxiosInstance.post("/api/addTask", formData);
    return response;
}

export const GetAllUsers = async () => {
    const response = await AxiosInstance.get("/api/getUser");
    return response;
}