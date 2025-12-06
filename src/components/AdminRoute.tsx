import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const AdminRoute = () => {
    const { user, isAuthenticated, loading, isAdmin } = useAuth()

    // Still checking if user is logged in & admin
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 to-black">
                <div className="text-2xl text-gray-400 animate-pulse">Loading...</div>
            </div>
        )
    }

    // Not logged in → go to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
    }

    // Logged in but not admin → go to user dashboard
    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />
    }

    // All good → show admin page
    return <Outlet />
}

export default AdminRoute
