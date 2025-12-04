import { store } from "./store"
import { loadProfileAction } from "../features/auth/authActions"

// Run this once when app starts
export const initializeAuth = async () => {
    const token = localStorage.getItem("accessToken")
    if (token) {
        try {
            await store.dispatch(loadProfileAction()).unwrap()
            // Success → user stays logged in
        } catch (err) {
            // Token expired/invalid → clean up
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
        }
    }
}
