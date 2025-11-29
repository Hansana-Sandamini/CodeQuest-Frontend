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
			return res
		} catch (err: any) {
			return thunkAPI.rejectWithValue(err.response.data)
		}
	}
)

export const loadProfileAction = createAsyncThunk(
    "auth/loadProfile",
    async (_, thunkAPI) => {
        try {
            const res = await getMyProfile()
            return res.data
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data)
        }
    }
)
