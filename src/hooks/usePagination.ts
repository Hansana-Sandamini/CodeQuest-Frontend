import { useState, useMemo, useEffect } from 'react'

interface UsePaginationProps<T> {
    data: T[]
    itemsPerPage: number
    searchTerm?: string
    searchFields?: (keyof T)[]
}

interface UsePaginationReturn<T> {
    currentPage: number
    setCurrentPage: (page: number) => void
    filteredData: T[]
    paginatedData: T[]
    totalPages: number
    startIndex: number
    endIndex: number
    resetPagination: () => void
}

export function usePagination<T>({
    data,
    itemsPerPage,
    searchTerm = '',
    searchFields = [],
}: UsePaginationProps<T>): UsePaginationReturn<T> {
    const [currentPage, setCurrentPage] = useState(1)

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm.trim() || searchFields.length === 0) {
            return data
        }

        const term = searchTerm.toLowerCase();
            return data.filter(item => 
                searchFields.some(field => {
                    const value = item[field]
                    return typeof value === 'string' && 
                            value.toLowerCase().includes(term)
                })
            )
        }, [data, searchTerm, searchFields])

        // Reset to page 1 when search changes
        useEffect(() => {
            setCurrentPage(1)
        }, [searchTerm])

        // Calculate pagination values
        const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedData = filteredData.slice(startIndex, endIndex)

        const resetPagination = () => {
        setCurrentPage(1)
    }

    return {
        currentPage,
        setCurrentPage,
        filteredData,
        paginatedData,
        totalPages,
        startIndex,
        endIndex,
        resetPagination,
    }
}
