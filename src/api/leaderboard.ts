import api from "./axiosInstance"
import type { ILeaderboardEntry } from "../types/Leaderboard"

export const getLeaderboard = async (): Promise<ILeaderboardEntry[]> => {
    const res = await api.get("/leaderboard")
    return res.data
}

export const getMyRank = async (): Promise<ILeaderboardEntry> => {
    const res = await api.get("/leaderboard/me")
    return res.data
}
