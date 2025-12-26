import { createAsyncThunk } from "@reduxjs/toolkit"
import type { ILanguage } from "../../types/Language"
import {
    getLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage
} from "../../api/language"
import type { RootState } from "../../store/store"
import api from "../../api/axiosInstance"

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
    })
}

export const createLang = createAsyncThunk<ILanguage, FormData>(
    "languages/create",
    async (formData, { rejectWithValue }) => {
        try {
            const iconFile = formData.get("icon") as File | null
            if (iconFile && iconFile.size > 0) {
                const base64 = await fileToBase64(iconFile)
                formData.delete("icon")
                formData.append("iconUrl", base64)
            }

            const language = await createLanguage(formData)
            return language  
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { message: "Failed to create" })
        }
    }
)

export const updateLang = createAsyncThunk<ILanguage, { id: string; data: FormData }>(
    "languages/update", 
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const iconFile = data.get("icon") as File | null
            if (iconFile && iconFile.size > 0) {
                const base64 = await fileToBase64(iconFile)
                data.delete("icon")
                data.append("iconUrl", base64)
            } else {
                data.delete("icon")
            }

            const language = await updateLanguage(id, data)
            return language 
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { message: "Update failed" })
        }
    }
)

export const deleteLang = createAsyncThunk<string, string>(
    "languages/delete",
    async (id) => {
        await deleteLanguage(id)
        return id
    }
)

export const fetchLanguages = createAsyncThunk<
    { languages: ILanguage[]; completedIds: string[] }, 
    void
>(
    "languages/fetchAll",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState
            const userId = state.auth?.user?._id

            const [langResponse, completedResponse] = await Promise.all([
            getLanguages(),
            userId 
                ? api.get(`/users/${userId}/completed-languages`)  
                : Promise.resolve({ data: { completed: [] } })
            ])

            return {
                languages: langResponse, 
                completedIds: completedResponse.data?.completed || completedResponse.data?.data || []
            }
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch languages data")
        }
    }
)
