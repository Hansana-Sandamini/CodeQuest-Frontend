import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { fetchQuestionsByLanguage, clearQuestionsAction, createQuestion, updateQuestion, deleteQuestion } from "../../features/questions/questionActions"
import { ArrowLeft, Plus, Edit2, Trash2, Globe, X, Save, Code2 } from "lucide-react"
import swal from "../../utils/swal"
import type { Question } from "../../types/Question"
import { fetchLanguages } from "../../features/languages/languageActions"
import { questionApi } from "../../api/question"

export default function QuestionsByLanguage() {
    const { languageId } = useParams<{ languageId: string }>()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { questions = [], loading } = useAppSelector((state) => state.questions)
    const languages = useAppSelector((state) => state.languages.items)
    const language = languages.find((l) => l._id === languageId)

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
                confirmButton: "px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg transition-all",
                cancelButton: "px-8 py-3 rounded-xl font-semibold text-white bg-gray-700 hover:bg-gray-600 mr-4 transition-all",
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
            <div className="flex items-center justify-center min-h-screen text-3xl text-red-400">
                Language not found
            </div>
        )
    }

    return (
        <div className="ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-20 px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate("/admin/languages")}
                        className="flex items-center gap-3 text-gray-400 hover:text-white mb-8 transition-all hover:-translate-x-2"
                    >
                        <ArrowLeft size={28} />
                        <span className="text-lg">Back to Languages</span>
                    </button>

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        <div className="flex items-center gap-8">
                            {language.iconUrl ? (
                                <img src={language.iconUrl} alt={language.name} className="w-24 h-24 rounded-3xl shadow-2xl border-4 border-gray-800 object-cover" />
                            ) : (
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                    <Globe size={48} className="text-white/30" />
                                </div>
                            )}

                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                    {language.name}
                                </h1>
                                <p className="text-2xl text-gray-400 mt-3">
                                    {questions.length} question{questions.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => openModal()}
                            className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                        >
                            <Plus size={32} />
                            Add New Question
                        </button>
                    </div>
                </div>

                {/* Questions Grid */}
                {loading ? (
                    <div className="text-center py-32">
                        <div className="text-3xl text-gray-400 animate-pulse">Loading questions...</div>
                    </div>
                ) : questions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {questions.map((q) => (
                        <div
                            key={q._id}
                            className="group relative bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl overflow-hidden shadow-2xl hover:shadow-green-500/30 transition-all duration-500 hover:-translate-y-4"
                        >
                            <div className="absolute top-4 left-4 z-10">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                    q.difficulty === "EASY" ? "bg-green-500/20 text-green-400 border border-green-500/40" :
                                    q.difficulty === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40" :
                                    "bg-red-500/20 text-red-400 border border-red-500/40"
                                }`}>
                                    {q.difficulty}
                                </span>
                            </div>
                            <div className="absolute top-4 right-4 z-10">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${q.type === "MCQ" ? "bg-purple-500/20 text-purple-400 border border-purple-500/40" : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"}`}>
                                    {q.type === "CODING" && <Code2 className="inline mr-1" size={16} />}
                                    {q.type}
                                </span>
                            </div>

                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2">{q.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-8">{q.description || "No description"}</p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => openModal(q)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-4 rounded-xl font-bold transition-all shadow-lg"
                                    >
                                        <Edit2 size={20} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(q._id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 py-4 rounded-xl font-bold transition-all shadow-lg"
                                    >
                                        <Trash2 size={20} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-32">
                        <div className="text-7xl mb-8 text-gray-700">?</div>
                        <h3 className="text-4xl font-bold text-gray-500 mb-4">No questions yet</h3>
                        <p className="text-xl text-gray-400">
                            Be the first to add a question for <span className="text-green-400 font-bold">{language.name}</span>!
                        </p>
                    </div>
                )}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl shadow-2xl max-w-4xl w-full my-8 p-10 relative max-h-screen overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
                        >
                            <X size={32} />
                        </button>

                        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-10">
                            {editingQuestion ? "Edit" : "Add New"} Question — {language.name}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div>
                                <label className="block text-lg font-medium text-gray-300 mb-3">Title <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. What is hoisting in JavaScript?"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-300 mb-3">Description (optional)</label>
                                <textarea
                                    rows={5}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-6 py-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-lg font-medium text-gray-300 mb-3">Type</label>
                                    <select
                                        value={form.type}
                                        onChange={(e) => {
                                            const type = e.target.value as "MCQ" | "CODING"
                                            setForm({
                                            ...form,
                                            type,
                                            options: type === "MCQ" ? form.options : [""],
                                            testCases: type === "CODING" ? form.testCases : [],
                                            })
                                        }}
                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-6 py-4"
                                    >
                                        <option value="MCQ">Multiple Choice</option>
                                        <option value="CODING">Coding Challenge</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-300 mb-3">Difficulty</label>
                                    <select
                                        value={form.difficulty}
                                        onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-6 py-4"
                                    >
                                        <option value="EASY">Easy</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HARD">Hard</option>
                                    </select>
                                </div>
                            </div>

                            {/* MCQ Options */}
                            {form.type === "MCQ" && (
                                <div>
                                    <label className="block text-lg font-medium text-gray-300 mb-4">Options</label>
                                    {form.options.map((opt, i) => (
                                        <div key={i} className="flex gap-4 mb-4 items-center">
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => {
                                                    const opts = [...form.options]
                                                    opts[i] = e.target.value
                                                    setForm({ ...form, options: opts })
                                                }}
                                                className="flex-1 bg-gray-700/50 border border-gray-600 rounded-xl px-6 py-4"
                                                placeholder={`Option ${i + 1}`}
                                            />
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
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 size={24} />
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, options: [...form.options, ""] })}
                                        className="text-green-400 flex items-center gap-2 hover:underline"
                                    >
                                        <Plus size={24} /> Add Option
                                    </button>

                                    <div className="mt-6">
                                        <label className="block text-lg font-medium text-gray-300 mb-3">Correct Answer</label>
                                        <select
                                            value={form.correctAnswer}
                                            onChange={(e) => setForm({ ...form, correctAnswer: +e.target.value })}
                                            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-6 py-4"
                                        >
                                            {form.options.map((opt, i) => (
                                                <option key={i} value={i}>
                                                    {opt.trim() || `Option ${i + 1}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* CODING Test Cases */}
                            {form.type === "CODING" && (
                                <div>
                                    <label className="block text-lg font-medium text-gray-300 mb-4">
                                        Test Cases
                                    </label>
                                    {form.testCases.length === 0 && (
                                        <p className="text-gray-500 mb-4">No test cases yet. Add one below.</p>
                                    )}
                                    {form.testCases.map((tc, i) => (
                                        <div key={i} className="flex gap-4 mb-4 items-start">
                                            <div className="flex-1 grid grid-cols-2 gap-4">
                                                <textarea
                                                    value={tc.input}
                                                    onChange={(e) => {
                                                        const newCases = [...form.testCases]
                                                        newCases[i].input = e.target.value
                                                        setForm({ ...form, testCases: newCases })
                                                    }}
                                                    placeholder="Input"
                                                    className="bg-gray-700/50 border border-gray-600 rounded-xl px-6 py-4 resize-none"
                                                    rows={3}
                                                />
                                                <textarea
                                                    value={tc.expectedOutput}
                                                    onChange={(e) => {
                                                        const newCases = [...form.testCases]
                                                        newCases[i].expectedOutput = e.target.value
                                                        setForm({ ...form, testCases: newCases })
                                                    }}
                                                    placeholder="Expected Output"
                                                    className="bg-gray-700/50 border border-gray-600 rounded-xl px-6 py-4 resize-none"
                                                    rows={3}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, testCases: form.testCases.filter((_, idx) => idx !== i) })}
                                                className="text-red-400 hover:text-red-300 pt-2"
                                            >
                                                <Trash2 size={28} />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, testCases: [...form.testCases, { input: "", expectedOutput: "" }] })}
                                        className="text-green-400 flex items-center gap-2 hover:underline"
                                    >
                                        <Plus size={24} /> Add Test Case
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-6 pt-8">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="flex-1 py-4 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold text-lg transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !form.title.trim()}
                                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition transform hover:scale-105 disabled:opacity-50"
                                >
                                    <Save size={28} />
                                    {submitting ? "Saving..." : editingQuestion ? "Update" : "Create"} Question
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
