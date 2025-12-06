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
        <div className="min-h-screen bg-linear-to-br from-gray-900 to-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    Welcome back, {user?.username}!
                </h1>
            </div>
        </div>
    )
}

export default AdminDashboard
