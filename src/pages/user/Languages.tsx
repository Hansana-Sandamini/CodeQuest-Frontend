import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { fetchLanguages } from "../../features/languages/languageActions"
import { CheckCircle2, Globe } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { usePagination } from "../../hooks/usePagination"
import SearchBar from "../../components/SearchBar"
import Pagination from "../../components/Pagination"

const Languages = () => {
    const dispatch = useAppDispatch()
    const { items: languages, loading, error } = useAppSelector((state) => state.languages)
    const navigate = useNavigate() 
    
    // Get user certificates from auth state
    const { user } = useAppSelector((state) => state.auth)

    const [searchTerm, setSearchTerm] = useState("")
    const ITEMS_PER_PAGE = 5
        const {
        currentPage,
        setCurrentPage,
        filteredData: filteredLanguages,
        paginatedData: paginatedLanguages,
        totalPages,
    } = usePagination({
        data: languages,
        itemsPerPage: ITEMS_PER_PAGE,
        searchTerm,
        searchFields: ['name', 'description'],
    })
    
    useEffect(() => {
        dispatch(fetchLanguages()) 
    }, [dispatch])

    // Extract completed language IDs from user's certificates
    const completedLanguageIds = user?.certificates?.map((cert: any) => {
        if (typeof cert.language === "string") return cert.language
        if (cert.language?._id) return cert.language._id
        if (cert.languageId) return cert.languageId
        return null
    }).filter(Boolean) || []

    const isCompleted = (languageId: string) => completedLanguageIds.includes(languageId)

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
                <div className="text-xl lg:text-2xl text-gray-400 animate-pulse">Loading languages...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
                <div className="text-red-400 text-lg lg:text-xl text-center">Failed to load languages</div>
            </div>
        )
    }

    return (
        <div className="lg:ml-64 lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 lg:py-16 xl:py-20 px-3 lg:px-6 xl:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 lg:mb-12 xl:mb-16 border-b border-gray-700 pb-4 lg:pb-6">
                    <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 lg:mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        Choose Your Language
                    </h1>
                    <p className="text-base lg:text-lg xl:text-xl text-gray-400">Master coding with interactive quizzes</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 lg:mb-8">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search languages by name or description..."
                        className="w-full"
                    />
                    <div className="mt-3 lg:mt-4 flex flex-wrap items-center justify-between text-gray-400 text-xs lg:text-sm xl:text-base">
                        <p>
                            Showing {paginatedLanguages.length} of {filteredLanguages.length} languages
                            {searchTerm && (
                                <span> for "<span className="text-green-400">{searchTerm}</span>"</span>
                            )}
                        </p>
                        {filteredLanguages.length > ITEMS_PER_PAGE && (
                            <p className="mt-1 lg:mt-0">Page {currentPage} of {totalPages}</p>
                        )}
                    </div>
                </div>

                {/* Languages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 xl:gap-8">
                    {paginatedLanguages.map((lang) => {
                        const completed = isCompleted(lang._id)

                        return (
                            <div
                                key={lang._id}
                                onClick={() =>
                                    navigate(`/languages/${lang._id}`, {
                                        state: { languageName: lang.name },
                                    })
                                }
                                className={`
                                    group relative rounded-2xl lg:rounded-3xl overflow-hidden
                                    shadow-xl transition-all duration-500 cursor-pointer
                                    hover:-translate-y-4 hover:shadow-2xl
                                    ${
                                        completed
                                        ? "bg-gradient-to-br from-green-950/70 to-emerald-950/50 border-2 border-green-500/80"
                                        : "bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-green-600/60"
                                    }
                                `}
                            >
                                {/* Image Section */}
                                <div className="relative h-44 sm:h-48 lg:h-56 overflow-hidden">
                                    {lang.iconUrl ? (
                                        <img
                                            src={lang.iconUrl}
                                            alt={lang.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-700 to-blue-800 flex items-center justify-center">
                                            <Globe className="w-16 h-16 lg:w-20 lg:h-20 text-white/20" />
                                        </div>
                                    )}

                                    {/* Completed Badge */}
                                    {completed && (
                                        <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2 z-10 border border-green-400">
                                            <CheckCircle2 size={18} className="fill-current" />
                                            Completed
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 text-center bg-gray-900/50">
                                    <h3
                                        className={`
                                            text-lg lg:text-xl font-semibold transition-colors
                                            ${completed ? "text-green-400" : "text-white group-hover:text-green-400"}
                                        `}
                                    >
                                        {lang.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-2">
                                        {lang.questionCount || 0} quizzes available
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {paginatedLanguages.length === 0 ? (
                    <div className="text-center py-12 lg:py-16 xl:py-20 px-4">
                        <Globe className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 mx-auto text-gray-600 mb-4 lg:mb-6" />
                        <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-500 mb-2 lg:mb-3">
                            {searchTerm ? "No matching languages found" : "No languages available yet"}
                        </h3>
                        <p className="text-gray-400 text-sm lg:text-base xl:text-lg">
                            {searchTerm ? "Try a different search term" : "Check back later for new languages!"}
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
                    /* Pagination */
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

export default Languages
