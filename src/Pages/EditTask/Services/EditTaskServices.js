import { AxiosInstance } from "../../../Axios/AxiosService";

export const UpdateTask = async (taskId, updateData) => {
    const response = await AxiosInstance.post(`/api/updateTask/${taskId}`, updateData)
    return response;
}

export const TaskById = async (taskId) => {
    const response = await AxiosInstance.get(`/api/taskById/${taskId}`);
    return response.data;
}