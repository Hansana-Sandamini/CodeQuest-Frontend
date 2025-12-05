import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import RoleBasedRedirect from "./components/RoleBasedRedirect"

import Home from "./pages/home/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import UserDashboard from "./pages/UserDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import { useAuth } from "./hooks/useAuth"
import Sidebar from "./components/Sidebar"

export default function App() {
    return (
        <Router>
            <RoleBasedRedirect />  

            <div className="min-h-screen bg-gray-900 text-white">
                <Navbar />

                {/* Show Sidebar only when logged in */}
                {useAuth().isAuthenticated && <Sidebar />}
                
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} /> 
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<div className="text-center pt-40 text-4xl">404</div>} />
                </Routes>
            </div>
        </Router>
    )
}
