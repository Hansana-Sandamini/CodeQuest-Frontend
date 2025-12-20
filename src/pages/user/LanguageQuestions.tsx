import { useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { fetchQuestionsByLanguage } from "../../features/questions/questionActions"
import { ArrowLeft, Code2, CheckSquare, ArrowRight, CheckCircle } from "lucide-react"
import { type Question, Difficulty, QuestionType } from "../../types/Question"
import { progressApi } from "../../api/progress" 
import { useState } from "react"
import { usePagination } from "../../hooks/usePagination"
import { SearchBar } from "../../components/SearchBar"
import { Pagination } from "../../components/Pagination"

export default function LanguageQuestions() {
    const { languageId } = useParams<{ languageId: string }>()
    const location = useLocation()
    const languageName = (location.state as { languageName?: string })?.languageName || "Language"

    const dispatch = useAppDispatch()
    const { questions, loading, error } = useAppSelector((state) => state.questions)
    
    const [searchTerm, setSearchTerm] = useState("")
    const ITEMS_PER_PAGE = 3
    const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set())
    const {
        currentPage,
        setCurrentPage,
        filteredData: filteredQuestions,
        paginatedData: paginatedQuestions,
        totalPages,
    } = usePagination<Question>({
        data: questions,
        itemsPerPage: ITEMS_PER_PAGE,
        searchTerm,
        searchFields: ['title', 'description'],
    })
    
    useEffect(() => {
        if (languageId) {
            dispatch(fetchQuestionsByLanguage({ languageId }))
        }
    }, [dispatch, languageId])

    useEffect(() => {
        const fetchUserProgress = async () => {
            try {
                const progressList = await progressApi.getAll()
                const completedSet = new Set<string>()
                
                progressList.forEach((p: any) => {
                    if (p.status === 'COMPLETED' && p.isCorrect) {
                        completedSet.add(p.question._id)
                    }
                })
                
                setCompletedQuestions(completedSet)
            } catch (err) {
                console.error("Failed to fetch progress:", err)
            }
        }
        
        fetchUserProgress()
    }, []) 

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
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-2xl text-gray-400 animate-pulse">Loading questions...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-red-400 text-xl">Failed to load questions: {error}</div>
            </div>
        )
    }

    return (
        <div className="ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-20 px-8">
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
                <div className="text-center mb-16  border-b border-gray-700 pb-6">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        {languageName} Quizzes
                    </h1>
                    <p className="text-xl text-gray-400">
                        {questions.length} challenge{questions.length !== 1 ? "s" : ""} available
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search questions by title or description..."
                    />
                    <div className="mt-4 flex flex-wrap items-center justify-between text-gray-400">
                        <p>
                            Showing {paginatedQuestions.length} of {filteredQuestions.length} questions
                            {searchTerm && (
                                <span> for "<span className="text-green-400">{searchTerm}</span>"</span>
                            )}
                        </p>
                        {filteredQuestions.length > ITEMS_PER_PAGE && (
                            <p>Page {currentPage} of {totalPages}</p>
                        )}
                    </div>
                </div>
                
                {/* Empty State */}
                {paginatedQuestions.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="text-8xl mb-8 text-gray-800">
                            {searchTerm ? "🔍" : "EMPTY"}
                        </div>
                        <p className="text-2xl text-gray-500">
                            {searchTerm ? "No matching questions found" : 
                                <span> No questions yet for "<span className="text-green-400">{languageName}</span>"</span>
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    /* Questions Grid */
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {paginatedQuestions.map((q: Question, index) => {
                        const isCompleted = completedQuestions.has(q._id)
                        
                        return (
                            <Link
                                key={q._id}
                                to={`/question/${q._id}`}
                                state={{ 
                                    languageName, 
                                    questionTitle: q.title,
                                    questions 
                                }}
                                className="group block h-full"
                            >
                                <div className={`h-full backdrop-blur-sm border rounded-2xl p-7
                                                transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                                                ${isCompleted 
                                                    ? 'bg-green-500/10 border-green-500/50 hover:border-green-400/70 hover:shadow-green-500/20' 
                                                    : 'bg-gray-800/40 border-gray-700 hover:border-green-500/50 hover:bg-gray-800/60 hover:shadow-green-500/10'
                                                }`}
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
                                    <h3 className={`text-xl font-bold mb-3 transition-colors
                                                    ${isCompleted 
                                                        ? 'text-green-300 group-hover:text-green-200' 
                                                        : 'text-white group-hover:text-green-400'
                                                    }`}
                                    >
                                        {q.title}
                                    </h3>

                                    {/* Description (truncated) */}
                                    <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                                        {q.description || "No description provided."}
                                    </p>

                                    {/* CTA */}
                                    <div className="text-right">
                                        {isCompleted ? (
                                            <span className="inline-flex items-center gap-2 text-green-400 font-medium">
                                                <CheckCircle size={18} className="text-green-400" />
                                                Solved
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 text-green-400 font-medium group-hover:gap-4 transition-all">
                                                Start Challenge
                                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                    </div>
                )}

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-12"
                />
            </div>
        </div>
    )
}
