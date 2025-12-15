import api from "./axiosInstance"
import type { LoginRequest, LoginResponse, RegisterResponse, RefreshTokenResponse } from "../types/Auth"

export const registerUser = async (formData: FormData): Promise<RegisterResponse> => {
    return (await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })).data
}

export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
    return (await api.post("/auth/login", payload)).data
}

export const getMyProfile = async () => {
    return (await api.get("/auth/profile")).data
}

export const refreshAccessToken = async (): Promise<RefreshTokenResponse> => {
    const refreshToken = localStorage.getItem("refreshToken")
    return (await api.post("/auth/refresh", { token: refreshToken })).data
}

export const forgotPassword = async (payload: { email: string }) => {
    return (await api.post("/auth/forgot-password", payload)).data  
}

export const resetPassword = async (payload: { email: string; otp: string; newPassword: string }) => {
    return (await api.post("/auth/reset-password-otp", payload)).data
}
