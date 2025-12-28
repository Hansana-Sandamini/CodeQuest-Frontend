import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { fetchQuestionsByLanguage, clearQuestionsAction, createQuestion, updateQuestion, deleteQuestion } from "../../features/questions/questionActions"
import { ArrowLeft, Plus, Edit2, Trash2, Globe, X, Save, Code2, CheckCircle } from "lucide-react"
import swal from "../../utils/swal"
import type { Question } from "../../types/Question"
import { fetchLanguages } from "../../features/languages/languageActions"
import { questionApi } from "../../api/question"
import { usePagination } from "../../hooks/usePagination"
import SearchBar from "../../components/SearchBar"
import Pagination from "../../components/Pagination"

const QuestionsByLanguage = () => {
    const { languageId } = useParams<{ languageId: string }>()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { questions = [], loading } = useAppSelector((state) => state.questions)
    const languages = useAppSelector((state) => state.languages.items)
    const language = languages.find((l) => l._id === languageId)

    const [searchTerm, setSearchTerm] = useState("")
    const ITEMS_PER_PAGE = 6
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

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const [form, setForm] = useState({
        title: "",
        description: "",
        type: "MCQ" as "MCQ" | "CODING",
        difficulty: "MEDIUM" as "EASY" | "MEDIUM" | "HARD",
        options: ["", "", "", ""],
        correctAnswer: 0,
        testCases: [] as { input: string; expectedOutput: string }[],
    })

    useEffect(() => {
        if (languageId) {
            dispatch(clearQuestionsAction())
            dispatch(fetchQuestionsByLanguage({ languageId }))
        }
        if (languages.length === 0) {
            dispatch(fetchLanguages())
        }
    }, [dispatch, languageId])

    const openModal = async (question?: Question) => {
        if (question) {
            setEditingQuestion(question)

            if (question.testCases && question.testCases.length > 0) {
                setForm({
                    title: question.title,
                    description: question.description || "",
                    type: question.type as "MCQ" | "CODING",
                    difficulty: question.difficulty,
                    options: question.options || ["", "", "", ""],
                    correctAnswer: question.correctAnswer ?? 0,
                    testCases: question.testCases || [],
                })

            } else {
                try {
                    const res = await questionApi.getOneForEdit(question._id)
                    const fullQuestion = res.data.data

                    setForm({
                        title: fullQuestion.title,
                        description: fullQuestion.description || "",
                        type: fullQuestion.type as "MCQ" | "CODING",
                        difficulty: fullQuestion.difficulty,
                        options: fullQuestion.options || ["", "", "", ""],
                        correctAnswer: fullQuestion.correctAnswer ?? 0,
                        testCases: fullQuestion.testCases || [],
                    })
                } catch (err) {
                    swal.fire("Error", "Could not load full question details", "error")
                    return
                }
            }

        } else {
            setEditingQuestion(null)
            setForm({
                title: "",
                description: "",
                type: "MCQ",
                difficulty: "MEDIUM",
                options: ["", "", "", ""],
                correctAnswer: 0,
                testCases: [],
            })
        }
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingQuestion(null)
        setSubmitting(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title.trim()) return

        const payload: any = {
            title: form.title.trim(),
            description: form.description.trim() || undefined,
            type: form.type,
            difficulty: form.difficulty,
            language: languageId,
        }

        if (form.type === "MCQ") {
            const filtered = form.options.map(o => o.trim()).filter(Boolean)
            if (filtered.length < 4) {
                swal.fire("Error", "Please provide at least 4 options", "error")
                return
            }
            payload.options = filtered
            payload.correctAnswer = form.correctAnswer
        } else if (form.type === "CODING") {
            const valid = form.testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim())
            if (valid.length === 0) {
                swal.fire("Error", "Add at least one test case", "error")
                return
            }
            payload.testCases = valid
        }

        setSubmitting(true)

        swal.fire({
            title: editingQuestion ? "Updating question..." : "Creating question...",
            allowOutsideClick: false,
            didOpen: () => swal.showLoading(),
        })

        try {
            if (editingQuestion) {
                await dispatch(updateQuestion({ id: editingQuestion._id, data: payload })).unwrap()
            } else {
                await dispatch(createQuestion(payload)).unwrap()
            }

            swal.close()
            await swal.fire({
                icon: "success",
                title: editingQuestion ? "Updated!" : "Created!",
                text: `"${form.title}" has been ${editingQuestion ? "updated" : "added"} successfully`,
                timer: 2000,
                showConfirmButton: false,
            })

            closeModal()
            dispatch(fetchQuestionsByLanguage({ languageId: languageId! }))

        } catch (err: any) {
            swal.close()
            await swal.fire({
                icon: "error",
                title: "Failed",
                text: err?.message || "Something went wrong",
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        const question = questions.find(q => q._id === id)

        const result = await swal.fire({
            icon: "warning",
            title: "Delete Question?",
            text: "This action cannot be undone.",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            customClass: {
                confirmButton: "px-4 lg:px-8 py-2 lg:py-3 rounded-lg lg:rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg transition-all",
                cancelButton: "px-4 lg:px-8 py-2 lg:py-3 rounded-lg lg:rounded-xl font-semibold text-white bg-gray-700 hover:bg-gray-600 mr-2 lg:mr-4 transition-all",
            },
            buttonsStyling: false,
        })

        if (!result.isConfirmed) return

        swal.fire({ title: "Deleting...", allowOutsideClick: false, didOpen: () => swal.showLoading() })

        try {
            await dispatch(deleteQuestion(id)).unwrap()
            swal.close()
            await swal.fire({
                icon: "success",
                title: "Deleted!",
                text: `"${question?.title}" has been removed permanently`,
                timer: 1800,
                showConfirmButton: false,
            })
            dispatch(fetchQuestionsByLanguage({ languageId: languageId! }))

        } catch {
            swal.close()
            await swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: "Could not delete the question. Please try again.",
            })
        }
    }

    if (!language) {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl lg:text-2xl xl:text-3xl text-red-400 px-4">
                Language not found
            </div>
        )
    }

    return (
        <div className="lg:ml-64 lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 lg:py-16 xl:py-20 px-3 lg:px-6 xl:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6 lg:mb-10 xl:mb-12 border-b border-gray-700 pb-4 lg:pb-6">
                    <button
                        onClick={() => navigate("/admin/languages")}
                        className="flex items-center gap-2 lg:gap-3 text-gray-400 hover:text-white mb-4 lg:mb-6 transition-all hover:-translate-x-1 lg:hover:-translate-x-2 text-sm lg:text-base"
                    >
                        <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                        <span>Back to Languages</span>
                    </button>

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 xl:gap-8">
                        <div className="flex items-center gap-4 lg:gap-6 xl:gap-8">
                            {language.iconUrl ? (
                                <img 
                                    src={language.iconUrl} 
                                    alt={language.name} 
                                    className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-xl lg:rounded-2xl xl:rounded-3xl shadow-lg lg:shadow-xl xl:shadow-2xl border-4 border-gray-800 object-cover" 
                                />
                            ) : (
                                <div className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-xl lg:rounded-2xl xl:rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                    <Globe className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-white/30" />
                                </div>
                            )}

                            <div>
                                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                    {language.name}
                                </h1>
                                <p className="text-lg lg:text-xl xl:text-2xl text-gray-400 mt-1 lg:mt-2 xl:mt-3">
                                    {questions.length} question{questions.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => openModal()}
                            className="flex items-center justify-center gap-2 lg:gap-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-4 lg:px-6 xl:px-8 py-2.5 lg:py-3 xl:py-4 rounded-lg lg:rounded-xl font-bold text-sm lg:text-base xl:text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 w-full lg:w-auto mt-4 lg:mt-0"
                        >
                            <Plus className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                            Add New Question
                        </button>
                    </div>
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
                
                {/* Questions Grid */}
                {loading ? (
                    <div className="text-center py-16 lg:py-24 xl:py-32">
                        <div className="text-xl lg:text-2xl xl:text-3xl text-gray-400 animate-pulse">Loading questions...</div>
                    </div>
                ) : paginatedQuestions.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
                            {paginatedQuestions.map((q) => (
                                <div
                                    key={q._id}
                                    className="group relative bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl lg:rounded-2xl xl:rounded-3xl overflow-hidden shadow-lg lg:shadow-xl xl:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 lg:hover:-translate-y-2 xl:hover:-translate-y-2"
                                >
                                    <div className="absolute top-2 lg:top-3 xl:top-4 left-2 lg:left-3 xl:left-4 z-10">
                                        <span className={`px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 xl:py-2 rounded-full text-xs lg:text-sm font-bold ${
                                            q.difficulty === "EASY" ? "bg-green-500/20 text-green-400 border border-green-500/40" :
                                            q.difficulty === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40" :
                                            "bg-red-500/20 text-red-400 border border-red-500/40"
                                        }`}>
                                            {q.difficulty}
                                        </span>
                                    </div>
                                    <div className="absolute top-2 lg:top-3 xl:top-4 right-2 lg:right-3 xl:right-4 z-10">
                                        <span className={`px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 xl:py-2 rounded-full text-xs lg:text-sm font-bold ${q.type === "MCQ" ? "bg-purple-500/20 text-purple-400 border border-purple-500/40" : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"}`}>
                                            {q.type === "CODING" && <Code2 className="inline mr-1 w-3 h-3 lg:w-4 lg:h-4" />}
                                            {q.type}
                                        </span>
                                    </div>

                                    <div className="p-4 lg:p-6 xl:p-8 mt-4">
                                        <h3 className="text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-white mb-2 lg:mb-3 xl:mb-4 line-clamp-2">{q.title}</h3>
                                        <p className="text-gray-400 text-xs lg:text-sm line-clamp-3 mb-4 lg:mb-6 xl:mb-8">{q.description || "No description"}</p>

                                        <div className="flex gap-2 lg:gap-3">
                                            <button
                                                onClick={() => openModal(q)}
                                                className="flex-1 flex items-center justify-center gap-1 lg:gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-1.5 lg:py-2 xl:py-2.5 rounded-lg lg:rounded-xl font-bold text-xs lg:text-sm xl:text-base transition-all shadow-lg"
                                            >
                                                <Edit2 className="w-3 h-3 lg:w-4 lg:h-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(q._id)}
                                                className="flex-1 flex items-center justify-center gap-1 lg:gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 py-1.5 lg:py-2 xl:py-2.5 rounded-lg lg:rounded-xl font-bold text-xs lg:text-sm xl:text-base transition-all shadow-lg"
                                            >
                                                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            className="mt-6 lg:mt-8 xl:mt-10 2xl:mt-12"
                        />
                    </>
                ) : (
                    <div className="text-center py-16 lg:py-24 xl:py-32">
                        <div className="text-4xl lg:text-6xl xl:text-7xl mb-4 lg:mb-6 xl:mb-8 text-gray-700">?</div>
                        <h3 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-500 mb-2 lg:mb-3 xl:mb-4">
                            {searchTerm ? "No matching questions found" : "No questions yet"}
                        </h3>
                        <p className="text-gray-400 text-sm lg:text-base xl:text-lg 2xl:text-xl">
                            {searchTerm ? "Try a different search term" :  
                                <>Be the first to add a question for <span className="text-green-400 font-bold">{language.name}</span>!</>
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
                )}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl lg:rounded-2xl shadow-2xl max-w-[95vw] lg:max-w-3xl w-full my-4 lg:my-8 p-6 lg:p-8 relative max-h-[95vh] overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 lg:top-6 right-4 lg:right-6 text-gray-400 hover:text-white transition z-10"
                        >
                            <X className="w-6 h-6 lg:w-7 lg:h-7" />
                        </button>

                        <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
                            {editingQuestion ? "Edit" : "Add New"} Question — <span className="text-white">{language.name}</span>
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Title & Description */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-base font-medium text-white mb-2">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full bg-gray-700/60 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                                        placeholder="e.g. What is hoisting in JavaScript?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-white mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="w-full bg-gray-700/60 border border-gray-600 rounded-lg px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                                        placeholder="Describe the question..."
                                    />
                                </div>
                            </div>

                            {/* Type & Difficulty */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-base font-medium text-white mb-2">Question Type</label>
                                    <select
                                        value={form.type}
                                        onChange={(e) => {
                                            const type = e.target.value as "MCQ" | "CODING"
                                            setForm({
                                                ...form,
                                                type,
                                                options: type === "MCQ" ? ["", "", "", ""] : [""],
                                                testCases: type === "CODING" ? [] : [],
                                            })
                                        }}
                                        className="w-full bg-gray-700/60 border border-gray-600 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="MCQ">📝 Multiple Choice</option>
                                        <option value="CODING">💻 Coding Challenge</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-white mb-2">Difficulty Level</label>
                                    <select
                                        value={form.difficulty}
                                        onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
                                        className="w-full bg-gray-700/60 border border-gray-600 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="EASY" className="text-green-400">🟢 Easy</option>
                                        <option value="MEDIUM" className="text-yellow-400">🟡 Medium</option>
                                        <option value="HARD" className="text-red-400">🔴 Hard</option>
                                    </select>
                                </div>
                            </div>

                            {/* MCQ Options */}
                            {form.type === "MCQ" && (
                                <div className="space-y-4 bg-gray-800/30 rounded-xl p-5 border border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-lg font-semibold text-white">
                                            Multiple Choice Options
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, options: [...form.options, ""] })}
                                            className="text-green-400 hover:text-green-300 flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-green-500/10 rounded-lg"
                                        >
                                            <Plus className="w-4 h-4" /> Add Option
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {form.options.map((opt, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                                                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${form.correctAnswer === i ? 'bg-green-500/20 text-green-400' : 'bg-gray-700'} font-bold`}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => {
                                                        const opts = [...form.options]
                                                        opts[i] = e.target.value
                                                        setForm({ ...form, options: opts })
                                                    }}
                                                    className="flex-1 bg-transparent border-none focus:outline-none text-white text-base"
                                                    placeholder={`Enter option ${i + 1}...`}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setForm({ ...form, correctAnswer: i })}
                                                        className={`p-1.5 rounded-full ${form.correctAnswer === i ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500'}`}
                                                        title="Mark as correct"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    {form.options.length > 2 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newOpts = form.options.filter((_, idx) => idx !== i)
                                                                setForm({
                                                                    ...form,
                                                                    options: newOpts,
                                                                    correctAnswer: form.correctAnswer >= i ? form.correctAnswer - 1 : form.correctAnswer,
                                                                })
                                                            }}
                                                            className="p-1.5 text-red-400 hover:text-red-300"
                                                            title="Remove option"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-3 border-t border-gray-700">
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            <span>Selected correct answer: <span className="font-bold text-white">{String.fromCharCode(65 + form.correctAnswer)}</span></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CODING Test Cases */}
                            {form.type === "CODING" && (
                                <div className="space-y-4 bg-gray-800/30 rounded-xl p-5 border border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-lg font-semibold text-white">
                                            Test Cases
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, testCases: [...form.testCases, { input: "", expectedOutput: "" }] })}
                                            className="text-green-400 hover:text-green-300 flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-green-500/10 rounded-lg"
                                        >
                                            <Plus className="w-4 h-4" /> Add Test Case
                                        </button>
                                    </div>

                                    {form.testCases.length === 0 && (
                                        <div className="text-center py-6 text-gray-400 bg-gray-800/20 rounded-lg">
                                            <Code2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No test cases yet. Add at least one for validation.</p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {form.testCases.map((tc, i) => (
                                            <div key={i} className="bg-gray-700/30 rounded-lg p-4 space-y-3 border border-gray-600">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-300">Test Case #{i + 1}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setForm({ ...form, testCases: form.testCases.filter((_, idx) => idx !== i) })}
                                                        className="text-red-400 hover:text-red-300 p-1"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-1">Input</label>
                                                        <textarea
                                                            value={tc.input}
                                                            onChange={(e) => {
                                                                const newCases = [...form.testCases]
                                                                newCases[i].input = e.target.value
                                                                setForm({ ...form, testCases: newCases })
                                                            }}
                                                            placeholder="e.g. [1,2,3] or 'hello'"
                                                            className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm text-gray-400 mb-1">Expected Output</label>
                                                        <textarea
                                                            value={tc.expectedOutput}
                                                            onChange={(e) => {
                                                                const newCases = [...form.testCases]
                                                                newCases[i].expectedOutput = e.target.value
                                                                setForm({ ...form, testCases: newCases })
                                                            }}
                                                            placeholder="e.g. 6 or 'HELLO'"
                                                            className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 font-semibold text-base transition-all duration-200 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !form.title.trim()}
                                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <Save className="w-5 h-5" />
                                    {submitting ? "Saving..." : editingQuestion ? "Update Question" : "Create Question"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuestionsByLanguage
