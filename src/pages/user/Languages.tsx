import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { fetchLanguages } from "../../features/languages/languageActions"
import { Globe } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { usePagination } from "../../hooks/usePagination"
import SearchBar from "../../components/SearchBar"
import Pagination from "../../components/Pagination"

const Languages = () => {
    const dispatch = useAppDispatch()
    const { items: languages, loading, error } = useAppSelector((state) => state.languages)
    const navigate = useNavigate() 
    
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

    const handleLanguageClick = (languageId: string, languageName: string) => {
        // Navigate to questions page with language info
        navigate(`/languages/${languageId}`, {
            state: { languageName }
        })
    }

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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 xl:gap-6">
                    {paginatedLanguages.map((lang) => (
                        <div
                            key={lang._id}
                            onClick={() => handleLanguageClick(lang._id, lang.name)}
                            className="group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl lg:rounded-2xl xl:rounded-3xl overflow-hidden shadow-lg lg:shadow-xl xl:shadow-2xl hover:shadow-green-500/30 transition-all duration-500 hover:-translate-y-2 lg:hover:-translate-y-3 xl:hover:-translate-y-4 cursor-pointer"
                        >
                        <div className="h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48 relative overflow-hidden">
                        {lang.iconUrl ? (
                            <img
                            src={lang.iconUrl}
                            alt={lang.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <Globe className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-white/20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                            <div className="absolute bottom-2 lg:bottom-3 xl:bottom-4 left-2 lg:left-3 xl:left-4 right-2 lg:right-3 xl:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <h3 className="text-base lg:text-lg xl:text-xl font-bold text-white mb-1 line-clamp-1">{lang.name}</h3>
                                <p className="text-green-400 text-xs lg:text-sm font-medium">
                                    {lang.questionCount || 0} quizzes
                                </p>
                            </div>
                        </div>

                        <div className="p-3 lg:p-4 xl:p-6 text-center">
                            <h3 className="text-sm lg:text-base xl:text-lg font-bold text-white group-hover:text-green-400 transition-colors line-clamp-1">
                                {lang.name}
                            </h3>
                            <p className="text-gray-400 text-xs lg:text-sm mt-1">
                                {lang.questionCount || 0} quizzes available
                            </p>
                        </div>
                    </div>
                    ))}
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
