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
                    <span className="text-xl font-bold bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        CodeQuest
                    </span>
                </Link>

                {/* Navigation Items */}
                <div className="flex gap-6 items-center">
                    {!isAuthenticated ? (
                        <>
                            <Link 
                                to="/login" 
                                className="px-6 py-2 rounded-xl font-semibold text-gray-300 hover:text-white border border-from-green-600 to-blue-600 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/register" 
                                className="bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                            >
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/profile" 
                                className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group"
                            >
                                <div className="w-8 h-8 bg-linear-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium group-hover:text-purple-300 transition-colors">
                                    {user?.username}
                                </span>
                            </Link>
                            <button
                                onClick={() => dispatch(logout())}
                                className="bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 ml-2"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
