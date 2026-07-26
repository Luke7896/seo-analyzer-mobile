import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';


const getBaseUrl = () => {
    if (__DEV__) {
        return Platform.OS === 'android'
            ? 'http://10.0.2.2:8080'
            : 'http://localhost:8080';
    }
    return 'http://localhost:8080';
}

export const axiosClient = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json'
    },
});


axiosClient.interceptors.request.use(
    async (config) => {


        if (config.url?.includes('/api/auth/login')) {
            return config;
        }

        const token = await SecureStore.getItemAsync('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized request made. Clearing local token.");
            await SecureStore.deleteItemAsync('token');
        }
        return Promise.reject(error);
    }
);

