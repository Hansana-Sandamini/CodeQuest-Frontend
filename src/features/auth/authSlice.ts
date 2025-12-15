import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { loginUserAction, registerUserAction, loadProfileAction, forgotPasswordAction } from "./authActions"

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
        },
        updateUser: (state, action: PayloadAction<any>) => {
            if (state.user) {
                // Merge the existing user with the updated data
                state.user = { ...state.user, ...action.payload }
            } else {
                // If no user exists, set the new user data
                state.user = action.payload
                state.isAuthenticated = true
            }
        },
        updateProfilePicture: (state, action: PayloadAction<{ profilePicture: string }>) => {
            if (state.user) {
                state.user.profilePicture = action.payload.profilePicture
            }
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
        .addCase(forgotPasswordAction.pending, (state) => { state.loading = true })
        .addCase(forgotPasswordAction.fulfilled, (state) => { state.loading = false })
        .addCase(forgotPasswordAction.rejected, (state) => { state.loading = false })
    }
})

export const { logout, updateUser, updateProfilePicture } = authSlice.actions
export default authSlice.reducer
