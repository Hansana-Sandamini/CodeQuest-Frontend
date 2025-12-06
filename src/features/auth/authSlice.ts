import { createSlice } from "@reduxjs/toolkit"
import { loginUserAction, registerUserAction, loadProfileAction } from "./authActions"

interface AuthState {
    user: any
    loading: boolean   
    isAuthenticated: boolean
}

const initialState: AuthState = {
    user: null,
    loading: true,          
    isAuthenticated: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.loading = false   
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
        }
    },
    extraReducers: (builder) => {
    builder
        .addCase(loginUserAction.pending, (state) => { state.loading = true })
        .addCase(loginUserAction.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload.user
            state.isAuthenticated = true
        })
        .addCase(loginUserAction.rejected, (state) => {
            state.loading = false
        })
        .addCase(registerUserAction.fulfilled, (state) => { state.loading = false })
        .addCase(registerUserAction.rejected, (state) => { state.loading = false })

        .addCase(loadProfileAction.pending, (state) => {
            state.loading = true
        })
        .addCase(loadProfileAction.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
            state.isAuthenticated = true
        })
        .addCase(loadProfileAction.rejected, (state) => {
            state.loading = false
            state.user = null
            state.isAuthenticated = false
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
        })
    }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
