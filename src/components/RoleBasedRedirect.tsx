import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const RoleBasedRedirect = () => {
    const { isAuthenticated, isAdmin } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Redirect only when user is on login page (after logging in)
        if (location.pathname === "/login" && isAuthenticated) {
            navigate(isAdmin ? "/admin" : "/dashboard", { replace: true })
        }
    }, [isAuthenticated, isAdmin, location.pathname, navigate])

    return null
}

export default RoleBasedRedirect
