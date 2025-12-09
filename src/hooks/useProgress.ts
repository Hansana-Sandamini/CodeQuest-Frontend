import { useState, useEffect, useCallback } from 'react'
import { progressApi } from '../api/progress'
import { ProgressStatus } from '../types/Progress'

export const useProgress = (questionId: string) => {
    const [progress, setProgress] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isCorrect, setIsCorrect] = useState(false)
    const [attempts, setAttempts] = useState(0)

    const fetchProgress = useCallback(async () => {
        try {
            const progressList = await progressApi.getAll()
            const found = progressList.find((p: any) => p.question._id === questionId)
            setProgress(found || null)
            if (found) {
                setIsCorrect(found.isCorrect)
                setAttempts(found.attempts)
            }
        } catch (error) {
            console.error('Failed to fetch progress:', error)
        } finally {
            setLoading(false)
        }
    }, [questionId])

    useEffect(() => {
        fetchProgress()
    }, [fetchProgress])

    const submitAnswer = async (data: { selectedAnswer?: number; code?: string }) => {
        try {
            const res = await progressApi.submit(questionId, data)
            await fetchProgress()
            return res
        } catch (error) {
            throw error
        }
    }

    const canAttempt = () => {
        if (!progress) return true
        return progress.status !== ProgressStatus.COMPLETED || !progress.isCorrect
    }

    const getPointsEarned = () => {
        return progress?.pointsEarned || 0
    }

    return {
        progress,
        loading,
        isCorrect,
        attempts,
        canAttempt,
        getPointsEarned,
        submitAnswer,
        refreshProgress: fetchProgress,
    }
}
