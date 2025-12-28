import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store/store"
import {
    fetchQuestionsByLanguage,
    fetchQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} from "../features/questions/questionActions"

import { useQuery } from '@tanstack/react-query'
import { dailyQuestionApi } from '../api/dailyQuestion' 

export const useQuestions = () => {
    const dispatch = useDispatch<AppDispatch>()

    const { questions, item, loading, error } = useSelector(
        (state: RootState) => state.questions
    )

    return {
        questions,
        question: item,
        loading,
        error,

        fetchByLanguage: (languageId: string, difficulty?: string) =>
            dispatch(fetchQuestionsByLanguage({ languageId, difficulty })),

        fetchOne: (id: string) => dispatch(fetchQuestion(id)),

        createQuestion: (data: any) => dispatch(createQuestion(data)),

        updateQuestion: (id: string, data: any) =>
            dispatch(updateQuestion({ id, data })),

        deleteQuestion: (id: string) => dispatch(deleteQuestion(id)),
    }
}

// Daily question with React Query
export const useDailyQuestion = () => {
    return useQuery({
        queryKey: ['daily-question'],
        queryFn: async () => {
            try {
                const response = await dailyQuestionApi.getToday()
                return response.question || response.data || response
            } catch (error) {
                console.error("Daily question fetch error:", error)
                return null   // Return null instead of throwing
            }
        },
        staleTime: 24 * 60 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        retry: 1,
        retryDelay: 2000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
