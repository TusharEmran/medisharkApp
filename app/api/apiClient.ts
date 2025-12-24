// src/api/apiClient.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiClient = axios.create({
  baseURL: "https://your-api-url.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Token Automatically
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle Errors Globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error?.response || error?.message);
    return Promise.reject(error);
  }
);
