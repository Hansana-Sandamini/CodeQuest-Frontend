import { useLeaderboard } from "../hooks/useLeaderboard"
import { Loader2, Award } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

export default function Leaderboard() {
    const { isAdmin } = useAuth()
    const { leaderboard, myRank, loading } = useLeaderboard()

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 to-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-400" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 to-black text-white py-20 px-8">
            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        Global Leaderboard
                    </h1>
                    <p className="text-xl text-gray-400">
                        See how you rank among the top coders
                    </p>
                </div>

                {/* MY RANK CARD (Admins should NOT see this) */}
                {myRank && !isAdmin && (
                    <div className="
                        bg-gray-800/40 backdrop-blur-sm 
                        border border-gray-700 shadow-2xl 
                        rounded-3xl p-8 mb-14
                    ">
                        <h2 className="text-2xl font-bold text-green-400 mb-6">Your Rank</h2>

                        <div className="flex items-center gap-6">
                            <img
                                src={myRank.profilePicture || "/default-avatar.png"}
                                className="w-20 h-20 rounded-full border border-gray-700 shadow-lg object-cover"
                            />

                            <div>
                                <p className="text-2xl font-bold">{myRank.username}</p>
                                <p className="text-gray-400 mt-1">Rank #{myRank.rank}</p>
                                <p className="text-green-400 mt-1 font-semibold">{myRank.totalPoints} points</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* LEADERBOARD LIST */}
                <div className="
                    bg-gray-800/40 
                    backdrop-blur-sm 
                    border border-gray-700 
                    rounded-3xl 
                    shadow-2xl shadow-blue-500/10
                ">
                    <div className="px-8 py-6 border-b border-gray-700">
                        <h2 className="text-2xl font-bold text-blue-400">Top Coders</h2>
                    </div>

                    <div className="divide-y divide-gray-700">
                        {leaderboard.map((user, index) => (
                            <div
                                key={user.userId}
                                className={`
                                    flex items-center justify-between px-8 py-6 
                                    transition-all duration-400 hover:bg-white/5
                                    ${myRank?.userId === user.userId ? "bg-green-500/10" : ""}
                                `}
                            >
                                <div className="flex items-center gap-5">
                                    <span className="
                                        text-2xl font-bold 
                                        w-10 text-center
                                        text-green-400
                                    ">
                                        #{index + 1}
                                    </span>

                                    <img
                                        src={user.profilePicture || "/default-avatar.png"}
                                        className="w-14 h-14 rounded-full border border-gray-700 shadow-md object-cover"
                                    />

                                    <div>
                                        <p className="text-xl font-semibold">{user.username}</p>
                                        <p className="text-gray-400 text-sm">{user.badgesCount} badges earned</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-bold text-green-400">{user.totalPoints} pts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {leaderboard.length === 0 && (
                    <div className="text-center py-20">
                        <Award size={100} className="mx-auto text-gray-600 mb-6" />
                        <h3 className="text-3xl font-bold text-gray-500">No leaderboard data yet</h3>
                    </div>
                )}
            </div>
        </div>
    )
}
