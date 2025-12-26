import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { Code2, Languages, Award, TrendingUp, Globe } from "lucide-react"
import { useUserDashboard } from "../../hooks/useDashboard"
import { Pie } from "react-chartjs-2"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

const UserDashboard = () => {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const { stats, recentQuestions, achievements, loading, error, refresh } = useUserDashboard()
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login")
        }
    }, [isAuthenticated, navigate])

    useEffect(() => {
        if (!loading && stats && !isInitialized) {
            setIsInitialized(true)
        }
    }, [loading, stats, isInitialized])

    const displayStats = isInitialized ? stats : {
        currentStreak: `${user?.currentStreak || 0} days`,
        totalLanguages: user?.certificates?.length || 0,
        allLanguagesCount: 0,
        totalQuestions: 0, 
        solvedQuestions: 0,
    }

    const displayAchievements = isInitialized ? achievements : {
        badgesEarned: user?.badges?.length || 0,
        certificates: user?.certificates?.length || 0,
    }

    const hasAchievements =
        (displayAchievements?.badgesEarned || 0) > 0 ||
        (displayAchievements?.certificates || 0) > 0

    const pieChartData = {
        labels: ["Badges Earned", "Certificates"],
        datasets: [
            {
            data: [
                displayAchievements?.badgesEarned || 0,
                displayAchievements?.certificates || 0,
            ],
            backgroundColor: [
                'rgba(52, 211, 153, 0.8)',
                'rgba(96, 165, 250, 0.8)',
            ],
            borderColor: [
                'rgba(52, 211, 153, 1)',
                'rgba(96, 165, 250, 1)',
            ],
            borderWidth: 2,
            hoverOffset: 20,
            },
        ],
    }

    const pieChartOptions = {
        plugins: {
            legend: {
                labels: { color: '#e5e7eb', font: { size: 14, family: "'Inter', sans-serif" } },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#e5e7eb',
                bodyColor: '#e5e7eb',
                borderColor: 'rgba(75, 85, 99, 0.5)',
                borderWidth: 1,
            },
        },
        maintainAspectRatio: false,
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'text-green-400 bg-green-500/20'
            case 'medium': return 'text-yellow-400 bg-yellow-500/20'
            case 'hard': return 'text-red-400 bg-red-500/20'
            default: return 'text-gray-400 bg-gray-500/20'
        }
    }

    if (!isInitialized && loading) {
        return (
            <div className="lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 lg:py-20 px-4 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
                    <p className="text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 lg:py-20 px-4 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <p className="text-gray-400 mb-4">Error: {error}</p>
                    <button onClick={refresh} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition">
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!displayStats) {
        return (
            <div className="lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 lg:py-20 px-4 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
                    <p className="text-gray-400 mb-4">No dashboard data available</p>
                    <button onClick={refresh} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition">
                        Refresh
                    </button>
                </div>
            </div>
        )
    }

    const statItems = [
        { 
            label: "Total Languages", 
            value: displayStats.allLanguagesCount?.toString() || "0", 
            icon: Globe 
        },
        { 
            label: "Completed Languages", 
            value: displayStats.totalLanguages?.toString() || "0", 
            icon: Languages 
        },
        { 
            label: "Total Questions", 
            value: displayStats.totalQuestions?.toString() || "0", 
            icon: TrendingUp 
        },
        { 
            label: "Solved Questions", 
            value: displayStats.solvedQuestions?.toString() || "0", 
            icon: Code2 
        },
    ]

    return (
        <div className="lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-6 sm:py-8 lg:py-20 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 border-b border-gray-700 pb-6">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        Welcome back, {user?.username || "Coder"}!
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-300">Ready to continue your coding journey?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statItems.map((stat, index) => (
                    <div
                        key={index}
                        className="relative overflow-hidden rounded-xl lg:rounded-2xl xl:rounded-3xl bg-gray-800/40 backdrop-blur-sm border border-gray-700 p-6 hover:border-green-500/50 hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 group shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-400 bg-opacity-20">
                                <stat.icon className="w-8 h-8" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold mb-2 text-white">{stat.value}</p>
                        <p className="text-gray-400">{stat.label}</p>
                    </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl lg:rounded-2xl xl:rounded-3xl border border-gray-700 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold">Recently Solved Questions</h2>
                            <button onClick={() => navigate("/languages")} className="text-green-400 hover:text-green-300 text-sm font-medium">
                                View All →
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentQuestions && recentQuestions.length > 0 ? (
                                recentQuestions.map((question, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all duration-300">
                                        <div>
                                            <p className="font-medium text-gray-200">{question.title || "Unknown Question"}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                                                    {question.difficulty?.charAt(0)?.toUpperCase() + question.difficulty?.slice(1) || 'Medium'}
                                                </span>
                                                <span className="text-sm text-gray-400">{question.language || "Unknown"}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400 text-right">{question.time || "Recently"}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">No questions solved yet. Start coding!</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl lg:rounded-2xl xl:rounded-3xl border border-gray-700 p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-6">Achievements Breakdown</h2>
                        <div className="h-64 flex items-center justify-center">
                            {hasAchievements ? (
                                <Pie data={pieChartData} options={pieChartOptions} />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <div className="grid grid-cols-2 gap-8 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-green-500/20 mx-auto" />
                                        <div className="w-12 h-12 rounded-full bg-blue-500/20 mx-auto" />
                                    </div>
                                    <p className="text-sm">No achievements yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-xl lg:rounded-2xl xl:rounded-3xl p-6 flex flex-col justify-center shadow-lg">
                        <Award className="w-12 h-12 mb-4 text-white" />
                        <h2 className="text-2xl font-bold mb-4 text-white">Daily Question Awaits!</h2>
                        <p className="text-base mb-6 text-green-100">
                            Solve today's question to keep your streak alive and earn bonus points.
                        </p>
                        <button
                            onClick={() => navigate("/questions/daily")}
                            className="w-full bg-white text-gray-900 font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-300"
                        >
                            Start Solving Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard
