import { createSlice } from "@reduxjs/toolkit"
import type { Question } from "../../types/Question"

interface QuestionsState {
    questions: Question[]
    item: Question | null
    loading: boolean
    error: string | null
}

const initialState: QuestionsState = {
    questions: [],
    item: null,
    loading: false,
    error: null,
}

const questionSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {
        setQuestions: (state, action) => {
            state.questions = action.payload
            state.loading = false
            state.error = null
        },
        setQuestion: (state, action) => {
            state.item = action.payload
            state.loading = false
        },
        clearQuestion: (state) => {
            state.item = null
        },
        addQuestion: (state, action) => {
            state.questions.unshift(action.payload)
        },
        updateQuestion: (state, action) => {
            const q = action.payload
            const idx = state.questions.findIndex((x) => x._id === q._id)
            if (idx !== -1) state.questions[idx] = q
            if (state.item?._id === q._id) state.item = q
        },
        removeQuestion: (state, action) => {
            state.questions = state.questions.filter((q) => q._id !== action.payload)
            if (state.item?._id === action.payload) state.item = null
        },
        clearQuestions: (state) => {
            state.questions = []
            state.item = null
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
    },
})

export const {
    setQuestions,
    setQuestion,
    clearQuestion,
    addQuestion,
    updateQuestion,
    removeQuestion,
    clearQuestions,
    setLoading,
    setError,
} = questionSlice.actions

export default questionSlice.reducer
