import { createAsyncThunk } from "@reduxjs/toolkit"
import { questionApi } from "../../api/question"
import type { CreateQuestionPayload } from "../../types/Question"
import {
  setQuestions,
  setQuestion,
  setLoading,
  setError,
  updateQuestion as updateQuestionAction,
  removeQuestion,
  clearQuestions,
} from "./questionSlice"

// Fetch all questions by language 
export const fetchQuestionsByLanguage = createAsyncThunk(
    "questions/fetchByLanguage",
    async ({ languageId, difficulty }: { languageId: string; difficulty?: string }, { dispatch }) => {
        dispatch(clearQuestions())
        dispatch(setLoading(true))
        const res = await questionApi.getByLanguage(languageId, difficulty)
        const questions = res.data.data ?? []
        dispatch(setQuestions(questions))
        return questions;
    }
)

// Fetch single question (for edit)
export const fetchQuestion = createAsyncThunk(
    "questions/fetchOne",
    async (id: string, { dispatch }) => {
        dispatch(setLoading(true))
        try {
            const res = await questionApi.getOne(id)
            const question = res.data.data
            dispatch(setQuestion(question))
            return question

        } catch (err: any) {
            dispatch(setError(err.response?.data?.message || "Failed to load question"))
            throw err
        }
    }
)

export const createQuestion = createAsyncThunk(
    "questions/create",
    async (data: CreateQuestionPayload, { dispatch, rejectWithValue }) => {
        try {
            const res = await questionApi.create(data)
            const newQuestion = res.data.data

            // Refetch list automatically
            if (data.language) {
                dispatch(fetchQuestionsByLanguage({ languageId: data.language }))
            }

            return newQuestion

        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed")
        }
    }
)

export const updateQuestion = createAsyncThunk(
    "questions/update",
    async ({ id, data }: { id: string; data: Partial<CreateQuestionPayload> }, { dispatch }) => {
        const res = await questionApi.update(id, data)
        const question = res.data.data
        dispatch(updateQuestionAction(question))
        return question
    }
)

export const deleteQuestion = createAsyncThunk(
    "questions/delete",
    async (id: string, { dispatch }) => {
        await questionApi.delete(id)
        dispatch(removeQuestion(id))
    }
)

export const fetchQuestionForEdit = createAsyncThunk(
    "questions/fetchForEdit",
    async (id: string, { dispatch }) => {
        dispatch(setLoading(true))
        try {
            const res = await questionApi.getOneForEdit(id)
            const question = res.data.data
            dispatch(setQuestion(question))
            return question

        } catch (err: any) {
            dispatch(setError(err.response?.data?.message || "Failed to load question for edit"))
            throw err
        }
    }
)

export const clearQuestionsAction = () => clearQuestions()
