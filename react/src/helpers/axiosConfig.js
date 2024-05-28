import axios from "axios";
import { useAuth } from "../components/AuthContext";


const useAxios = () => {
    const { token } = useAuth();
    const axiosInstance = axios.create({ baseURL: "http://localhost:3000" });
    axiosInstance.interceptors.request.use(
        (config)=>{
            if (token) {
                config.headers.Authorization = token;
            }
            return config;
        },
        (error) => Promise.reject(error)
    )
    return axiosInstance;
}

export default useAxios;