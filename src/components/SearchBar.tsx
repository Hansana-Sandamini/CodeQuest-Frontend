import { Search, X } from 'lucide-react'

interface SearchBarProps {
    searchTerm: string
    onSearchChange: (term: string) => void
    placeholder?: string
    className?: string
}

export function SearchBar({
    searchTerm,
    onSearchChange,
    placeholder = 'Search...',
    className = '',
}: SearchBarProps) {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-green-500"
            />
            {searchTerm && (
                <button
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    )
}
