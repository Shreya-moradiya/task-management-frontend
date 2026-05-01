import { AxiosInstance } from "../../../Axios/AxiosService"

export const GetTask = async () => {
    const response = await AxiosInstance.get('/api/task');
    return response.data
}

export const TaskTitle = async () => {
    const response = await AxiosInstance.get('/api/taskTitle');
    return response.data
}

export const TaskById = async (taskId) => {
    const response = await AxiosInstance.get(`/api/taskById/${taskId}`);
    return response.data
}

export const DeleteTask = async (taskId) => {
    const response = await AxiosInstance.delete(`/api/deleteTask/${taskId}`);
    return response.data;
}

export const MarkCompleted = async (taskId, status) => {
    const response = await AxiosInstance.post(`/api/updateTaskStatus/${taskId}`, { status });
    return response.data;
}