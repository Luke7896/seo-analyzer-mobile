import { axiosClient } from './axiosClient';
import * as SecureStore from 'expo-secure-store';

export interface User {
    id: number,
    email: string,
    role: 'ROLE_LEAD' | 'ROLE_CLIENT' | 'ROLE_ADMIN' | 'ROLE_FORMER_CLIENT';
    domain: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface LoginResponse {
    token: string;
    type: string;
}

export type LoginRequest = {
    identifier: string;
    password: string;
}

export type RegisterRequest = {
    email: string;
    password: string;
    firstName: string,
    lastName: string,
    phoneNumber: string,
}

export const authService = {

    login: async (request: LoginRequest): Promise<LoginResponse> => {
        const response = await axiosClient.post<LoginResponse>('/api/auth/login', request);
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await axiosClient.get<User>('/api/auth/me');
        return response.data;
    },

    logout: async (): Promise<void> => {
        SecureStore.deleteItemAsync('token');
    },

    register: async (request: RegisterRequest): Promise<void> => {
        await axiosClient.post('/api/register', request);
    },

};