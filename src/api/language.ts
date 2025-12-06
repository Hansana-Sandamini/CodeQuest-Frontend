import api from "./axiosInstance"
import type { ILanguage } from "../types/Language"

export const getLanguages = async (): Promise<ILanguage[]> => {
    try {
        const response = await api.get("/languages")
        const data = response.data

        if (Array.isArray(data)) return data
        if (data?.data && Array.isArray(data.data)) return data.data
        if (data?.languages && Array.isArray(data.languages)) return data.languages
        if (data?.items && Array.isArray(data.items)) return data.items

        console.warn("No array found in languages response:", data)
        return []
        
    } catch (err) {
        console.error("Failed to fetch languages:", err)
        throw err
    }
}

export const createLanguage = async (formData: FormData): Promise<ILanguage> => {
    const response = await api.post("/languages", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return response.data.data 
}

export const updateLanguage = async (id: string, formData: FormData): Promise<ILanguage> => {
    const response = await api.put(`/languages/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return response.data.data  
}

export const deleteLanguage = async (id: string): Promise<void> => {
    await api.delete(`/languages/${id}`)
}
