import { useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { fetchQuestionsByLanguage } from "../../features/questions/questionActions"
import { ArrowLeft, Code2, CheckSquare, ArrowRight, CheckCircle, Clock } from "lucide-react"
import { type Question, Difficulty, QuestionType } from "../../types/Question"
import { progressApi } from "../../api/progress" 
import { useState } from "react"
import { usePagination } from "../../hooks/usePagination"
import SearchBar from "../../components/SearchBar"
import Pagination from "../../components/Pagination"

const LanguageQuestions = () => {
    const { languageId } = useParams<{ languageId: string }>()
    const location = useLocation()
    const languageName = (location.state as { languageName?: string })?.languageName || "Language"

    const dispatch = useAppDispatch()
    const { questions, loading, error } = useAppSelector((state) => state.questions)
    
    const [searchTerm, setSearchTerm] = useState("")
    const ITEMS_PER_PAGE = 3
    const [progressMap, setProgressMap] = useState<Map<string, any>>(new Map()) 
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
                const progressData = new Map<string, any>()
                
                progressList.forEach((p: any) => {
                    if (p.question && p.question._id) {
                        progressData.set(p.question._id, p)
                    }
                })
                
                setProgressMap(progressData)
            } catch (err) {
                console.error("Failed to fetch progress:", err)
            }
        }
        
        fetchUserProgress()
    }, [])

    const getQuestionStatus = (questionId: string) => {
        const progress = progressMap.get(questionId)
        
        if (!progress) {
            return 'not-attempted' 
        }
        if (progress.isCorrect && progress.status === 'COMPLETED') {
            return 'completed'
        }
        if (progress.attempts > 0) {
            return 'attempted' 
        }
        return 'not-attempted'
    }

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/10 border-green-500/50 hover:border-green-400/70 hover:shadow-green-500/20'
            case 'attempted':
                return 'bg-yellow-500/10 border-yellow-500/50 hover:border-yellow-400/70 hover:shadow-yellow-500/20'
            case 'not-attempted':
            default:
                return 'bg-gray-800/40 border-gray-700 hover:border-green-500/50 hover:bg-gray-800/60 hover:shadow-green-500/10'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 xl:w-4.5 xl:h-4.5 text-green-400" />
            case 'attempted':
                return <Clock className="w-3 h-3 lg:w-4 lg:h-4 xl:w-4.5 xl:h-4.5 text-yellow-400" />
            case 'not-attempted':
            default:
                return null
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return "Solved"
            case 'attempted':
                return "In Progress"
            case 'not-attempted':
            default:
                return "Start Challenge"
        }
    }

    const getTitleColorClass = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-300 group-hover:text-green-200'
            case 'attempted':
                return 'text-yellow-300 group-hover:text-yellow-200'
            case 'not-attempted':
            default:
                return 'text-white group-hover:text-green-400'
        }
    }

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
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
                <div className="text-xl lg:text-2xl text-gray-400 animate-pulse text-center">Loading questions...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
                <div className="text-red-400 text-lg lg:text-xl text-center">Failed to load questions: {error}</div>
            </div>
        )
    }

    return (
        <div className="lg:ml-64 lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 lg:py-16 xl:py-20 px-3 lg:px-6 xl:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/languages"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 lg:mb-8 transition-colors text-sm lg:text-base"
                >
                    <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                    Back to Languages
                </Link>

                {/* Header */}
                <div className="text-center mb-8 lg:mb-12 xl:mb-16 border-b border-gray-700 pb-4 lg:pb-6">
                    <h1 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-2 lg:mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        {languageName} Quizzes
                    </h1>
                    <p className="text-base lg:text-lg xl:text-xl text-gray-400">
                        {questions.length} challenge{questions.length !== 1 ? "s" : ""} available
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 lg:mb-8">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search questions by title or description..."
                        className="w-full"
                    />
                    <div className="mt-3 lg:mt-4 flex flex-wrap items-center justify-between text-gray-400 text-xs lg:text-sm xl:text-base">
                        <p>
                            Showing {paginatedQuestions.length} of {filteredQuestions.length} questions
                            {searchTerm && (
                                <span> for "<span className="text-green-400">{searchTerm}</span>"</span>
                            )}
                        </p>
                        {filteredQuestions.length > ITEMS_PER_PAGE && (
                            <p className="mt-1 lg:mt-0">Page {currentPage} of {totalPages}</p>
                        )}
                    </div>
                </div>
                
                {/* Empty State */}
                {paginatedQuestions.length === 0 ? (
                    <div className="text-center py-16 lg:py-24 xl:py-32 px-4">
                        <div className="text-4xl lg:text-6xl xl:text-8xl mb-4 lg:mb-6 xl:mb-8 text-gray-800">
                            {searchTerm ? "🔍" : "EMPTY"}
                        </div>
                        <p className="text-lg lg:text-xl xl:text-2xl text-gray-500">
                            {searchTerm ? "No matching questions found" : 
                                <span> No questions yet for "<span className="text-green-400">{languageName}</span>"</span>
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-4 lg:mt-6 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg lg:rounded-xl font-medium text-sm lg:text-base hover:from-green-700 hover:to-blue-700 transition"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    /* Questions Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 xl:gap-8">
                    {paginatedQuestions.map((q: Question, index) => {
                        const status = getQuestionStatus(q._id)
                        
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
                                <div className={`h-full backdrop-blur-sm border rounded-xl lg:rounded-2xl p-4 lg:p-5 xl:p-7
                                                transition-all duration-300 hover:-translate-y-1 lg:hover:-translate-y-2 hover:shadow-xl lg:hover:shadow-2xl
                                                ${getStatusClass(status)}`}
                                >
                                    {/* Top: Index + Difficulty */}
                                    <div className="flex justify-between items-center mb-3 lg:mb-4 xl:mb-5">
                                        <span className="text-gray-500 text-xs lg:text-sm font-medium">#{index + 1}</span>

                                        <span className={`px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-xs font-bold border ${getDifficultyClass(q.difficulty)}`}>
                                            {q.difficulty}
                                        </span>
                                    </div>

                                    {/* Type Icon + Label */}
                                    <div className="flex items-center gap-1 lg:gap-2 text-gray-400 mb-2 lg:mb-3 xl:mb-4">
                                        {q.type === QuestionType.MCQ ? (
                                            <CheckSquare className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
                                        ) : (
                                            <Code2 className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
                                        )}
                                        <span className="text-xs lg:text-sm">
                                            {q.type === QuestionType.MCQ ? "Multiple Choice" : "Coding Challenge"}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-base lg:text-lg xl:text-xl font-bold mb-2 lg:mb-3 transition-colors line-clamp-2
                                                    ${getTitleColorClass(status)}`}
                                    >
                                        {q.title}
                                    </h3>

                                    {/* Description (truncated) */}
                                    <p className="text-gray-400 text-xs lg:text-sm line-clamp-2 lg:line-clamp-3 mb-4 lg:mb-5 xl:mb-6">
                                        {q.description || "No description provided."}
                                    </p>

                                    {/* CTA */}
                                    <div className="text-right">
                                        {status !== 'not-attempted' ? (
                                            <span className="inline-flex items-center gap-1 lg:gap-2 font-medium text-xs lg:text-sm">
                                                {getStatusIcon(status)}
                                                {getStatusText(status)}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 lg:gap-2 text-blue-400 font-medium text-xs lg:text-sm group-hover:gap-2 lg:group-hover:gap-3 xl:group-hover:gap-4 transition-all">
                                                {getStatusText(status)}
                                                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 xl:w-4.5 xl:h-4.5 group-hover:translate-x-1 lg:group-hover:translate-x-2 transition-transform" />
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
                {paginatedQuestions.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        className="mt-6 lg:mt-8 xl:mt-10 2xl:mt-12"
                    />
                )}
            </div>
        </div>
    )
}

export default LanguageQuestions
