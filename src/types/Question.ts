export enum Difficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
}

export enum QuestionType {
    MCQ = "MCQ",
    CODING = "CODING",
}

export interface TestCase {
    input: string
    expectedOutput: string
}

export interface Question {
    _id: string
    language: {
        judge0Id: any
        _id: string
        name: string
        iconUrl?: string
    }
    title: string
    description: string
    difficulty: Difficulty
    type: QuestionType
    options?: string[]
    correctAnswer?: number     
    testCases?: TestCase[]
    createdAt: string
    updatedAt: string
}

export interface CreateQuestionPayload {
    language?: string           
    title: string
    description: string
    difficulty: Difficulty
    type: QuestionType
    options?: string[]
    correctAnswer?: number          
    testCases?: TestCase[]
}

export interface UpdateQuestionPayload
    extends Partial<Omit<CreateQuestionPayload, "language" | "type">> {}
