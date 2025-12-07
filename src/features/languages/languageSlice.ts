import { createSlice } from "@reduxjs/toolkit"
import type { ILanguage } from "../../types/Language"
import {
    fetchLanguages,
    createLang,
    updateLang,
    deleteLang,
} from "./languageActions"

interface LanguageState {
    items: ILanguage[]
    loading: boolean
    error: string | null
}

const initialState: LanguageState = {
    items: [],
    loading: false,
    error: null
}

const languageSlice = createSlice({
    name: "languages",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
    builder
        // FETCH
        .addCase(fetchLanguages.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(fetchLanguages.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload
        })
        .addCase(fetchLanguages.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message ?? "Failed to load languages"
        })

        // CREATE
        .addCase(createLang.fulfilled, (state, action) => {
            state.items.push(action.payload)
        })
        .addCase(createLang.rejected, (state, action) => {
            state.error = action.error.message ?? "Failed to create language"
        })

        // UPDATE
        .addCase(updateLang.fulfilled, (state, action) => {
            const index = state.items.findIndex((l) => l._id === action.payload._id)
            if (index !== -1) state.items[index] = action.payload
        })
        .addCase(updateLang.rejected, (state) => {
            state.error = "Failed to update language"
        })

        // DELETE
        .addCase(deleteLang.fulfilled, (state, action) => {
            state.items = state.items.filter((l) => l._id !== action.payload)
        })
        .addCase(deleteLang.rejected, (state) => {
            state.error = "Failed to delete language"
        })
    },
})

export const { clearError } = languageSlice.actions
export default languageSlice.reducer
