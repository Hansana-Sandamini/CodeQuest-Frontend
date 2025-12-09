import { useState, useEffect } from "react"
import { getLeaderboard, getMyRank } from "../api/leaderboard"
import type { ILeaderboardEntry } from "../types/Leaderboard"

export const useLeaderboard = () => {
    const [leaderboard, setLeaderboard] = useState<ILeaderboardEntry[]>([])
    const [myRank, setMyRank] = useState<ILeaderboardEntry | null>(null)

    useEffect(() => {
        getLeaderboard().then(setLeaderboard)
        getMyRank().then(setMyRank)
    }, [])

    return { leaderboard, myRank }
}
