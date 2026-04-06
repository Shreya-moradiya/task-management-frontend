import { AxiosInstance } from "../../../Axios/AxiosService"

export const LoginService = async (data) => {
    const response = await AxiosInstance.post('/auth/login', data)
    return response.data
}