import api from './axiosInstance'

export const dailyQuestionApi = {
    getToday: async () => {
        const response = await api.get('/api/v1/daily-question')
        return response.data.question || response.data.data || response.data
    }
}
