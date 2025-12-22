export interface ILeaderboardEntry {
    userId: string
    username: string
    profilePicture?: string
    totalPoints: number
    badgesCount: number
    rank?: number
}

export interface IMyRank {
    data: any
    rank: number
    userId: string
    username: string
    profilePicture?: string
    totalPoints: number
    badgesCount: number
}
