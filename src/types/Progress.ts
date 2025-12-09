export enum ProgressStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    SKIPPED = "SKIPPED",
}

export interface IProgress {
    _id: string
    user: string
    question: string
    language: string
    difficulty: string
    type: string
    status: ProgressStatus
    attempts: number
    lastAttempted?: string
    completedAt?: string
    codeSolution?: string
    selectedAnswer?: number
    isCorrect: boolean
    timeSpent: number
    pointsEarned: number
}

export interface QuestionProgress {
    questionId: string
    attempts: number
    isCorrect: boolean
    status: ProgressStatus
    selectedAnswer?: number
    codeSolution?: string
    pointsEarned: number
}
