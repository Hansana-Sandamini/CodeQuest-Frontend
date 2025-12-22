import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import {
    dashboardService,
    type AchievementData,
    type AdminDashboardStats,
    type LanguageDistribution,
    type RecentQuestion,
    type UserDashboardStats,
} from '../api/dashboardService'

export const useUserDashboard = () => {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()

    const [stats, setStats] = useState<UserDashboardStats | null>(null)
    const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([])
    const [achievements, setAchievements] = useState<AchievementData>({
        badgesEarned: 0,
        certificates: 0,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        if (!user?.username) return

        const userId = user._id?.toString()
        const username = user.username

        setLoading(true)
        setError(null)

        try {
            const [statsData, recentData, achievementsData] = await Promise.all([
                dashboardService.getUserDashboardStats(userId || username, username),
                dashboardService.getRecentQuestions(userId || username),
                dashboardService.getUserAchievements(username),
            ])

            setStats(statsData)
            setRecentQuestions(recentData)
            setAchievements(achievementsData)
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to load dashboard'
            setError(msg)
            setStats(dashboardService.getDefaultUserStats())
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            setStats(null)
            setRecentQuestions([])
            setAchievements({ badgesEarned: 0, certificates: 0 })
            setLoading(false)
            return
        }

        if (authLoading) {
            setLoading(true)
            return
        }

        if (isAuthenticated && user?.username) {
            fetchData()

            const interval = setInterval(fetchData, 5 * 60 * 1000)
            return () => clearInterval(interval)
        }
    }, [isAuthenticated, authLoading, user, fetchData])

    const refresh = useCallback(() => fetchData(), [fetchData])

    return { stats, recentQuestions, achievements, loading: loading || authLoading, error, refresh }
}

export const useAdminDashboard = () => {
    const [stats, setStats] = useState<AdminDashboardStats | null>(null)
    const [languageDistribution, setLanguageDistribution] = useState<LanguageDistribution | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const [statsData, distData] = await Promise.all([
                dashboardService.getAdminDashboardStats(),
                dashboardService.getLanguageDistribution(),
            ])

            setStats(statsData)
            setLanguageDistribution(distData)
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to load admin dashboard'
            setError(msg)
            setStats(dashboardService.getDefaultAdminStats())
            setLanguageDistribution(dashboardService.getDefaultLanguageDistribution())
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [fetchData])

    const refresh = useCallback(() => fetchData(), [fetchData])

    return { stats, languageDistribution, loading, error, refresh }
}
