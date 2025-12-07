import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store/store"
import {
    fetchQuestionsByLanguage,
    fetchQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} from "../features/questions/questionActions"

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
