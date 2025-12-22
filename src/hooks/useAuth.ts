import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { useMemo } from "react"

export const useAuth = () => {
    const auth = useSelector((state: RootState) => state.auth)
    const user = auth.user

    // Memoize the normalized user to prevent unnecessary re-renders
    const normalizedUser = useMemo(() => {
        if (!user) return null
        
        return {
            ...user,
            _id: user.id,
            currentStreak: user.currentStreak || 0,
            badges: user.badges || [],
            certificates: user.certificates || [],
            languages: user.languages || []
        }
    }, [user]) // Only recreate when user changes

    const roles = normalizedUser?.roles || []

    const isAdmin = roles.some((role: string) =>
        ["admin", "ADMIN", "Admin"].includes(role)
    )

    const isAuthenticated = !!normalizedUser && !auth.loading
    const isLoading = auth.loading

    return {
        ...auth,
        user: normalizedUser,
        isAuthenticated,
        isAdmin,
        isLoading
    }
}
