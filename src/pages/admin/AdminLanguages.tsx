import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" 
import { useAppSelector, useAppDispatch } from "../../hooks/redux"
import type { ILanguage } from "../../types/Language"
import { Globe, Plus, Edit2, Trash2, X, Upload } from "lucide-react"
import { fetchLanguages, createLang, updateLang, deleteLang } from "../../features/languages/languageActions"
import swal from "../../utils/swal"  
import { usePagination } from "../../hooks/usePagination"
import { SearchBar } from "../../components/SearchBar"
import { Pagination } from "../../components/Pagination"

export default function LanguagesAdmin() {
    const navigate = useNavigate() 
    const dispatch = useAppDispatch()
    const { items: languages, loading, error } = useAppSelector((state) => state.languages)

    const [searchTerm, setSearchTerm] = useState("")
    const ITEMS_PER_PAGE = 4
    const {
        currentPage,
        setCurrentPage,
        filteredData: filteredLanguages,
        paginatedData: paginatedLanguages,
        totalPages,
    } = usePagination<ILanguage>({
        data: languages,
        itemsPerPage: ITEMS_PER_PAGE,
        searchTerm,
        searchFields: ['name', 'description'],
    })
    
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingLang, setEditingLang] = useState<ILanguage | null>(null)
    const [form, setForm] = useState({
        name: "",
        description: "",
        icon: null as File | null,
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        dispatch(fetchLanguages())
    }, [dispatch])

    const openModal = (lang?: ILanguage) => {
        if (lang) {
            setEditingLang(lang)
            setForm({
                name: lang.name,
                description: lang.description || "",
                icon: null,
            })
        } else {
            setEditingLang(null)
            setForm({ name: "", description: "", icon: null })
        }
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingLang(null)
        setForm({ name: "", description: "", icon: null })
        setSubmitting(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) return

        const formData = new FormData()
        formData.append("name", form.name.trim())
        if (form.description.trim()) formData.append("description", form.description.trim())
        if (form.icon) formData.append("icon", form.icon)

        setSubmitting(true)

        swal.fire({
            title: editingLang ? "Updating language..." : "Creating language...",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => swal.showLoading(),
        })

        try {
            if (editingLang) {
                await dispatch(updateLang({ id: editingLang._id, data: formData })).unwrap()
            } else {
                await dispatch(createLang(formData)).unwrap()
            }

            swal.close()

            await swal.fire({
                icon: "success",
                title: editingLang ? "Updated!" : "Created!",
                text: editingLang
                    ? `"${form.name}" has been updated successfully`
                    : `"${form.name}" has been added successfully`,
                timer: 2000,
                showConfirmButton: false,
            })

            closeModal()
        } catch (err: any) {
            swal.close()
            await swal.fire({
                icon: "error",
                title: "Operation Failed",
                text: err?.message || "Something went wrong. Please try again.",
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        const lang = languages.find((l) => l._id === id)

        const result = await swal.fire({
            icon: "warning",
            title: "Delete Language?",
            text: `This will permanently delete "${lang?.name}" and all its questions!`,
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

        swal.fire({
            title: "Deleting...",
            allowOutsideClick: false,
            didOpen: () => swal.showLoading(),
        })

        try {
            await dispatch(deleteLang(id)).unwrap()
            swal.close()
            await swal.fire({
                icon: "success",
                title: "Deleted!",
                text: `"${lang?.name}" has been removed permanently`,
                timer: 1800,
                showConfirmButton: false,
            })
        } catch {
            swal.close()
            await swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: "Could not delete the language. Please try again.",
            })
        }
    }

    const previewUrl = form.icon ? URL.createObjectURL(form.icon) : editingLang?.iconUrl

    // Loading State
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
                <div className="text-2xl text-gray-400 animate-pulse">Loading languages...</div>
            </div>
        )
    }

    // Error State
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black gap-6">
                <p className="text-red-400 text-xl">Failed to load languages</p>
                <button
                    onClick={() => dispatch(fetchLanguages())}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition transform hover:scale-105"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-20 px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-gray-700 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            Manage Languages
                        </h1>
                        <p className="text-gray-400 mt-3 text-lg">
                            Create and organize programming languages for quizzes
                        </p>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                        <Plus size={28} />
                        Add New Language
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search languages by name or description..."
                    />
                    <div className="mt-4 flex flex-wrap items-center justify-between text-gray-400">
                        <p>
                            Showing {paginatedLanguages.length} of {filteredLanguages.length} languages
                            {searchTerm && (
                                <span> for "<span className="text-green-400">{searchTerm}</span>"</span>
                            )}
                        </p>
                        {filteredLanguages.length > ITEMS_PER_PAGE && (
                            <p>Page {currentPage} of {totalPages}</p>
                        )}
                    </div>
                </div>

                {/* Languages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {paginatedLanguages.length > 0 ? (  
                        paginatedLanguages.map((lang) => ( 
                            <div
                                key={lang._id}
                                className="group relative bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl overflow-hidden shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-3 cursor-pointer"
                                onClick={() => navigate(`/admin/languages/${lang._id}/questions`)}  // ← CLICK GOES TO QUESTIONS
                            >
                                <div className="h-48 relative overflow-hidden bg-gray-900">
                                    {lang.iconUrl ? (
                                        <img
                                            src={lang.iconUrl}
                                            alt={lang.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                            <Globe size={80} className="text-white/20" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3">
                                        <span className="bg-green-500/20 backdrop-blur-sm text-green-400 px-4 py-1.5 rounded-full text-sm font-medium border border-green-500/30">
                                            {lang.questionCount} {lang.questionCount === 1 ? "question" : "questions"}
                                        </span>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="text-center">
                                            <Globe size={48} className="mx-auto text-green-400 mb-3" />
                                            <p className="text-xl font-bold text-white">Manage Questions</p>
                                            <p className="text-sm text-gray-300">
                                                {lang.questionCount} {lang.questionCount === 1 ? "question" : "questions"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6" onClick={(e) => e.stopPropagation()}>
                                    <h3 className="text-2xl font-bold text-white mb-2">{lang.name}</h3>
                                    {lang.description && (
                                        <p className="text-gray-400 text-sm line-clamp-2 mb-5">{lang.description}</p>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => openModal(lang)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-xl font-medium transition"
                                        >
                                            <Edit2 size={18} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(lang._id)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 py-3 rounded-xl font-medium transition"
                                        >
                                            <Trash2 size={18} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <Globe size={100} className="mx-auto text-gray-600 mb-6" />
                            <h3 className="text-3xl font-bold text-gray-500 mb-3">
                                {searchTerm ? "No matching languages found" : "No languages yet"}
                            </h3>
                            <p className="text-gray-400 text-lg">
                                {searchTerm ? "Try a different search term" : 'Click "Add New Language" to create your first one!'}
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
                    )}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-12"
                />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl shadow-2xl max-w-2xl w-full p-10 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
                        >
                            <X size={28} />
                        </button>

                        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-8">
                            {editingLang ? "Edit Language" : "Create New Language"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label className="block text-lg font-medium text-gray-300 mb-3">
                                    Language Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                    placeholder="e.g. JavaScript, Python, Rust..."
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-300 mb-3">
                                    Description (optional)
                                </label>
                                <textarea
                                    rows={4}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-6 py-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                    placeholder="Brief description of the language..."
                                />
                            </div>

                            <div>
                                <label className="text-lg font-medium text-gray-300 mb-4 flex items-center gap-3">
                                    <Upload size={24} />
                                    Language Icon
                                </label>

                                {previewUrl && (
                                    <div className="mb-6 text-center">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-32 w-32 object-cover rounded-2xl shadow-2xl mx-auto border-4 border-gray-700"
                                        />
                                        <p className="text-sm text-gray-500 mt-3">
                                            {form.icon ? "New icon selected" : "Current icon"}
                                        </p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setForm({ ...form, icon: e.target.files?.[0] || null })}
                                    className="block w-full text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-green-600 file:to-blue-600 file:text-white file:font-bold hover:file:from-green-700 hover:file:to-blue-700 cursor-pointer"
                                />
                            </div>

                            <div className="flex gap-6 pt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="flex-1 py-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg transition-all duration-200 disabled:bg-gray-700/70 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !form.name.trim()}
                                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-green-500/25 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? "Saving..." : editingLang ? "Update Language" : "Create Language"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
