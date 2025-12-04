import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const RoleBasedRedirect = () => {
    const { isAuthenticated, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!isAuthenticated || !user) return

        const roles = (user.roles || []).map((r: any) => String(r).toLowerCase())
        const isAdmin = roles.includes("admin") || roles.includes("administrator")

        // Prevent redirect loop
        if (isAdmin && location.pathname.startsWith("/admin")) return
        if (!isAdmin && location.pathname.startsWith("/dashboard")) return

        navigate(isAdmin ? "/admin" : "/dashboard", { replace: true })
    }, [isAuthenticated, user, navigate, location])

    return null
}

export default RoleBasedRedirect
