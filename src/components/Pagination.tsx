import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
}: PaginationProps) {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages = []

        // Always show first page
        pages.push(1)

        // Calculate range around current page
        let start = Math.max(2, currentPage - 1)
        let end = Math.min(totalPages - 1, currentPage + 1)

        // Add ellipsis if needed
        if (start > 2) pages.push('ellipsis-start')

        // Add middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        // Add ellipsis if needed
        if (end < totalPages - 1) pages.push('ellipsis-end')

        // Always show last page if not already shown
        if (totalPages > 1 && !pages.includes(totalPages)) {
            pages.push(totalPages)
        }

        return pages
    }

    return (
        <div className={`flex items-center justify-center gap-4 ${className}`}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <ChevronLeft size={20} />
                Previous
            </button>
            
            <div className="flex items-center gap-2">
                {getPageNumbers().map((page, index) => {
                    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                        return (
                            <span key={`${page}-${index}`} className="px-2 text-gray-500">
                            ...
                            </span>
                        )
                    }
                    
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`w-10 h-10 rounded-xl font-medium transition ${
                            currentPage === page
                                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                            }`}
                        >
                            {page}
                        </button>
                    )
                })}
            </div>
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Next
                <ChevronRight size={20} />
            </button>
        </div>
    )
}
