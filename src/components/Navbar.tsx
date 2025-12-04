import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useDispatch } from "react-redux"
import { logout } from "../features/auth/authSlice"

const Navbar = () => {
    const { isAuthenticated, user } = useAuth()
    const dispatch = useDispatch()

    return (
        <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 text-white p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-linear-to-r from-green-600 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="font-bold text-lg">⚡</span>
                    </div>
                    <span className="text-2xl font-bold bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        CodeQuest
                    </span>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-6">
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className="px-6 py-2 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 transition"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Profile Section */}
                            <div className="flex items-center gap-4">
                                {/* Avatar + Username */}
                                <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-800/50 px-4 py-2 rounded-xl transition group">
                                    {/* Real Profile Picture OR Fallback Initial */}
                                    {user?.profilePicture ? (
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-green-500/50 shadow-lg"
                                            onError={(e) => {
                                                // If image fails to load → hide it and show letter
                                                e.currentTarget.style.display = "none"
                                                e.currentTarget.nextElementSibling?.classList.remove("hidden")
                                            }}
                                        />
                                    ) : null}

                                    {/* Fallback: Initial Letter */}
                                    <div
                                        className={`w-10 h-10 rounded-full bg-linear-to-r from-green-500 to-blue-500 flex items-center justify-center font-bold text-lg shadow-lg ${
                                            user?.profilePicture ? "hidden" : ""
                                        }`}
                                    >
                                        {user?.username?.charAt(0).toUpperCase() || "U"}
                                    </div>

                                    {/* Username */}
                                    <span className="font-medium group-hover:text-green-300 transition hidden sm:block">
                                        {user?.username}
                                    </span>
                                </Link>

                                {/* Logout Button */}
                                <button
                                    onClick={() => dispatch(logout())}
                                    className="bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-5 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
