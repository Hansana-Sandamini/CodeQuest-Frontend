import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 to-black">
                <div className="text-2xl text-gray-400 animate-pulse">Loading...</div>
            </div>
        )
    }

    // If not logged in → redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // If logged in → render the child routes (via Outlet)
    return <Outlet />
}

export default ProtectedRoute
