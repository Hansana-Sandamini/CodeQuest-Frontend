import api from "./axiosInstance"
import type { ILeaderboardEntry, IMyRank } from "../types/Leaderboard"

export const getLeaderboard = async (): Promise<ILeaderboardEntry[]> => {
    const res = await api.get("/leaderboard")
    return res.data.data       
}

export const getMyRank = async (): Promise<IMyRank> => {
    const res = await api.get("/leaderboard/me")
    return res.data.data       
}
