import axios from "axios";
//import { useAuth } from "../components/AuthContext";
import { useSelector } from "react-redux";

const useAxios = () => {
    const { userToken } = useSelector((state) => state.auth);//needs to be changed when using redux
    const axiosInstance = axios.create({ baseURL: "http://localhost:3000" });
    axiosInstance.interceptors.request.use(
        (config)=>{
            if (userToken) {
                config.headers.Authorization = userToken;
            }
            return config;
        },
        (error) => Promise.reject(error)
    )
    return axiosInstance;
}

export default useAxios;