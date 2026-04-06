import { AxiosInstance } from "../../../Axios/AxiosService"

export const GetTask = async () => {
    const response = await AxiosInstance.get('/api/task');
    return response.data
}