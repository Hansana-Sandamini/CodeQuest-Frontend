export interface ILanguage {
    _id: string
    name: string
    description?: string
    iconUrl?: string
    questions: string[] // array of question IDs
    questionCount: number
}
