import { useSelector } from "react-redux"
import type { RootState } from "../store/store"

export const useAuth = () => {
    const auth = useSelector((state: RootState) => state.auth)
    return {
        ...auth,
        isAdmin: auth.user?.roles?.includes("admin") ?? false,
        isLoading: auth.loading
    }
}
