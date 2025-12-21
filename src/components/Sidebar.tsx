import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Home, Globe, Trophy, Users, User, LogOut, Menu, X } from "lucide-react"
import { useDispatch } from "react-redux"
import { logout } from "../features/auth/authSlice"
import { useState, useEffect } from "react"
import Avatar from "./Avatar"

const Sidebar = () => {
    const { user } = useAuth()
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const isActive = (path: string) => location.pathname === path

    const isAdmin = user?.roles?.includes("ADMIN") || user?.roles?.includes("admin")

    // Format long emails
    const formatEmail = (email: string | undefined) => {
        if (!email) return ""
        
        // For desktop, show more characters
        if (window.innerWidth >= 1024) {
            if (email.length > 30) {
                return `${email.substring(0, 25)}...${email.substring(email.lastIndexOf('@'))}`
            }
            return email
        }
        
        // For mobile/tablet
        if (email.length > 20) {
            return `${email.substring(0, 15)}...${email.substring(email.lastIndexOf('@'))}`
        }
        return email
    }

    const handleLogout = () => {
        dispatch(logout())
        navigate("/login")
    }
    
    // Define menu items with icons based on role
    const menuItems = isAdmin
        ? [
              { path: "/admin", label: "Dashboard", icon: <Home size={20} /> },
              { path: "/admin/languages", label: "Languages", icon: <Globe size={20} /> },
              { path: "/leaderboard", label: "Leaderboard", icon: <Trophy size={20} /> },
              { path: "/admin/users", label: "Users", icon: <Users size={20} /> },
              { path: "/profile", label: "Profile", icon: <User size={20} /> },
          ]
        : [
              { path: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
              { path: "/languages", label: "Languages", icon: <Globe size={20} /> },
              { path: "/leaderboard/me", label: "Leaderboard", icon: <Trophy size={20} /> },
              { path: "/profile", label: "Profile", icon: <User size={20} /> },
          ]

    // Close sidebar when route changes (on mobile)
    useEffect(() => {
        setIsOpen(false)
    }, [location.pathname])

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg text-white shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full w-64 lg:w-74 bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 
                pt-20 lg:pt-20 z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="px-4 lg:px-6 py-6 lg:py-8 space-y-6 lg:space-y-8 h-full overflow-y-auto">

                    {/* User Info */}
                    <div className="flex items-center gap-3 lg:gap-4 px-2 lg:px-4">
                        <Avatar
                            src={user?.profilePicture}
                            username={user?.username}
                            size="lg"
                            ring
                        />

                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-sm lg:text-base truncate">
                                {user?.username}
                            </p>
                            
                            {/* Email with tooltip on hover */}
                            <div className="relative group">
                                <p className="text-xs lg:text-sm text-gray-400 truncate">
                                    {formatEmail(user?.email)}
                                </p>
                                
                                {/* Full email appears on hover */}
                                <div className="
                                    absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs 
                                    px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50 border border-gray-700 max-w-xs
                                ">
                                    {user?.email}
                                    <div className="absolute -bottom-1 left-4 w-3 h-3 bg-gray-800 transform rotate-45 border-r border-b border-gray-700"></div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-1 mt-1">
                                {isAdmin ? (
                                    <>
                                        <User size={14} className="text-red-400" />
                                        <span className="inline-block px-1.5 lg:px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-full truncate">
                                            Admin
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <User size={14} className="text-blue-400" />
                                        <span className="inline-block px-1.5 lg:px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full truncate">
                                            User
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Navigation Menu */}
                    <nav className="space-y-1 lg:space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-300 ${
                                    isActive(item.path)
                                        ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg"
                                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`}
                            >
                                <span className={`${isActive(item.path) ? 'text-white' : 'text-gray-400'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium text-sm lg:text-base">{item.label}</span>
                            </Link>
                        ))}

                        {/* Logout button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-300 text-gray-300 hover:bg-red-900/20 hover:text-red-300 hover:border-red-500/30 border border-transparent"
                        >
                            <span className="text-gray-400">
                                <LogOut size={20} />
                            </span>
                            <span className="font-medium text-sm lg:text-base">Logout</span>
                        </button>
                    </nav>

                    {/* Mobile Close Hint */}
                    <div className="lg:hidden text-center pt-4">
                        <p className="text-xs text-gray-500">Tap outside to close</p>
                    </div>
                </div>
            </div>

            {/* Add margin/padding to main content on mobile */}
            <style>{`
                @media (max-width: 1023px) {
                    body {
                        padding-top: 60px;
                        background-color: #000000;
                    }
                }
            `}</style>
        </>
    )
}

export default Sidebar
