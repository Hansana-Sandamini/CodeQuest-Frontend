import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useDispatch } from "react-redux"
import { logout } from "../features/auth/authSlice"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Avatar from "./Avatar"

// Helper function to scroll smoothly
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

const Navbar = () => {
    const { isAuthenticated, user } = useAuth()
    const dispatch = useDispatch()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()
    
    // Check if we're on login or register page
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register"

    return (
        <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 text-white p-3 sm:p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo - Always shown */}
                <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="font-bold text-base sm:text-lg">⚡</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        CodeQuest
                    </span>
                </Link>

                {/* For auth pages (login/register), show only logo */}
                {isAuthPage ? (
                    <div className="flex items-center">
                        <div className="w-10 h-10"></div>
                    </div>
                ) : (
                    <>
                        {/* Hamburger Menu for mobile */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-gray-300 hover:text-white p-2"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>

                        {/* Middle: Navigation Links - Desktop */}
                        <div className="hidden md:flex items-center gap-6 lg:gap-8">
                            {!isAuthenticated ? (
                                <>
                                    <button
                                        onClick={() => scrollToSection("home")}
                                        className="font-medium hover:text-green-400 transition"
                                    >
                                        Home
                                    </button>
                                    <button
                                        onClick={() => scrollToSection("about")}
                                        className="font-medium hover:text-green-400 transition"
                                    >
                                        About
                                    </button>
                                    <button
                                        onClick={() => scrollToSection("contact")}
                                        className="font-medium hover:text-green-400 transition"
                                    >
                                        Contact
                                    </button>
                                </>
                            ) : null}
                        </div>

                        {/* Right Side - Desktop */}
                        <div className="hidden md:flex items-center gap-4 lg:gap-6">
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 sm:px-6 py-2 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 transition text-sm sm:text-base"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-4 sm:px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {/* Profile Section */}
                                    <div className="flex items-center gap-3 lg:gap-4">
                                        {/* Avatar + Username */}
                                        <Link to="/profile" className="flex items-center gap-2 lg:gap-3 hover:bg-gray-800/50 px-3 lg:px-4 py-2 rounded-xl transition group">
                                            {/* Real Profile Picture OR Fallback Initial */}
                                            <Avatar
                                                src={user?.profilePicture}
                                                username={user?.username}
                                                size="md"
                                                ring
                                            />

                                            {/* Username */}
                                            <span className="font-medium group-hover:text-green-300 transition hidden sm:block text-sm lg:text-base">
                                                {user?.username}
                                            </span>
                                        </Link>

                                        {/* Logout Button */}
                                        <button
                                            onClick={() => dispatch(logout())}
                                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-3 sm:px-5 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Mobile Menu - Only show if not on auth page */}
            {isMenuOpen && !isAuthPage && (
                <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-700 px-4 py-6">
                    {!isAuthenticated ? (
                        <>
                            <div className="flex flex-col gap-4 mb-6">
                                <button
                                    onClick={() => {
                                        scrollToSection("home")
                                        setIsMenuOpen(false)
                                    }}
                                    className="text-left py-2 font-medium hover:text-green-400 transition text-base"
                                >
                                    Home
                                </button>
                                <button
                                    onClick={() => {
                                        scrollToSection("about")
                                        setIsMenuOpen(false)
                                    }}
                                    className="text-left py-2 font-medium hover:text-green-400 transition text-base"
                                >
                                    About
                                </button>
                                <button
                                    onClick={() => {
                                        scrollToSection("contact")
                                        setIsMenuOpen(false)
                                    }}
                                    className="text-left py-2 font-medium hover:text-green-400 transition text-base"
                                >
                                    Contact
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-4 py-3 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 transition text-center text-base"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-center text-base"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            {/* Mobile profile section */}
                            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center font-bold text-lg">
                                    {user?.username?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <span className="font-medium text-base">{user?.username}</span>
                            </div>
                            <Link
                                to="/profile"
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-3 px-4 hover:bg-gray-800/50 rounded-xl transition text-base"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={() => {
                                    dispatch(logout())
                                    setIsMenuOpen(false)
                                }}
                                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-base"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar
