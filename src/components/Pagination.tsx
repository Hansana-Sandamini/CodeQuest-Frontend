import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
}: PaginationProps) => {
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
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 ${className}`}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition w-full sm:w-auto text-sm sm:text-base"
            >
                <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                Previous
            </button>
            
            <div className="flex items-center gap-2">
                {getPageNumbers().map((page, index) => {
                    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                        return (
                            <span key={`${page}-${index}`} className="px-2 text-gray-500 text-sm sm:text-base">
                            ...
                            </span>
                        )
                    }
                    
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-medium transition text-sm sm:text-base ${
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
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition w-full sm:w-auto text-sm sm:text-base"
            >
                Next
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
            </button>
        </div>
    )
}

export default Pagination
