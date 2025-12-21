import { Search, X } from 'lucide-react'

interface SearchBarProps {
    searchTerm: string
    onSearchChange: (term: string) => void
    placeholder?: string
    className?: string
}

const SearchBar = ({
    searchTerm,
    onSearchChange,
    placeholder = 'Search...',
    className = '',
}: SearchBarProps) => {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-10 sm:pl-12 pr-8 sm:pr-10 py-2 sm:py-3 focus:outline-none focus:border-green-500 text-sm sm:text-base"
            />
            {searchTerm && (
                <button
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white"
                >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
            )}
        </div>
    )
}

export default SearchBar
