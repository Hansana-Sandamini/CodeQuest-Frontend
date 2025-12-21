import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

const AdminDashboard = () => {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login")
        } else if (isAuthenticated && !user?.roles?.includes("admin")) {
            navigate("/dashboard")
        }
    }, [isAuthenticated, user, navigate])

    return (
        <div className="lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-6 sm:py-8 lg:py-20 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto border-b border-gray-700 pb-4 sm:pb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    Welcome back, {user?.username}!
                </h1>
            </div>
        </div>
    )
}

export default AdminDashboard
