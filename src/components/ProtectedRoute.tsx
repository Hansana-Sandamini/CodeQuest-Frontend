import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth()

    // If not logged in → redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // If logged in → render the child routes (via Outlet)
    return <Outlet />
}

export default ProtectedRoute
