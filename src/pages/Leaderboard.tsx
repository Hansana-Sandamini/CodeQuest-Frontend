import { useLeaderboard } from "../hooks/useLeaderboard"
import { Loader2, Award } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import Avatar from "../components/Avatar"

const Leaderboard = () => {
    const { isAdmin } = useAuth()
    const { leaderboard, myRank, loading } = useLeaderboard()

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
                <Loader2 className="w-8 h-8 lg:w-10 lg:h-10 animate-spin text-green-400" />
            </div>
        )
    }

    return (
        <div className="lg:ml-64 lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 lg:py-16 xl:py-20 px-3 lg:px-6 xl:px-8">
            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-8 lg:mb-12 xl:mb-16 border-b border-gray-700 pb-4 lg:pb-6">
                    <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 lg:mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        Global Leaderboard
                    </h1>
                    <p className="text-base lg:text-lg xl:text-xl text-gray-400">
                        See how you rank among the top coders
                    </p>
                </div>

                {/* MY RANK CARD (Admins should NOT see this) */}
                {myRank && !isAdmin && (
                    <div className="
                        bg-gray-800/40 backdrop-blur-sm 
                        border border-gray-700 shadow-lg lg:shadow-xl xl:shadow-2xl 
                        rounded-xl lg:rounded-2xl xl:rounded-3xl p-4 lg:p-6 xl:p-8 mb-8 lg:mb-10 xl:mb-14
                    ">
                        <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-green-400 mb-4 lg:mb-6">Your Rank</h2>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                            <Avatar 
                                src={myRank.profilePicture}
                                username={myRank.username}
                                size="lg"
                                ring
                            />

                            <div className="flex-1">
                                <p className="text-lg lg:text-xl xl:text-2xl font-bold">{myRank.username}</p>
                                <p className="text-gray-400 mt-1 text-sm lg:text-base">Rank #{myRank.rank}</p>
                                <p className="text-green-400 mt-1 font-semibold text-sm lg:text-base xl:text-lg">{myRank.totalPoints} points</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* LEADERBOARD LIST */}
                <div className="
                    bg-gray-800/40 
                    backdrop-blur-sm 
                    border border-gray-700 
                    rounded-xl lg:rounded-2xl xl:rounded-3xl 
                    shadow-lg lg:shadow-xl xl:shadow-2xl shadow-blue-500/10
                ">
                    <div className="px-4 lg:px-6 xl:px-8 py-4 lg:py-6 border-b border-gray-700">
                        <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-blue-400">Top Coders</h2>
                    </div>

                    <div className="divide-y divide-gray-700">
                        {leaderboard.map((user, index) => (
                            <div
                                key={user.userId}
                                className={`
                                    flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 lg:px-6 xl:px-8 py-4 lg:py-6 
                                    transition-all duration-400 hover:bg-white/5
                                    ${myRank?.userId === user.userId ? "bg-green-500/10" : ""}
                                `}
                            >
                                <div className="flex items-center gap-3 lg:gap-4 xl:gap-5 mb-3 sm:mb-0">
                                    <span className="
                                        text-base lg:text-lg xl:text-xl font-bold 
                                        w-8 lg:w-10 text-center
                                        text-green-400
                                    ">
                                        #{index + 1}
                                    </span>

                                    <Avatar 
                                        src={user.profilePicture}
                                        username={user.username}
                                        size="md"
                                        ring={true}
                                    />

                                    <div className="min-w-0">
                                        <p className="text-base lg:text-lg xl:text-xl font-semibold truncate">{user.username}</p>
                                        <p className="text-gray-400 text-xs lg:text-sm">{user.badgesCount} badges earned</p>
                                    </div>
                                </div>

                                <div className="text-right sm:text-left sm:self-start">
                                    <p className="text-base lg:text-lg xl:text-xl font-bold text-green-400">{user.totalPoints} pts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {leaderboard.length === 0 && (
                    <div className="text-center py-12 lg:py-16 xl:py-20 px-4">
                        <Award className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 mx-auto mb-4 lg:mb-6 text-gray-700" />
                        <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-500">No leaderboard data yet</h3>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Leaderboard
