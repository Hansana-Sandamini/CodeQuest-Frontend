import { useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { fetchQuestionsByLanguage } from "../../features/questions/questionActions"
import { ArrowLeft, Code2, CheckSquare, ArrowRight } from "lucide-react"
import { type Question, Difficulty, QuestionType } from "../../types/Question"

export default function LanguageQuestions() {
    const { languageId } = useParams<{ languageId: string }>()
    const location = useLocation()
    const languageName = (location.state as { languageName?: string })?.languageName || "Language"

    const dispatch = useAppDispatch()
    const { questions, loading, error } = useAppSelector((state) => state.questions)

    useEffect(() => {
        if (languageId) {
            dispatch(fetchQuestionsByLanguage({ languageId }))
        }
    }, [dispatch, languageId])

    // Color for difficulty badge
    const getDifficultyClass = (difficulty: Difficulty) => {
        switch (difficulty) {
            case Difficulty.EASY:
                return "bg-green-500/20 text-green-400 border-green-500/50"
            case Difficulty.MEDIUM:
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
            case Difficulty.HARD:
                return "bg-red-500/20 text-red-400 border-red-500/50"
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/50"
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-2xl text-gray-400 animate-pulse">Loading questions...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-red-400 text-xl">Failed to load questions: {error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 to-black text-white py-20 px-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/languages"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Languages
                </Link>

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        {languageName} Quizzes
                    </h1>
                    <p className="text-xl text-gray-400">
                        {questions.length} challenge{questions.length !== 1 ? "s" : ""} available
                    </p>
                </div>

                {/* Empty State */}
                {questions.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="text-9xl mb-8 text-gray-800">Empty</div>
                        <p className="text-2xl text-gray-500">
                            No questions yet for <span className="text-green-400">{languageName}</span>
                        </p>
                    </div>
                ) : (
                    /* Questions Grid */
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {questions.map((q: Question, index) => (
                        <Link
                            key={q._id}
                            to={`/question/${q._id}`}
                            state={{ languageName, questionTitle: q.title }}
                            className="group block h-full"
                        >
                            <div className="h-full bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-7
                                            hover:border-green-500/50 hover:bg-gray-800/60 
                                            transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/10"
                            >
                                {/* Top: Index + Difficulty */}
                                <div className="flex justify-between items-center mb-5">
                                    <span className="text-gray-500 text-sm font-medium">#{index + 1}</span>

                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyClass(q.difficulty)}`}>
                                        {q.difficulty}
                                    </span>
                                </div>

                                {/* Type Icon + Label */}
                                <div className="flex items-center gap-2 text-gray-400 mb-4">
                                    {q.type === QuestionType.MCQ ? (
                                        <CheckSquare size={18} />
                                    ) : (
                                        <Code2 size={18} />
                                    )}
                                    <span className="text-sm">
                                        {q.type === QuestionType.MCQ ? "Multiple Choice" : "Coding Challenge"}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                                    {q.title}
                                </h3>

                                {/* Description (truncated) */}
                                <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                                    {q.description || "No description provided."}
                                </p>

                                {/* CTA */}
                                <div className="text-right">
                                    <span className="inline-flex items-center gap-2 text-green-400 font-medium group-hover:gap-4 transition-all">
                                        Start Challenge
                                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    </div>
                )}
            </div>
        </div>
    )
}
