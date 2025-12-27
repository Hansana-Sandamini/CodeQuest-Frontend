import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import RoleBasedRedirect from "./components/RoleBasedRedirect"

import Home from "./pages/home/Home"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import UserDashboard from "./pages/user/UserDashboard"
import AdminDashboard from "./pages/admin/AdminDashboard"
import { useAuth } from "./hooks/useAuth"
import Sidebar from "./components/Sidebar"
import AdminLanguages from "./pages/admin/AdminLanguages"
import Languages from "./pages/user/Languages"
import QuestionsByLanguage from "./pages/admin/QuestionsByLanguage"
import LanguageQuestions from "./pages/user/LanguageQuestions"
import QuestionPage from "./pages/user/QuestionPage"
import AdminUsers from "./pages/admin/AdminUsers"
import Profile from "./pages/Profile"
import Leaderboard from "./pages/Leaderboard"
import GoogleCallback from "./pages/auth/GoogleCallback"

export default function App() {
    const { isAuthenticated } = useAuth()

    return (
        <Router>
            <RoleBasedRedirect />  

            <div className="min-h-screen bg-gray-900 text-white">
                <Navbar />

                {/* Show Sidebar only when logged in */}
                {isAuthenticated && <Sidebar />}
                
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} /> 
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auth/google/callback" element={<GoogleCallback />} />

                    {/* Protected Routes (any logged-in user) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/languages" element={<Languages />} />
                        <Route path="/languages/:languageId" element={<LanguageQuestions />} />
                        <Route path="/question/:id" element={<QuestionPage />} />
                        <Route path="/daily-question" element={<QuestionPage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/leaderboard/me" element={<Leaderboard />} />
                        
                        {/* Admin-Only Routes nested inside ProtectedRoute */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/languages" element={<AdminLanguages />} />
                            <Route path="/admin/languages/:languageId/questions" element={<QuestionsByLanguage />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/leaderboard" element={<Leaderboard />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<div className="text-center pt-40 text-4xl">404</div>} />
                </Routes>
            </div>
        </Router>
    )
}
