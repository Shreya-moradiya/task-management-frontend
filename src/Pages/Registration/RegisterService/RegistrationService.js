import { AxiosInstance } from "../../../Axios/AxiosService";

/** Backend expects `compnayName` (schema typo). Form uses `companyName`. */
export const Register = async (formData) => {
    const { companyName, name, email, password } = formData;
    const payload = {
        name,
        email,
        password,
        compnayName: companyName?.trim() ?? "",
    };
    const response = await AxiosInstance.post("/auth/register", payload);
    return response.data;
};