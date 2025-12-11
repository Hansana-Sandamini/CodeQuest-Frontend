import { useState, useEffect } from "react"
import { getLeaderboard, getMyRank } from "../api/leaderboard"
import type { ILeaderboardEntry, IMyRank } from "../types/Leaderboard"

export const useLeaderboard = () => {
    const [leaderboard, setLeaderboard] = useState<ILeaderboardEntry[]>([])
    const [myRank, setMyRank] = useState<IMyRank | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [lb, me] = await Promise.all([
                    getLeaderboard(),
                    getMyRank()
                ])
                setLeaderboard(lb)
                setMyRank(me)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    return { leaderboard, myRank, loading }
}
