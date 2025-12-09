export interface ILeaderboardEntry {
    user: {
        _id: string
        username: string
        profilePicture?: string
    }
    pointsEarned: number
    rank: number
}
