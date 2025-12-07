import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import languageReducer from "../features/languages/languageSlice"
import questionReducer from "../features/questions/questionSlice"

const rootReducer = combineReducers({
	auth: authReducer,
	languages: languageReducer,
	questions: questionReducer
})

export default rootReducer
