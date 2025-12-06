import type { IUser } from "./User"

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    message: string
    accessToken: string
    refreshToken: string
    user: IUser
}

export interface RegisterRequest {
    firstname: string
    lastname: string
    username: string
    email: string
    password: string
    profilePicture?: File | null
}

export interface RegisterResponse {
    message: string
    data: {
        email: string
        roles: string[]
    }
}

export interface RefreshTokenResponse {
    accessToken: string
}
