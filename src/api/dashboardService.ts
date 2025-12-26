import { questionApi } from "./question"
import { userApi } from "./userService"
import { progressApi } from "./progress"
import { getLanguages } from "./language"

export interface UserDashboardStats {
    currentStreak: string
    totalLanguages: number
    allLanguagesCount: number
    totalQuestions: number
    solvedQuestions: number
}

export interface RecentQuestion {
    title: string
    time: string
    difficulty: 'easy' | 'medium' | 'hard'
    language: string
}

export interface AchievementData {
    badgesEarned: number
    certificates: number
}

export interface LanguageDistribution {
    labels: string[]
    data: number[]
}

export interface AdminDashboardStats {
    totalUsers: number
    activeToday: number
    totalLanguages: number
    totalQuestions: number
    totalAdmins: number
    newUsersToday: number
}

class DashboardService {
    private extractData(response: any): any[] {
        if (Array.isArray(response)) return response
        if (response?.data) {
            if (Array.isArray(response.data)) return response.data
            if (Array.isArray(response.data.data)) return response.data.data
        }
        return []
    }

    private extractItem(response: any): any {
        return response?.data?.data || response?.data || response
    }

    private normalizeLanguageName(lang: string): string {
        if (!lang?.trim()) return 'Unknown'
        const map: Record<string, string> = {
            javascript: 'JavaScript', js: 'JavaScript',
            typescript: 'TypeScript', ts: 'TypeScript',
            python: 'Python',
            java: 'Java',
            cpp: 'C++', 'c++': 'C++',
            go: 'Go', golang: 'Go',
            rust: 'Rust',
            php: 'PHP',
            ruby: 'Ruby',
            csharp: 'C#', 'c#': 'C#',
            swift: 'Swift',
            kotlin: 'Kotlin',
            html: 'HTML',
            css: 'CSS',
            sql: 'SQL',
            bash: 'Bash', shell: 'Shell',
        }
        const lower = lang.toLowerCase().trim()
        return map[lower] || lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()
    }

