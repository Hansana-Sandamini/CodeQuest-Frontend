import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import languageReducer from "../features/languages/languageSlice"

const rootReducer = combineReducers({
	auth: authReducer,
	languages: languageReducer
})

export default rootReducer
