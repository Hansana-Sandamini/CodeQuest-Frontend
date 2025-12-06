import { useSelector } from "react-redux"
import type { RootState } from "../store/store"

export const useAuth = () => {
    const auth = useSelector((state: RootState) => state.auth)
    const user = auth.user

    const roles = user?.roles || []

    const isAdmin = roles.some((role: string) =>
        ["admin", "ADMIN", "Admin"].includes(role)
    )

    const isAuthenticated = !!user && !auth.loading

    return {
        ...auth,
        user,
        isAuthenticated,
        isAdmin,
        isLoading: auth.loading
    }
}
