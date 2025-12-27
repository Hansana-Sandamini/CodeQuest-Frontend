import api from './axiosInstance'

export const dailyQuestionApi = {
    getToday: async () => {
        const response = await api.get('/daily-question')
        return response.data.question || response.data.data || response.data
    }
}
