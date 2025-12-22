import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { Users, Languages, Code, Shield } from "lucide-react"
import { useAdminDashboard } from "../../hooks/useDashboard"
import { Bar } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const AdminDashboard = () => {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const { stats, languageDistribution, loading, error, refresh } = useAdminDashboard()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login")
        } else if (isAuthenticated && !user?.roles?.includes("admin")) {
            navigate("/dashboard")
        }
    }, [isAuthenticated, user, navigate])

    const barChartData = languageDistribution ? {
        labels: languageDistribution.labels,
        datasets: [
            {
                label: "Questions per Language",
                data: languageDistribution.data,
                backgroundColor: 'rgba(52, 211, 153, 0.8)',
                borderColor: 'rgba(52, 211, 153, 1)',
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    } : null

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#e5e7eb', font: { size: 14 } } },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#e5e7eb',
                bodyColor: '#e5e7eb',
                borderColor: 'rgba(75, 85, 99, 0.5)',
                borderWidth: 1,
            },
        },
        scales: {
            y: { beginAtZero: true, ticks: { color: '#e5e7eb' }, grid: { color: 'rgba(75, 85, 99, 0.3)' } },
            x: { ticks: { color: '#e5e7eb' }, grid: { color: 'rgba(75, 85, 99, 0.3)' } },
        },
    }

    if (loading || !stats || !languageDistribution) {
        return (
            <div className="lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 lg:py-20 px-4 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
                    <p className="text-gray-400">Loading admin dashboard...</p>
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

    const statItems = [
        { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, path: "/admin/users" },
        { label: "Total Admins", value: stats.totalAdmins, icon: Shield, path: "/admin/users" },
        { label: "Total Languages", value: stats.totalLanguages, icon: Languages, path: "/admin/languages" },
        { label: "Total Questions", value: stats.totalQuestions.toLocaleString(), icon: Code, path: "/admin/languages" },
    ]

    return (
        <div className="lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-6 sm:py-8 lg:py-20 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 border-b border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-300">Welcome back, {user?.username || "Admin"}!</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statItems.map((stat, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(stat.path)}
                        className="relative overflow-hidden rounded-xl lg:rounded-2xl xl:rounded-3xl bg-gray-800/40 backdrop-blur-sm border border-gray-700 p-6 hover:border-green-500/50 hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 text-left group shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-400 bg-opacity-20">
                                <stat.icon className="w-8 h-8" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold mb-2 text-white">{stat.value}</p>
                        <p className="text-gray-400 mb-2">{stat.label}</p>
                    </button>
                    ))}
                </div>

                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
                        <div>
                            <h2 className="text-2xl font-semibold">Questions Distribution by Language</h2>
                            <p className="text-gray-400">Total questions across different programming languages</p>
                        </div>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl lg:rounded-2xl xl:rounded-3xl border border-gray-700 p-6 shadow-lg">
                        <div className="h-80">
                            {barChartData && <Bar data={barChartData} options={barChartOptions} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
