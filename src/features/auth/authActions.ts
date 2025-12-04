import { createAsyncThunk } from "@reduxjs/toolkit"
import { loginUser, registerUser, getMyProfile } from "../../api/authService"
import type { LoginRequest } from "../../types/Auth"

export const registerUserAction = createAsyncThunk(
	"auth/register",
	async (formData: FormData, thunkAPI) => {
		try {
			const res = await registerUser(formData)
			return res
		} catch (err: any) {
			return thunkAPI.rejectWithValue(err.response.data)
		}
	}
)

export const loginUserAction = createAsyncThunk(
    "auth/login",
    async (payload: LoginRequest, thunkAPI) => {
        try {
            const res = await loginUser(payload)
            localStorage.setItem("accessToken", res.accessToken)
            localStorage.setItem("refreshToken", res.refreshToken)

            // Immediately fetch profile so we have roles
            const profileRes = await getMyProfile()
            const user = profileRes.data || profileRes.user || profileRes

            // roles to be array with "admin" 
            const normalizedUser = {
                ...user,
                roles: user.roles
                    ? Array.isArray(user.roles)
                        ? user.roles.map((r: string) => r.toLowerCase())
                        : [user.roles.toLowerCase()]
                    : user.role
                    ? [user.role.toLowerCase()]
                    : user.isAdmin
                    ? ["admin"]
                    : ["user"]  // default
            }

            return { ...res, user: normalizedUser }
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data || { message: "Login failed" })
        }
    }
)

export const loadProfileAction = createAsyncThunk(
    "auth/loadProfile",
    async (_, thunkAPI) => {
        try {
            const res = await getMyProfile()
            
            // adapt to whatever backend returns
            const user = res.data || res.user || res

            // Normalize roles to array of lowercase strings
            let roles: string[] = []

            if (user.roles) {
                roles = Array.isArray(user.roles) ? user.roles : [user.roles]
            } else if (user.role) {
                roles = [user.role]
            } else if (user.isAdmin) {
                roles = ["admin"]
            }

            // Convert to lowercase for safety
            roles = roles.map((r: string) => r.toLowerCase())

            return { ...user, roles }
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data)
        }
    }
)
