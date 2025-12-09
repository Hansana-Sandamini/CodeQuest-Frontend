import api from "./axiosInstance"
import type { IUser, IUserProfile } from "../types/User"

export const userApi = {
    getAllUsers: async (): Promise<IUser[]> => {
        const res = await api.get("/users")
        return res.data.data
    },

    getUserById: async (id: string): Promise<IUser> => {
        const res = await api.get(`/users/${id}`)
        return res.data.data
    },

    getUserProfile: async (username: string): Promise<IUserProfile> => {
        const res = await api.get(`/users/profile/${username}`)
        return res.data.data
    },

    updateMyProfile: async (data: { firstname?: string; lastname?: string; username?: string }): Promise<IUser> => {
        const res = await api.put("/users/me", data)
        return res.data.data
    },

    updateProfilePicture: async (imageFile: File): Promise<{ profilePicture: string }> => {
        const formData = new FormData()
        formData.append("image", imageFile)
        
        const res = await api.put("/users/me/profile-picture", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return res.data.data
    },

    changePassword: async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
        const res = await api.put("/users/me/password", { oldPassword, newPassword })
        return res.data
    },

    updateUserRole: async (userId: string, roles: string[]): Promise<IUser> => {
        const res = await api.put(`/users/${userId}/roles`, { roles })
        return res.data.data
    },

    deleteUser: async (userId: string): Promise<{ message: string }> => {
        const res = await api.delete(`/users/${userId}`)
        return res.data
    },
}
