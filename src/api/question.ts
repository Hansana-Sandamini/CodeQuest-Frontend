import api from "./axiosInstance"
import type { Question, CreateQuestionPayload } from "../types/Question"

export const questionApi = {
    getAll: () => api.get<{ data: Question[] }>("/questions"),

    getByLanguage: (languageId: string, difficulty?: string) =>
        api.get<{ data: Question[] }>(`/questions/language/${languageId}`, {
            params: { difficulty },
        }),

    getOne: (id: string) => api.get<{ data: Question }>(`/questions/${id}`),

    create: (data: CreateQuestionPayload) =>
        api.post<{ data: Question }>("/questions", data),

    update: (id: string, data: Partial<CreateQuestionPayload>) =>
        api.put<{ data: Question }>(`/questions/${id}`, data),

    delete: (id: string) => api.delete(`/questions/${id}`),

    getOneForEdit: (id: string) => 
        api.get<{ data: Question }>(`/questions/${id}/full`), 
}
