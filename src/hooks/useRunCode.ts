import { useState } from "react"
import { submitCode, getSubmissionResult } from "../api/judge0Api"

export function useRunCode() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const run = async (
        sourceCode: string,
        languageId: number,
        stdin: string,
        expectedOutput: string
    ) => {
        setLoading(true)
        setResult(null)

        try {
            // Send Submission
            const submission = await submitCode({
                source_code: sourceCode,
                language_id: languageId,
                stdin,
                expected_output: expectedOutput,
            })

            // Poll Judge0 result
            let token = submission.token
            let status

            while (true) {
                const res = await getSubmissionResult(token)
                status = res.status?.id

                if (status === 1 || status === 2) {
                    // In Queue / Processing
                    await new Promise((r) => setTimeout(r, 1200))
                    continue
                }

                setResult(res)
                return res
            }

        } catch (err) {
            console.error("Judge0 Error:", err)
            
        } finally {
            setLoading(false)
        }
    }

    return { run, loading, result }
}
