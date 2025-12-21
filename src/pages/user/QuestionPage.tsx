import { useEffect, useState, useCallback } from "react"
import { useParams, useLocation, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, CheckSquare, Code2, Loader2, CheckCircle, XCircle, HelpCircle, Sparkles, RefreshCw } from "lucide-react"
import Editor from "react-monaco-editor"
import { questionApi } from "../../api/question"
import { progressApi } from "../../api/progress"
import { type Question, Difficulty, QuestionType } from "../../types/Question"
import { ProgressStatus } from "../../types/Progress"
import swal from "../../utils/swal"

const QuestionPage = () => {
    const { id } = useParams<{ id: string }>()
    const location = useLocation()
    const navigate = useNavigate()
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
    const [userProgress, setUserProgress] = useState<any>(null)
    const [pointsEarned, setPointsEarned] = useState<number>(0)

    // Map language to Monaco editor
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

    const fetchQuestion = useCallback(async () => {
        try {
            const res = await questionApi.getOne(id!)
            const q = res.data.data
            setQuestion(q)

            // Fetch user's progress for this question
            await fetchUserProgress(id!)

            if (q.type === QuestionType.CODING) {
                const lang = q.language.name.toLowerCase()
                let template = ""
                
                // Define the boilerplate code
                const boilerplate = `const fs = require('fs');
                const lines = fs.readFileSync(0, 'utf-8')
                        .trim()
                        .split('\\n')
                        .filter(line => line.trim() !== '');`

                // Generate template based on language
                if (lang.includes("python")) {
                    template = `${boilerplate}\n\n# Write your solution here\ndef solution():\n    # Your code here\n    pass\n\n# Do not remove this line\nsolution()`
                } 
                else if (lang.includes("javascript") || lang.includes("js")) {
                    template = `${boilerplate}\n\n// Write your solution here\nfunction solution() {\n    // Your code here\n    console.log("Hello World!");\n}\n\nsolution();`
                }
                else if (lang.includes("java")) {
                    template = `${boilerplate}\n\npublic class Solution {\n    // Write your method here\n    // Example: public int[] twoSum(int[] nums, int target)\n}`
                }
                else if (lang.includes("c++") || lang.includes("cpp")) {
                    template = `${boilerplate}\n\n// Write your solution here\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code\n    return 0;\n}`
                }
                else {
                    // Safe fallback
                    template = `${boilerplate}\n\n// Start coding here...\nconsole.log("Ready to code!")`
                }
                
                // If user already has code solution, use it
                if (userProgress?.codeSolution) {
                    setCode(userProgress.codeSolution)
                } else {
                    setCode(template)
                }
            }

            // If MCQ and user has previous answer, select it
            if (q.type === QuestionType.MCQ && userProgress?.selectedAnswer !== undefined) {
                setSelectedOption(userProgress.selectedAnswer)
                if (userProgress.status === ProgressStatus.COMPLETED) {
                    setIsCorrect(userProgress.isCorrect)
                    setShowResult(true)
                    setPointsEarned(userProgress.pointsEarned || 0)
                }
            }
        } catch (err) {
            console.error("Failed to load question")
            swal.fire("Error", "Could not load question", "error")
        } finally {
            setLoading(false)
        }
    }, [id, userProgress])

    const fetchUserProgress = async (questionId: string) => {
        try {
            const progressList = await progressApi.getAll()
            const progress = progressList.find((p: any) => p.question._id === questionId)
            setUserProgress(progress || null)
            
            console.log("User Progress:", progress)
            if (progress) {
                console.log("Status:", progress.status)
                console.log("isCorrect:", progress.isCorrect)
                console.log("ProgressStatus.COMPLETED:", ProgressStatus.COMPLETED)
            }
        } catch (err) {
            console.error("Failed to fetch progress")
        }
    }

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

    const handleMCQSubmit = async () => {
        if (selectedOption === null) return
        
        // Don't allow resubmitting if already correct
        if (userProgress?.isCorrect === true) {
            swal.fire("Already Completed", "You've already completed this question correctly!", "info")
            return
        }

        setSubmitLoading(true)
        try {
            const res = await progressApi.submit(id!, { selectedAnswer: selectedOption })
            setIsCorrect(res.isCorrect)
            setShowResult(true)
            setPointsEarned(res.pointsEarned)
            
            if (res.isCorrect) {
                swal.fire({
                    icon: "success",
                    title: "Correct!",
                    text: `+${res.pointsEarned} points!`,
                    showConfirmButton: true,
                    confirmButtonText: "Next Question"
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigateToNextQuestion()
                    }
                })
            } else {
                swal.fire({
                    icon: "error",
                    title: "Incorrect",
                    text: "Try again!",
                    showDenyButton: false,
                    confirmButtonText: "Try Again"
                })
            }
            
            // Refresh progress
            await fetchUserProgress(id!)
        } catch (err) {
            swal.fire("Error", "Failed to submit", "error")
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleCodeSubmit = async () => {
        if (!code.trim()) {
            swal.fire("Error", "Please write some code first", "warning")
            return
        }
        
        // Don't allow resubmitting if already correct
        if (userProgress?.isCorrect === true) {
            swal.fire("Already Completed", "You've already completed this question correctly!", "info")
            return
        }

        setSubmitLoading(true)
        try {
            const res = await progressApi.submit(id!, { code })
            setIsCorrect(res.isCorrect)
            setShowResult(true)
            setPointsEarned(res.pointsEarned)
            
            if (res.isCorrect) {
                swal.fire({
                    icon: "success",
                    title: "All Tests Passed!",
                    text: `+${res.pointsEarned} points!`,
                    showConfirmButton: true,
                    confirmButtonText: "Next Question"
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigateToNextQuestion()
                    }
                })
            } else {
                swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: "Check your logic and try again",
                    showDenyButton: false,
                    confirmButtonText: "Try Again"
                })
            }
            
            // Refresh progress
            await fetchUserProgress(id!)
        } catch (err: any) {
            swal.fire("Error", err?.message || "Failed to submit", "error")
        } finally {
            setSubmitLoading(false)
        }
    }

    const navigateToNextQuestion = () => {
        let questions = questionsList
        
        // Try localStorage as fallback
        if (!questions.length) {
            const stored = localStorage.getItem('currentLanguageQuestions')
            if (stored) {
                questions = JSON.parse(stored)
            }
        }
        
        // If still no questions, navigate back
        if (!questions.length) {
            navigate(`/languages/${question?.language._id}/questions`, { 
                state: { languageName } 
            })
            return
        }
        
        const currentIndex = questions.findIndex((q: any) => q._id === id)
        if (currentIndex < questions.length - 1) {
            const nextQuestion = questions[currentIndex + 1]
            navigate(`/question/${nextQuestion._id}`, {
                state: { 
                    languageName, 
                    questionTitle: nextQuestion.title,
                    questions
                }
            })
        } else {
            // Last question
            navigate(`/languages/${question?.language._id}/questions`, { 
                state: { languageName } 
            })
        }
    }

    const handleReset = () => {
        setShowResult(false)
        setIsCorrect(false)
        setHint(null)
        
        if (question?.type === QuestionType.MCQ) {
            setSelectedOption(null)
        } else {
            // Reset to template
            const lang = question?.language.name.toLowerCase()
            let template = ""
            
            if (lang?.includes("python")) {
                template = `# Write your solution here\ndef solution():\n    # Your code here\n    pass\n\n# Do not remove this line\nsolution()`
            } else if (lang?.includes("javascript") || lang?.includes("js")) {
                template = `// Write your solution here\nfunction solution() {\n    // Your code here\n    console.log("Hello World!");\n}\n\nsolution();`
            } else {
                template = `// Start coding here...\nconsole.log("Ready to code!")`
            }
            
            setCode(template)
        }
    }

    const getDifficultyClass = (difficulty: Difficulty) => {
        switch (difficulty) {
            case Difficulty.EASY:   return "bg-green-500/20 text-green-400 border-green-500/50"
            case Difficulty.MEDIUM: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
            case Difficulty.HARD:   return "bg-red-500/20 text-red-400 border-red-500/50"
            default:                return "bg-gray-500/20 text-gray-400 border-gray-500/50"
        }
    }

    if (loading || !question) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
                <Loader2 className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 animate-spin text-green-400" />
            </div>
        )
    }

    // SIMPLIFY: Just check if user got it correct
    const isCorrectlyCompleted = userProgress?.isCorrect === true

    return (
        <div className="lg:ml-64 lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-6 lg:py-12 xl:py-16 px-3 lg:px-6 xl:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Back Button & Progress */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 mb-6 lg:mb-8 xl:mb-12">
                    <Link
                        to={`/languages/${question.language._id}`}
                        state={{ languageName }}
                        className="inline-flex items-center gap-1 lg:gap-2 text-gray-400 hover:text-white transition-colors text-sm lg:text-base"
                    >
                        <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                        Back to {languageName} Quizzes
                    </Link>
                    
                    {userProgress && (
                        <div className="flex items-center gap-2 lg:gap-4">
                            <div className="bg-gray-800/60 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl border border-gray-700 text-xs lg:text-sm">
                                <span className="text-gray-400">Attempts: </span>
                                <span className="font-bold text-white">{userProgress.attempts || 0}</span>
                            </div>
                            {isCorrectlyCompleted && (
                                <div className="bg-green-500/20 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl border border-green-500/50 text-xs lg:text-sm">
                                    <span className="text-green-400">✓ Completed </span>
                                    <span className="font-bold text-white">(+{pointsEarned} pts)</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Header */}
                <div className="text-center mb-8 lg:mb-12 xl:mb-16">
                    <h1 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold mb-2 lg:mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent px-4">
                        {questionTitle}
                    </h1>
                    <div className="flex flex-wrap justify-center items-center gap-3 lg:gap-4 xl:gap-6 text-gray-400 text-xs lg:text-sm">
                        <span className="flex items-center gap-1 lg:gap-2"><Code2 className="w-3 h-3 lg:w-4 lg:h-4" /> {languageName}</span>
                        <span className={`px-2 lg:px-3 xl:px-4 py-0.5 lg:py-1 rounded-full text-xs font-bold border ${getDifficultyClass(question.difficulty)}`}>
                            {question.difficulty}
                        </span>
                        <span className="flex items-center gap-1 lg:gap-2">
                            {question.type === QuestionType.MCQ ? <CheckSquare className="w-3 h-3 lg:w-4 lg:h-4" /> : <Code2 className="w-3 h-3 lg:w-4 lg:h-4" />}
                            {question.type === QuestionType.MCQ ? "Multiple Choice" : "Coding Challenge"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">

                    {/* Left Column */}
                    <div className="space-y-6 lg:space-y-8">

                        {/* Question Card */}
                        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-lg lg:rounded-xl xl:rounded-2xl p-4 lg:p-6 xl:p-8 hover:border-gray-600 transition-all duration-300">
                            <h2 className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-4 lg:mb-6">{question.title}</h2>
                            <div className="prose prose-invert max-w-none text-gray-300 text-sm lg:text-base xl:text-lg leading-relaxed whitespace-pre-wrap">
                                {question.description || "No description provided."}
                            </div>
                        </div>

                        {/* Hint */}
                        <button
                            onClick={handleGetHint}
                            disabled={hintLoading}
                            className="w-full flex items-center justify-center gap-2 lg:gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 
                                        hover:from-purple-700 hover:to-indigo-700 py-3 lg:py-4 xl:py-5 rounded-lg lg:rounded-xl xl:rounded-2xl font-bold text-base lg:text-lg xl:text-xl
                                        transition-all duration-300 disabled:opacity-50 shadow-lg lg:shadow-xl xl:shadow-2xl shadow-purple-500/30"
                        >
                            {hintLoading ? <Loader2 className="w-5 h-5 lg:w-6 lg:h-6 animate-spin" /> : <Sparkles className="w-5 h-5 lg:w-6 lg:h-6" />}
                            {hintLoading ? "Thinking..." : "Reveal Hint"}
                        </button>

                        {hint && (
                            <div className="p-4 lg:p-6 xl:p-8 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-2 border-purple-500/50 
                                            rounded-lg lg:rounded-xl xl:rounded-2xl text-purple-300 backdrop-blur-sm shadow-lg lg:shadow-xl shadow-purple-500/20">
                                <strong className="flex items-center gap-2 lg:gap-3 text-base lg:text-lg xl:text-xl mb-2 lg:mb-3">
                                    <HelpCircle className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" /> Hint
                                </strong>
                                <p className="text-sm lg:text-base xl:text-lg leading-relaxed">{hint}</p>
                            </div>
                        )}

                        {/* MCQ Options */}
                        {question.type === QuestionType.MCQ && question.options && (
                            <div className="space-y-4 lg:space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-base lg:text-lg xl:text-xl font-bold mb-3 lg:mb-4">Select your answer:</h3>
                                    {!isCorrectlyCompleted && (
                                        <button
                                            onClick={handleReset}
                                            className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4" /> Reset
                                        </button>
                                    )}
                                </div>
                                
                                {question.options.map((opt, i) => (
                                    <label
                                        key={i}
                                        className={`block p-4 lg:p-5 xl:p-7 rounded-lg lg:rounded-xl xl:rounded-2xl border-2 cursor-pointer transition-all duration-300
                                            group relative overflow-hidden backdrop-blur-sm shadow-md lg:shadow-lg
                                            ${userProgress?.isCorrect === true && selectedOption === i
                                                ? "border-green-500 bg-green-500/20 shadow-green-500/40"
                                                : userProgress?.isCorrect === false && selectedOption === i
                                                ? "border-red-500 bg-red-500/20 shadow-red-500/40"
                                                : selectedOption === i
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/40"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="option"
                                            className="hidden"
                                            checked={selectedOption === i}
                                            onChange={() => {
                                                // Allow changing if not correctly completed
                                                if (!isCorrectlyCompleted) {
                                                    setSelectedOption(i)
                                                    setShowResult(false)
                                                }
                                            }}
                                            disabled={isCorrectlyCompleted}
                                        />
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm lg:text-base xl:text-lg font-medium line-clamp-1">{opt}</span>
                                            {userProgress && selectedOption === i && (
                                                userProgress.isCorrect ? 
                                                    <CheckCircle className="text-green-400 w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" /> :
                                                    <XCircle className="text-red-400 w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
                                            )}
                                        </div>
                                    </label>
                                ))}

                                <button
                                    onClick={handleMCQSubmit}
                                    disabled={selectedOption === null || submitLoading || isCorrectlyCompleted}
                                    className="w-full py-3 lg:py-4 xl:py-5 rounded-lg lg:rounded-xl xl:rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 
                                                hover:from-green-700 hover:to-blue-700 font-bold text-base lg:text-lg xl:text-xl 
                                                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg lg:shadow-xl xl:shadow-2xl shadow-green-500/40
                                                flex items-center justify-center gap-2 lg:gap-3 xl:gap-4"
                                >
                                    {submitLoading ? (
                                        <Loader2 className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 animate-spin" />
                                    ) : isCorrectlyCompleted ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                                            Completed (+{pointsEarned} pts)
                                        </>
                                    ) : userProgress && !userProgress.isCorrect ? (
                                        <>
                                            <XCircle className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                                            Submit Again
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                                            Submit Answer
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Test Cases */}
                        {question.type === QuestionType.CODING && question.testCases && (
                            <div className="space-y-4 lg:space-y-6">
                                <h3 className="text-base lg:text-lg xl:text-xl font-bold flex items-center gap-2 lg:gap-3">
                                    <Code2 className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" /> Test Cases
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 xl:gap-5">
                                    {question.testCases.map((tc, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveTestCase(i)}
                                        className={`p-3 lg:p-4 xl:p-6 rounded-lg lg:rounded-xl xl:rounded-2xl border-2 cursor-pointer transition-all duration-300
                                        ${activeTestCase === i 
                                            ? "border-green-500 bg-green-500/10 shadow-lg lg:shadow-xl shadow-green-500/30" 
                                            : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/30"}`}
                                    >
                                        <strong className="text-sm lg:text-base xl:text-lg block mb-2 lg:mb-3">Case {i + 1}</strong>
                                        <pre className="text-xs bg-black/40 p-2 lg:p-3 xl:p-4 rounded-lg font-mono overflow-x-auto">
                                            <div><span className="text-gray-500">Input:</span> {tc.input || "<empty>"}</div>
                                            <div className="mt-1 lg:mt-2"><span className="text-gray-500">Expected:</span> {tc.expectedOutput || "<empty>"}</div>
                                        </pre>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Monaco Editor */}
                    {question.type === QuestionType.CODING && (
                        <div className="flex flex-col space-y-6 lg:space-y-8">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-4">
                                <h3 className="text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold flex items-center gap-2 lg:gap-3">
                                    <Code2 className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" /> Your Solution
                                </h3>
                                <div className="flex flex-wrap gap-2 lg:gap-3 xl:gap-4 w-full lg:w-auto">
                                    {!isCorrectlyCompleted && (
                                        <button
                                            onClick={handleReset}
                                            className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 xl:px-6 py-2 lg:py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg lg:rounded-xl transition-colors text-xs lg:text-sm"
                                        >
                                            <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" /> Reset Code
                                        </button>
                                    )}
                                    <button
                                        onClick={handleCodeSubmit}
                                        disabled={submitLoading || isCorrectlyCompleted}
                                        className="flex items-center gap-2 lg:gap-3 xl:gap-4 bg-gradient-to-r from-green-600 to-blue-600 
                                                    hover:from-green-700 hover:to-blue-700 px-4 lg:px-6 xl:px-8 2xl:px-10 py-2.5 lg:py-3 xl:py-4 2xl:py-5 rounded-lg lg:rounded-xl xl:rounded-2xl font-bold text-sm lg:text-base xl:text-lg
                                                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg lg:shadow-xl xl:shadow-2xl shadow-green-500/50"
                                    >
                                        {submitLoading ? (
                                            <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 animate-spin" />
                                        ) : isCorrectlyCompleted ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                                                Completed
                                            </>
                                        ) : userProgress && !userProgress.isCorrect ? (
                                            <>
                                                <XCircle className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                                                Submit Again
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                                                Run & Submit
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-lg lg:rounded-xl xl:rounded-2xl overflow-hidden border-2 lg:border-3 xl:border-4 border-gray-800 shadow-lg lg:shadow-xl xl:shadow-2xl">
                                <Editor
                                    height="400px"
                                    language={getMonacoLanguage(question.language.name)}
                                    value={code}
                                    onChange={(value) => {
                                        // Allow editing if not correctly completed
                                        if (!isCorrectlyCompleted) {
                                            setCode(value);
                                            setShowResult(false);
                                        }
                                    }}
                                    theme="vs-dark"
                                    options={{
                                        fontSize: 14,
                                        fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                                        lineHeight: 22,
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        wordWrap: "on",
                                        automaticLayout: true,
                                        cursorBlinking: "smooth",
                                        cursorSmoothCaretAnimation: "on",
                                        folding: true,
                                        lineNumbers: "on",
                                        renderWhitespace: "selection",
                                        smoothScrolling: true,
                                        formatOnPaste: true,
                                        formatOnType: true,
                                        bracketPairColorization: { enabled: true },
                                        readOnly: isCorrectlyCompleted
                                    }}
                                />
                            </div>

                            {showResult && (
                                <div className={`p-4 lg:p-6 xl:p-8 rounded-lg lg:rounded-xl xl:rounded-2xl text-center text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold animate-pulse border-2 lg:border-3 xl:border-4
                                    ${isCorrect 
                                    ? "bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-green-500 text-green-400 shadow-lg lg:shadow-xl xl:shadow-2xl shadow-green-500/50" 
                                    : "bg-gradient-to-r from-red-600/30 to-rose-600/30 border-red-500 text-red-400 shadow-lg lg:shadow-xl xl:shadow-2xl shadow-red-500/50"}`}
                                >
                                    {isCorrect 
                                    ? "All Tests Passed! You're a genius!" 
                                    : "Some tests failed — keep coding!"}
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
