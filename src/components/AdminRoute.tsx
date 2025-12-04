import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const AdminRoute = () => {
    const { user } = useAuth()

    if (!user?.roles?.includes("admin")) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}

export default AdminRoute
