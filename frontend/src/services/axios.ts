import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const userAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const publicAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
