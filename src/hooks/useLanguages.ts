import { useState, useEffect } from "react"
import { getLanguages } from "../api/language"
import type { ILanguage } from "../types/Language"

export const useLanguages = () => {
    const [languages, setLanguages] = useState<ILanguage[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchLanguages = async () => {
        try {
            setLoading(true)
            const data = await getLanguages()
            setLanguages(data)
            setError(null)

        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load languages")
            console.error(err)
            
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLanguages()
    }, [])

    return { languages, loading, error, refetch: fetchLanguages, setLanguages }
}
