export enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface IBadge {
    _id?: string
    language: {
        _id: string
        name: string
        iconUrl?: string
    }
    level: string
    percentage: number
    color: string
    earnedAt: string
}

export interface ICertificate {
    _id?: string
    language: {
        _id: string
        name: string
        iconUrl?: string
    }
    url: string
    earnedAt: string
}

export interface IUser {
    _id: string
    username: string
    email: string
    firstname?: string
    lastname?: string
    profilePicture?: string
    roles: Role[]
    badges: IBadge[]
    certificates: ICertificate[]
    currentStreak?: number
    longestStreak?: number
    lastActiveDate?: string
    createdAt: string
    updatedAt: string
}

export interface IUserProfile extends Pick<IUser, 
    'username' | 'firstname' | 'lastname' | 'profilePicture' | 
    'badges' | 'certificates' | 'createdAt'
> {}

export interface UpdateProfileData {
    firstname?: string
    lastname?: string
    username?: string
}

export interface ChangePasswordData {
    oldPassword: string
    newPassword: string
}
