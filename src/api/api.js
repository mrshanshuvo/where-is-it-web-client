import axios from "axios";

export const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
};

export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});
