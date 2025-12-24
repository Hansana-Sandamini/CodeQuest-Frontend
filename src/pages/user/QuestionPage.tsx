import { useEffect, useState, useCallback } from "react"
import { useParams, useLocation, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, CheckSquare, Code2, Loader2, CheckCircle, XCircle, HelpCircle, Sparkles, RefreshCw } from "lucide-react"
import Editor from "react-monaco-editor"
import { questionApi } from "../../api/question"
import { progressApi } from "../../api/progress"
import { getMyProfile } from "../../api/authService"
import { type Question, Difficulty, QuestionType } from "../../types/Question"
import { ProgressStatus } from "../../types/Progress"
import swal from "../../utils/swal"
import confetti from "canvas-confetti"
import { useDispatch } from "react-redux"
import { updateUser } from "../../features/auth/authSlice"

const QuestionPage = () => {
    const { id } = useParams<{ id: string }>()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const languageName = (location.state as any)?.languageName || "Language"
    const questionTitle = (location.state as any)?.questionTitle || "Question"
    const questionsList = (location.state as any)?.questions || []

    const [question, setQuestion] = useState<Question | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [code, setCode] = useState("")
    const [activeTestCase, setActiveTestCase] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [hint, setHint] = useState<string | null>(null)
    const [hintLoading, setHintLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [checkingMilestones, setCheckingMilestones] = useState(false)
    const [userProgress, setUserProgress] = useState<any>(null)
    const [pointsEarned, setPointsEarned] = useState<number>(0)
    const [languageProgress, setLanguageProgress] = useState<number>(0)

    const getPreviousPercentage = (langId: string) => {
        return Number(localStorage.getItem(`progress_${langId}`) || "0")
    }

    const savePreviousPercentage = (langId: string, percent: number) => {
        localStorage.setItem(`progress_${langId}`, percent.toString())
    }

    const getMonacoLanguage = (langName: string): string => {
        const l = langName.toLowerCase().trim()

        if (l.includes("javascript") || l.includes("js")) return "javascript"
        if (l.includes("typescript") || l.includes("ts")) return "typescript"
        if (l.includes("python")) return "python"
        if (l.includes("java")) return "java"
        if (l.includes("c++") || l.includes("cpp")) return "cpp"
        if (l.includes("c#") || l.includes("csharp")) return "csharp"
        if (l.includes("c")) return "c"
        if (l.includes("go") || l.includes("golang")) return "go"
        if (l.includes("rust")) return "rust"
        if (l.includes("kotlin")) return "kotlin"
        if (l.includes("swift")) return "swift"
        if (l.includes("php")) return "php"
        if (l.includes("ruby")) return "ruby"
        if (l.includes("perl")) return "perl"
        if (l.includes("r ")) return "r"
        if (l.includes("dart")) return "dart"
        if (l.includes("scala")) return "scala"
        if (l.includes("haskell")) return "haskell"
        if (l.includes("lua")) return "lua"
        if (l.includes("bash") || l.includes("shell")) return "shell"
        if (l.includes("sql")) return "sql"
        if (l.includes("html")) return "html"
        if (l.includes("css")) return "css"

        return "plaintext"
    }

    const triggerConfetti = (type: 'normal' | 'badge' | 'certificate' = 'normal') => {
        const defaults = {
            particleCount: type === 'certificate' ? 200 : type === 'badge' ? 120 : 80,
            spread: 100,
            origin: { y: 0.6 }
        }

        confetti(defaults)

        if (type === 'certificate' || type === 'badge') {
            setTimeout(() => {
                confetti({
                    ...defaults,
                    particleCount: 100,
                    angle: 60,
                    origin: { x: 0 }
                })
                confetti({
                    ...defaults,
                    particleCount: 100,
                    angle: 120,
                    origin: { x: 1 }
                })
            }, 300)
        }
    }

    const fetchQuestion = useCallback(async () => {
        try {
            setLoading(true)
            const res = await questionApi.getOne(id!)
            const q = res.data.data
            setQuestion(q)

            const progressRes = await progressApi.getAll()
            const progressList = Array.isArray(progressRes) ? progressRes : (progressRes.data?.data || [])
            const thisProgress = progressList.find((p: any) => p.question._id === id)
            setUserProgress(thisProgress || null)

            if (thisProgress?.isCorrect) {
                setIsCorrect(true)
                setShowResult(true)
                setPointsEarned(thisProgress.pointsEarned || 0)
                if (q.type === QuestionType.MCQ) {
                    setSelectedOption(thisProgress.selectedAnswer)
                }
            }

            const langProgress = progressList.filter((p: any) => p.language._id === q.language._id)
            const completed = langProgress.filter((p: any) => p.isCorrect && p.status === ProgressStatus.COMPLETED).length
            const total = questionsList.length > 0 ? questionsList.length : langProgress.length
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0
            setLanguageProgress(percent)

            if (q.language?._id) {
                savePreviousPercentage(q.language._id, percent)
            }

            if (q.type === QuestionType.CODING) {
                const lang = q.language.name.toLowerCase()
                let template = "// Start coding here...\nconsole.log('Ready to code!')"

                if (lang.includes("python")) {
                    template = `# Write your solution here\ndef solution():\n    # Your code here\n    pass\n\nsolution()`
                } else if (lang.includes("javascript") || lang.includes("js")) {
                    template = `// Write your solution here\nfunction solution() {\n    console.log("Hello World!");\n}\n\nsolution();`
                } else if (lang.includes("java")) {
                    template = `public class Solution {\n    // Write your method here\n}`
                } else if (lang.includes("c++") || lang.includes("cpp")) {
                    template = `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code\n    return 0;\n}`
                }

                setCode(thisProgress?.codeSolution || template)
            }
        } catch (err) {
            console.error("Failed to load question")
            swal.fire("Error", "Could not load question", "error")
        } finally {
            setLoading(false)
        }
    }, [id, questionsList])

    useEffect(() => {
        if (id) fetchQuestion()
    }, [id, fetchQuestion])

    const handleGetHint = async () => {
        setHintLoading(true)
        try {
            const res = await questionApi.getHint(id!)
            setHint(res.data.hint)
        } catch (err) {
            swal.fire("Error", "Failed to get hint", "error")
        } finally {
            setHintLoading(false)
        }
    }

    const showCertificatePopup = async (languageName: string, certificateUrl?: string) => {
        triggerConfetti('certificate')

        await swal.fire({
            title: '🎓 Certificate Earned!',
            html: `
                <div style="text-align: center; padding: 1.5rem;">
                    <div style="font-size: 5.5rem; margin-bottom: 1rem;">📜</div>
                    <h2 style="margin-bottom: 1rem; color: #2c3e50;">Congratulations!</h2>
                    <p style="font-size: 1.3rem; margin-bottom: 1.5rem;">
                        You have mastered <strong>${languageName}</strong>!<br>
                        100% completion achieved 🎉
                    </p>
                    <button id="view-cert-btn" style="
                        background: linear-gradient(135deg, #6366f1, #a855f7);
                        color: white;
                        padding: 14px 36px;
                        font-size: 1.2rem;
                        border-radius: 12px;
                        border: none;
                        cursor: pointer;
                        margin: 1rem auto;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                        View My Certificate
                    </button>
                </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                const btn = document.getElementById('view-cert-btn')
                if (btn) {
                    btn.addEventListener('click', () => {
                        if (certificateUrl && certificateUrl.startsWith('http')) {
                            window.open(certificateUrl, '_blank')
                        } else {
                            navigate('/profile?tab=certificates')
                        }
                        swal.close()
                    })
                }
            }
        })
    }

    const checkForNewMilestones = async (progressList: any[], languageId: string, languageName: string) => {
        const previous = getPreviousPercentage(languageId)

        const completedCount = progressList.filter(
            (p: any) => p.language?._id === languageId && p.isCorrect && p.status === ProgressStatus.COMPLETED
        ).length

        const total = questionsList.length > 0 ? questionsList.length : progressList.filter(p => p.language?._id === languageId).length
        const current = total > 0 ? Math.round((completedCount / total) * 100) : 0

        savePreviousPercentage(languageId, current)

        const milestones = [
            { percent: 20, name: "Bronze Learner" },
            { percent: 40, name: "Silver Coder" },
            { percent: 60, name: "Gold Developer" },
            { percent: 80, name: "Platinum Master" },
        ]

        for (const m of milestones) {
            if (previous < m.percent && current >= m.percent) {
                triggerConfetti('badge')
                await swal.fire({
                    icon: "success",
                    title: "🏆 New Badge Unlocked!",
                    html: `
                        <div style="text-align: center;">
                            <div style="font-size: 4rem; margin-bottom: 1rem;">
                                ${m.percent === 20 ? '🥉' : m.percent === 40 ? '🥈' : m.percent === 60 ? '🥇' : '🏆'}
                            </div>
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: ${m.percent === 20 ? '#CD7F32' : m.percent === 40 ? '#C0C0C0' : m.percent === 60 ? '#FFD700' : '#E5E4E2'}">${m.name}</h3>
                            <p style="font-size: 1.1rem;">Achieved ${m.percent}% in <strong>${languageName}</strong></p>
                        </div>
                    `,
                    confirmButtonText: "Awesome!",
                    allowOutsideClick: false,
                })
            }
        }

        if (previous < 100 && current === 100) {
            try {
                const userRes = await getMyProfile()
                const user = userRes.data?.user || userRes.data || userRes

                const cert = user?.certificates?.find(
                    (c: any) =>
                        c.language?._id === languageId ||
                        c.language === languageId ||
                        (typeof c.language === 'object' && c.language?.toString() === languageId)
                )

                await showCertificatePopup(languageName, cert?.url)
            } catch (err) {
                console.error("Could not fetch latest certificate info:", err)
                await showCertificatePopup(languageName)
            }
        }
    }

    const isLastQuestion = useCallback(() => {
        if (questionsList.length === 0) return true
        return questionsList.findIndex((q: any) => q._id === id) === questionsList.length - 1
    }, [questionsList, id])

    const handleMCQSubmit = async () => {
        if (selectedOption === null) return
        if (userProgress?.isCorrect === true) {
            swal.fire("Already Completed", "You've already solved this correctly!", "info")
            return
        }

        setSubmitLoading(true)
        try {
            const res = await progressApi.submit(id!, { selectedAnswer: selectedOption })
            setIsCorrect(res.isCorrect)
            setShowResult(true)
            setPointsEarned(res.pointsEarned)

            const updatedProgress = await progressApi.getAll()
            const progressList = Array.isArray(updatedProgress) ? updatedProgress : (updatedProgress.data?.data || [])
            const thisProgress = progressList.find((p: any) => p.question._id === id)
            setUserProgress(thisProgress)

            if (question?.language?._id) {
                const langProgressItems = progressList.filter((p: any) => p.language._id === question.language._id)
                const completed = langProgressItems.filter((p: any) => p.isCorrect && p.status === ProgressStatus.COMPLETED).length
                const total = questionsList.length || langProgressItems.length
                setLanguageProgress(total > 0 ? Math.round((completed / total) * 100) : 0)
            }

            if (res.isCorrect) {
                triggerConfetti('normal')

                const last = isLastQuestion()

                await swal.fire({
                    icon: "success",
                    title: "Correct! 🎉",
                    text: `+${res.pointsEarned} points earned!${last ? "\nYou've completed all questions in this language!" : ""}`,
                    confirmButtonText: last ? "Great!" : "Next Question",
                }).then(() => {
                    if (!last) {
                        navigateToNextQuestion()
                    }
                    // If last → stay on page 
                })

                if (question?.language?._id && !checkingMilestones) {
                    setCheckingMilestones(true)
                    try {
                        await checkForNewMilestones(progressList, question.language._id, languageName)
                    } finally {
                        setCheckingMilestones(false)
                    }
                }
            } else {
                swal.fire({
                    icon: "error",
                    title: "Incorrect",
                    text: "Try another option!",
                    confirmButtonText: "Try Again",
                })
            }
        } catch (err) {
            swal.fire("Error", "Submission failed", "error")
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleCodeSubmit = async () => {
        if (!code.trim()) {
            swal.fire("Empty Code", "Please write some code first", "warning")
            return
        }

        if (userProgress?.isCorrect === true) {
            swal.fire("Already Completed", "You've already solved this correctly!", "info")
            return
        }

        setSubmitLoading(true)
        try {
            const res = await progressApi.submit(id!, { code })
            setIsCorrect(res.isCorrect)
            setShowResult(true)
            setPointsEarned(res.pointsEarned)

            const updatedProgress = await progressApi.getAll()
            const progressList = Array.isArray(updatedProgress) ? updatedProgress : (updatedProgress.data?.data || [])
            const thisProgress = progressList.find((p: any) => p.question._id === id)
            setUserProgress(thisProgress)

            if (question?.language?._id) {
                const langProgressItems = progressList.filter((p: any) => p.language._id === question.language._id)
                const completed = langProgressItems.filter((p: any) => p.isCorrect && p.status === ProgressStatus.COMPLETED).length
                const total = questionsList.length || langProgressItems.length
                setLanguageProgress(total > 0 ? Math.round((completed / total) * 100) : 0)
            }

            if (res.isCorrect) {
                triggerConfetti('normal')

                const last = isLastQuestion()

                await swal.fire({
                    icon: "success",
                    title: "All Tests Passed! 🚀",
                    text: `+${res.pointsEarned} points earned!${last ? "\nYou've completed all questions in this language!" : ""}`,
                    confirmButtonText: last ? "Great!" : "Next Question",
                }).then(() => {
                    if (!last) {
                        navigateToNextQuestion()
                    }
                })

                if (question?.language?._id && !checkingMilestones) {
                    setCheckingMilestones(true)
                    try {
                        await checkForNewMilestones(progressList, question.language._id, languageName)

                        // Fetch updated user profile and dispatch to Redux to ensure badges/certificates are up-to-date
                        const userRes = await getMyProfile()
                        const updatedUser = userRes.data?.user || userRes.data || userRes
                        dispatch(updateUser(updatedUser))
                    } finally {
                        setCheckingMilestones(false)
                    }
                }
            } else {
                swal.fire({
                    icon: "error",
                    title: "Test Failed",
                    text: "Review your code and try again",
                    confirmButtonText: "Keep Trying",
                })
            }
        } catch (err: any) {
            swal.fire("Error", err?.message || "Submission failed", "error")
        } finally {
            setSubmitLoading(false)
        }
    }

    const navigateToNextQuestion = () => {
        let questions = questionsList

        if (!questions.length) {
            const stored = localStorage.getItem("currentLanguageQuestions")
            if (stored) questions = JSON.parse(stored)
        }

        if (!question || !question.language?._id) {
            navigate(`/languages/${question?.language?._id || ''}`, {
                state: { languageName },
                replace: true
            })
            return
        }

        const currentIndex = questions.findIndex((q: any) => q._id === id)

        if (currentIndex >= 0 && currentIndex < questions.length - 1) {
            const next = questions[currentIndex + 1]
            navigate(`/question/${next._id}`, {
                state: { languageName, questionTitle: next.title, questions },
            })
        } else {
            // Last question → go to language overview
            navigate(`/languages/${question.language._id}`, {
                state: { languageName },
                replace: true,
            })
        }
    }

    const handleReset = () => {
        setShowResult(false)
        setIsCorrect(false)
        setHint(null)
        setSelectedOption(null)

        if (question?.type === QuestionType.CODING) {
            const lang = question.language.name.toLowerCase()
            let template = "// Start coding..."
            if (lang.includes("python")) template = "# Write your solution here\ndef solution():\n    pass\nsolution()"
            else if (lang.includes("javascript")) template = "// Write your solution here\nfunction solution() {\n    console.log('Hello');\n}\nsolution();"
            setCode(template)
        }
    }

    const getDifficultyClass = (difficulty: Difficulty) => {
        switch (difficulty) {
            case Difficulty.EASY: return "bg-green-500/20 text-green-400 border-green-500/50"
            case Difficulty.MEDIUM: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
            case Difficulty.HARD: return "bg-red-500/20 text-red-400 border-red-500/50"
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/50"
        }
    }

    const isCorrectlyCompleted = userProgress?.isCorrect === true

    if (loading || !question) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <Loader2 className="w-16 h-16 animate-spin text-green-400" />
            </div>
        )
    }

    return (
        <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 lg:py-12 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header & Progress */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                    <Link
                        to={`/languages/${question.language._id}`}
                        state={{ languageName }}
                        className="flex items-center gap-2 text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to {languageName}
                    </Link>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {userProgress && (
                            <div className="bg-gray-800/60 px-4 py-2 rounded-lg border border-gray-700">
                                <span className="text-gray-400">Attempts:</span>
                                <span className="font-bold ml-2">{userProgress.attempts || 0}</span>
                            </div>
                        )}

                        <div className="bg-gray-800/60 px-5 py-3 rounded-xl border border-gray-700 min-w-[220px]">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-sm text-gray-400">{languageName} Progress</span>
                                <span className="font-bold text-lg">{languageProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000 ease-out"
                                    style={{ width: `${languageProgress}%` }}
                                />
                            </div>
                        </div>

                        {isCorrectlyCompleted && (
                            <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/50">
                                <span className="text-green-400">✓ Completed</span>
                                <span className="font-bold ml-2">(+{pointsEarned} pts)</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        {questionTitle}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-4 mt-4 text-gray-400">
                        <span className="flex items-center gap-2"><Code2 className="w-5 h-5" /> {languageName}</span>
                        <span className={`px-4 py-1 rounded-full border text-sm font-bold ${getDifficultyClass(question.difficulty)}`}>
                            {question.difficulty}
                        </span>
                        <span className="flex items-center gap-2">
                            {question.type === QuestionType.MCQ ? <CheckSquare className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
                            {question.type === QuestionType.MCQ ? "Multiple Choice" : "Coding Challenge"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left: Question & Options */}
                    <div className="space-y-8">

                        <div className="bg-gray-800/40 backdrop-blur border border-gray-700 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6">{question.title}</h2>
                            <div className="text-gray-300 whitespace-pre-wrap">{question.description}</div>
                        </div>

                        <button
                            onClick={handleGetHint}
                            disabled={hintLoading}
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 py-4 rounded-2xl font-bold text-lg shadow-xl"
                        >
                            {hintLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                            {hintLoading ? "Loading Hint..." : "Reveal Hint"}
                        </button>

                        {hint && (
                            <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-2 border-purple-500/50 rounded-2xl p-6 text-purple-300">
                                <strong className="flex items-center gap-3 text-xl mb-3">
                                    <HelpCircle className="w-7 h-7" /> Hint
                                </strong>
                                <p>{hint}</p>
                            </div>
                        )}

                        {/* MCQ Options */}
                        {question.type === QuestionType.MCQ && question.options && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold">Choose your answer:</h3>
                                    {!isCorrectlyCompleted && (
                                        <button onClick={handleReset} className="flex items-center gap-2 text-sm bg-gray-700/50 hover:bg-gray-700 px-4 py-2 rounded-lg">
                                            <RefreshCw className="w-4 h-4" /> Reset
                                        </button>
                                    )}
                                </div>

                                {question.options.map((opt, i) => (
                                    <label
                                        key={i}
                                        className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all
                                            ${isCorrectlyCompleted && selectedOption === i && userProgress?.isCorrect
                                                ? "border-green-500 bg-green-500/20"
                                                : !isCorrectlyCompleted && selectedOption === i
                                                ? "border-blue-500 bg-blue-500/10"
                                                : userProgress?.isCorrect === false && selectedOption === i
                                                ? "border-red-500 bg-red-500/20"
                                                : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/40"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="option"
                                            className="hidden"
                                            checked={selectedOption === i}
                                            onChange={() => !isCorrectlyCompleted && setSelectedOption(i)}
                                            disabled={isCorrectlyCompleted}
                                        />

                                        <div className="flex items-center justify-between">
                                            <span className="text-lg">{opt}</span>
                                            {selectedOption === i && userProgress && (
                                                userProgress.isCorrect ? (
                                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                                ) : (
                                                    <XCircle className="w-8 h-8 text-red-400" />
                                                )
                                            )}
                                        </div>
                                    </label>
                                ))}

                                <button
                                    onClick={handleMCQSubmit}
                                    disabled={selectedOption === null || submitLoading || isCorrectlyCompleted}
                                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 font-bold text-xl disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
                                >
                                    {submitLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <CheckCircle className="w-7 h-7" />}
                                    {isCorrectlyCompleted ? "Completed" : "Submit Answer"}
                                </button>
                            </div>
                        )}

                        {/* Test Cases */}
                        {question.type === QuestionType.CODING && question.testCases && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <Code2 className="w-6 h-6" /> Test Cases
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {question.testCases.map((tc, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setActiveTestCase(i)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                activeTestCase === i
                                                    ? "border-green-500 bg-green-500/10"
                                                    : "border-gray-700 hover:border-gray-600"
                                            }`}
                                        >
                                            <strong className="block mb-2">Case {i + 1}</strong>
                                            <pre className="text-xs bg-black/40 p-3 rounded font-mono overflow-x-auto">
                                                <div><span className="text-gray-500">Input:</span> {tc.input || "<empty>"}</div>
                                                <div className="mt-2"><span className="text-gray-500">Expected:</span> {tc.expectedOutput || "<empty>"}</div>
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Code Editor */}
                    {question.type === QuestionType.CODING && (
                        <div className="space-y-6">
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                                <h3 className="text-2xl font-bold flex items-center gap-3">
                                    <Code2 className="w-7 h-7" /> Your Solution
                                </h3>
                                <div className="flex gap-3 w-full lg:w-auto">
                                    {!isCorrectlyCompleted && (
                                        <button
                                            onClick={handleReset}
                                            className="flex items-center gap-2 px-5 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl"
                                        >
                                            <RefreshCw className="w-5 h-5" /> Reset Code
                                        </button>
                                    )}
                                    <button
                                        onClick={handleCodeSubmit}
                                        disabled={submitLoading || isCorrectlyCompleted}
                                        className="flex-1 lg:flex-initial flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-bold text-lg disabled:opacity-50 shadow-xl"
                                    >
                                        {submitLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
                                        {isCorrectlyCompleted ? "Completed" : "Run & Submit"}
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-2xl overflow-hidden border-4 border-gray-800 shadow-2xl">
                                <Editor
                                    height="500px"
                                    language={getMonacoLanguage(question.language.name)}
                                    value={code}
                                    onChange={(val) => !isCorrectlyCompleted && setCode(val)}
                                    theme="vs-dark"
                                    options={{
                                        fontSize: 15,
                                        fontFamily: "'Fira Code', monospace",
                                        minimap: { enabled: false },
                                        wordWrap: "on",
                                        automaticLayout: true,
                                        scrollBeyondLastLine: false,
                                        readOnly: isCorrectlyCompleted,
                                    }}
                                />
                            </div>

                            {showResult && (
                                <div className={`p-8 rounded-2xl text-center text-2xl font-bold border-4 animate-pulse ${
                                    isCorrect
                                        ? "bg-green-600/30 border-green-500 text-green-400"
                                        : "bg-red-600/30 border-red-500 text-red-400"
                                }`}>
                                    {isCorrect ? "All Tests Passed! Genius! 🎉" : "Some Tests Failed — Keep Going!"}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default QuestionPage
