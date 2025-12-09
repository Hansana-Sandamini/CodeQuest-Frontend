import api from "./axiosInstance"

export const progressApi = {
    submit: async (id: string, data: { selectedAnswer?: number; code?: string }) => {
        const res = await api.post(`/progress/submit/${id}`, data)
        return {
            message: res.data.message,
            isCorrect: res.data.isCorrect,
            pointsEarned: res.data.pointsEarned || 0,
            progress: res.data.progress || {}
        }
    },

    getAll: async () => {
        const res = await api.get("/progress")
        return res.data.data || []
    }
}
