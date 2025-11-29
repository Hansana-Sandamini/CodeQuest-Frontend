import { useAuth } from "./useAuth"

export const useRole = (role: string) => {
    const { user } = useAuth()
    return user?.roles?.includes(role)
}
