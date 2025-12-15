import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { fetchLanguages } from "../../features/languages/languageActions"
import { Globe } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Languages() {
    const dispatch = useAppDispatch()
    const { items: languages, loading, error } = useAppSelector((state) => state.languages)
    const navigate = useNavigate() // Add this
    
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
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-2xl text-gray-400 animate-pulse">Loading languages...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-red-400 text-xl">Failed to load languages</div>
            </div>
        )
    }

    return (
        <div className="ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-20 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        Choose Your Language
                    </h1>
                    <p className="text-xl text-gray-400">Master coding with interactive quizzes</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {languages.map((lang) => (
                        <div
                            key={lang._id}
                            onClick={() => handleLanguageClick(lang._id, lang.name)}
                            className="group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-3xl overflow-hidden shadow-2xl hover:shadow-green-500/30 transition-all duration-500 hover:-translate-y-4 cursor-pointer"
                        >
                        <div className="h-48 relative overflow-hidden">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <h3 className="text-2xl font-bold text-white mb-2">{lang.name}</h3>
                                <p className="text-green-400 text-sm font-medium">
                                    {lang.questionCount || 0} quizzes
                                </p>
                            </div>
                        </div>

                        <div className="p-6 text-center">
                            <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                                {lang.name}
                            </h3>
                            <p className="text-gray-400 text-sm mt-2">
                                {lang.questionCount || 0} quizzes available
                            </p>
                        </div>
                    </div>
                    ))}
                </div>

                {languages.length === 0 && (
                    <div className="text-center py-20">
                        <Globe size={100} className="mx-auto text-gray-600 mb-6" />
                        <h3 className="text-3xl font-bold text-gray-500">No languages available yet</h3>
                    </div>
                )}
            </div>
        </div>
    )
}
