import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import type { JSX } from "react"

interface ProtectedRouteProps {
    children: JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return children
}

export default ProtectedRoute
