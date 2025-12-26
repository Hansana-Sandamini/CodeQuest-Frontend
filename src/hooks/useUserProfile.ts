import { useState, useCallback } from 'react'
import { userApi } from '../api/userService'
import type { IUserProfile, UpdateProfileData } from '../types/User'

export const useUserProfile = () => {
    const [profile, setProfile] = useState<IUserProfile | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProfile = useCallback(async (username: string) => {
        setLoading(true)
        setError(null)
        try {
            const data = await userApi.getUserProfile(username)
            setProfile(data)
            return data
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch profile')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const updateProfile = useCallback(async (data: UpdateProfileData) => {
        setLoading(true)
        setError(null)
        try {
            const updated = await userApi.updateMyProfile(data)
            // If updating own profile, update local state
            if (profile?.username === updated.username) {
                setProfile(prev => prev ? { ...prev, ...data } : null)
            }
            return updated
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile')
            throw err
        } finally {
            setLoading(false)
        }
    }, [profile])

    const updateProfilePicture = useCallback(async (imageFile: File) => {
        setLoading(true)
        setError(null)
        try {
            const result = await userApi.updateProfilePicture(imageFile)
            // Update local state
            if (profile) {
                setProfile({ ...profile, profilePicture: result.profilePicture })
            }
            return result
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile picture')
            throw err
        } finally {
            setLoading(false)
        }
    }, [profile])

    const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
        setLoading(true)
        setError(null)
        try {
            const result = await userApi.changePassword(oldPassword, newPassword)
            return result
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to change password')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        updateProfilePicture,
        changePassword,
        clearError: () => setError(null),
    }
}