    private getTimeAgo(dateInput: string | Date | number): string {
        const past = new Date(dateInput)
        if (isNaN(past.getTime())) return "Recently"
        const now = new Date()
        const diffMs = now.getTime() - past.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffMins < 60) return diffMins <= 0 ? "Just now" : `${diffMins} min${diffMins === 1 ? '' : 's'} ago`
        if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
        if (diffDays === 1) return "Yesterday"
        if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${diffDays < 14 ? '' : 's'} ago`
        return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    private getUserSolvedProgress(progressList: any[], userId: string): any[] {
        return progressList.filter((p: any) => {
            const progressUserId = p.userId || p.user?._id || p.user?.id || p.user
            const isSolved = p.isCorrect === true || p.status === 'solved' || p.solved === true
            return progressUserId?.toString() === userId && isSolved
        })
    }

    async getUserDashboardStats(userId: string, username: string): Promise<UserDashboardStats> {
        try {
            const [userProfileRes, progressRes, questionsRes, languagesRes] = await Promise.all([
                userApi.getUserProfile(username),
                progressApi.getAll(),
                questionApi.getAll(),
                getLanguages(),
            ])

            const userProfile = this.extractItem(userProfileRes)
            const progressList = this.extractData(progressRes)
            const allQuestions = this.extractData(questionsRes)
            const languages = this.extractData(languagesRes)

            const solvedProgress = this.getUserSolvedProgress(progressList, userId)
            const solvedCount = solvedProgress.length

            const streak = userProfile?.currentStreak > 0
                ? userProfile.currentStreak
                : this.calculateCurrentStreak(solvedProgress)

            const userLanguages = new Set<string>()
            solvedProgress.forEach((p: any) => {
                let lang = p.language || p.question?.language
                if (typeof lang === 'object') lang = lang.name || lang.title
                if (lang) userLanguages.add(this.normalizeLanguageName(lang))
            })

            // Fallback to user profile languages if available
            if (userProfile?.languages?.length) {
                userProfile.languages.forEach((lang: any) => {
                    const name = typeof lang === 'string' ? lang : lang.name || lang.title
                    if (name) userLanguages.add(this.normalizeLanguageName(name))
                })
            }

            return {
                currentStreak: `${streak} day${streak === 1 ? '' : 's'}`,
                totalLanguages: userProfile?.certificates?.length || 0, 
                allLanguagesCount: languages.length,
                totalQuestions: allQuestions.length,
                solvedQuestions: solvedCount,
            }
        } catch (error) {
            console.error('Error fetching user dashboard stats:', error)
            return this.getDefaultUserStats()
        }
    }

    async getRecentQuestions(userId: string): Promise<RecentQuestion[]> {
        try {
            const [progressRes, questionsRes] = await Promise.all([
                progressApi.getAll(),
                questionApi.getAll(),
            ])

            const progressList = this.extractData(progressRes)
            const allQuestionsMap = new Map<string, any>()
            this.extractData(questionsRes).forEach((q: any) => {
                allQuestionsMap.set(q._id.toString(), q)
            })

            const solvedProgress = this.getUserSolvedProgress(progressList, userId)
            .sort((a: any, b: any) => {
                const dateA = new Date(a.updatedAt || a.createdAt || a.submittedAt || 0).getTime()
                const dateB = new Date(b.updatedAt || b.createdAt || b.submittedAt || 0).getTime()
                return dateB - dateA
            })
            .slice(0, 3)

            const recentQuestions: RecentQuestion[] = solvedProgress.map((progress) => {
                const question = allQuestionsMap.get(progress.questionId || progress.question?._id) || progress.question

                let title = 'Unknown Question'
                let difficulty: 'easy' | 'medium' | 'hard' = 'medium'
                let language = 'Unknown'

                if (question) {
                    title = question.title || question.name || title
                    difficulty = (question.difficulty?.toLowerCase() || 'medium') as any
                    let langRaw = question.language
                    if (typeof langRaw === 'object') {
                        language = langRaw.name || langRaw.title || langRaw.slug || 'Unknown'
                    } else if (typeof langRaw === 'string') {
                        language = langRaw
                    }
                }

                language = this.normalizeLanguageName(language)

                const time = this.getTimeAgo(progress.updatedAt || progress.createdAt || progress.submittedAt)

                return { title, time, difficulty, language }
            })

            return recentQuestions
        } catch (error) {
            console.error('Error fetching recent questions:', error)
            return []
        }
    }

    async getUserAchievements(username: string): Promise<AchievementData> {
        try {
            const userRes = await userApi.getUserProfile(username)
            const userData = this.extractItem(userRes)
            return {
                badgesEarned: userData?.badges?.length || 0,
                certificates: userData?.certificates?.length || 0,
            }
        } catch (error) {
            console.error('Error fetching achievements:', error)
            return { badgesEarned: 0, certificates: 0 }
        }
    }

    async getAdminDashboardStats(): Promise<AdminDashboardStats> {
        try {
            const [usersRes, questionsRes, progressRes, languagesRes] = await Promise.all([
                userApi.getAllUsers(),
                questionApi.getAll(),
                progressApi.getAll(),
                getLanguages(),
            ])

            const users = this.extractData(usersRes)
            const allQuestions = this.extractData(questionsRes)
            const progressList = this.extractData(progressRes)
            const languages = this.extractData(languagesRes)

            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const activeUsers = new Set<string>()
            progressList.forEach((p: any) => {
                const date = new Date(p.updatedAt || p.createdAt || p.submittedAt || 0)
                if (date >= today) {
                    const uid = p.userId || p.user?._id || p.user
                    if (uid) activeUsers.add(uid.toString())
                }
            })

            const newUsersToday = users.filter((u: any) => {
                const created = new Date(u.createdAt || u.createdOn || 0)
                return created >= today
            }).length

            const totalAdmins = users.filter((u: any) => {
                const roles = u.roles || u.role || []
                if (typeof roles === 'string') return roles.toLowerCase().includes('admin')
                return Array.isArray(roles) && roles.some((r: string) => r.toLowerCase().includes('admin'))
            }).length

            return {
                totalUsers: users.length,
                activeToday: activeUsers.size,
                totalLanguages: languages.length,
                totalQuestions: allQuestions.length,
                totalAdmins,
                newUsersToday,
            }
        } catch (error) {
            console.error('Error fetching admin dashboard stats:', error)
            return this.getDefaultAdminStats()
        }
    }

    async getLanguageDistribution(): Promise<LanguageDistribution> {
        try {
            const [questionsRes, languagesRes] = await Promise.all([
                questionApi.getAll(),
                getLanguages(),
            ])

            const allQuestions = this.extractData(questionsRes)
            const allLanguages = this.extractData(languagesRes)

            const counts: Record<string, number> = {}

            allQuestions.forEach((q: any) => {
                let lang = 'Unknown'
                if (q.language) {
                    lang = typeof q.language === 'string' ? q.language : q.language.name || q.language.title || 'Unknown'
                }
                lang = this.normalizeLanguageName(lang)
                counts[lang] = (counts[lang] || 0) + 1
            })

            // Include all languages even if they have 0 questions
            allLanguages.forEach((lang: any) => {
                const name = typeof lang === 'string' ? lang : lang.name || lang.title || 'Unknown'
                const normalized = this.normalizeLanguageName(name)
                if (!(normalized in counts)) counts[normalized] = 0
            })

            const sorted = Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)

            return {
                labels: sorted.map(([name]) => name),
                data: sorted.map(([, count]) => count),
            }
        } catch (error) {
            console.error('Error fetching language distribution:', error)
            return this.getDefaultLanguageDistribution()
        }
    }

    private calculateCurrentStreak(progressList: any[]): number {
        if (progressList.length === 0) return 0

        const dateSet = new Set<string>()
        progressList.forEach(p => {
            const date = new Date(p.updatedAt || p.createdAt || p.submittedAt || 0)
            dateSet.add(date.toISOString().split('T')[0])
        })

        const dates = Array.from(dateSet).sort().reverse()
        if (dates.length === 0) return 0

        let streak = 1
        let current = new Date(dates[0])
        current.setHours(0, 0, 0, 0)

        for (let i = 1; i < dates.length; i++) {
            const next = new Date(dates[i])
            next.setHours(0, 0, 0, 0)
            const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24))
            if (diffDays === 1) {
                streak++
                current = next
            } else if (diffDays > 1) {
                break
            }
        }
        return streak
    }

    public getDefaultUserStats(): UserDashboardStats {
        return {
            currentStreak: "0 days",
            totalLanguages: 0,
            allLanguagesCount: 0,
            totalQuestions: 0,
            solvedQuestions: 0,
        }
    }

    public getDefaultAdminStats(): AdminDashboardStats {
        return {
            totalUsers: 0,
            activeToday: 0,
            totalLanguages: 0,
            totalQuestions: 0,
            totalAdmins: 0,
            newUsersToday: 0,
        }
    }

    public getDefaultLanguageDistribution(): LanguageDistribution {
        return {
            labels: ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript'],
            data: [120, 100, 80, 60, 40],
        }
    }
}

export const dashboardService = new DashboardService()
