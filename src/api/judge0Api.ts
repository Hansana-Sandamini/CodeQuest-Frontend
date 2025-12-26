import axios from "axios"

const JUDGE0_BASE = "https://judge0-ce.p.rapidapi.com/submissions"

const client = axios.create({
    baseURL: JUDGE0_BASE,
    headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    }
})

export const submitCode = async (payload: {
    source_code: string
    language_id: number
    stdin?: string
    expected_output?: string
}) => {
    const { data } = await client.post("?base64_encoded=false&wait=false", payload)
    return data   // returns {token}
}

export const getSubmissionResult = async (token: string) => {
    const { data } = await client.get(`/${token}?base64_encoded=false`)
    return data
}
