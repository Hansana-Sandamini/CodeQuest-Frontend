import { useState, useCallback } from 'react'
import { userApi } from '../api/userService'
import type { IUser, Role } from '../types/User'

export const useUsers = () => {
    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await userApi.getAllUsers()
            setUsers(data)
            return data
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch users')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const updateUserRole = useCallback(async (userId: string, roles: Role[]) => {
        setLoading(true)
        setError(null)
        try {
            const updatedUser = await userApi.updateUserRole(userId, roles)
            setUsers(prev => prev.map(user => 
                user._id === userId ? updatedUser : user
            ))
            return updatedUser
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update user role')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const deleteUser = useCallback(async (userId: string) => {
        setLoading(true)
        setError(null)
        try {
            await userApi.deleteUser(userId)
            setUsers(prev => prev.filter(user => user._id !== userId))
            return true
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete user')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const getUserById = useCallback(async (userId: string) => {
        try {
            return await userApi.getUserById(userId)
        } catch (err: any) {
            throw err
        }
    }, [])

    return {
        users,
        loading,
        error,
        fetchUsers,
        updateUserRole,
        deleteUser,
        getUserById,
        clearError: () => setError(null),
    }
}
