import api from "./axiosInstance"

export const progressApi = {
    submit: (id: string, data: { selectedAnswer?: number; code?: string }) =>
        api.post<{ message: string; isCorrect: boolean; pointsEarned: number; progress: any }>(`/progress/submit/${id}`, data),

    getAll: () => api.get<{ data: any[] }>("/progress"),
}
