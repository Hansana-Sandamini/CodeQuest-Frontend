import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Home, Globe, Trophy, Users, User, LogOut } from "lucide-react"
import { useDispatch } from "react-redux"
import { logout } from "../features/auth/authSlice"

const Sidebar = () => {
    const { user } = useAuth()
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isActive = (path: string) => location.pathname === path

    const isAdmin = user?.roles?.includes("ADMIN") || user?.roles?.includes("admin")

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

    return (
        <div className="fixed left-0 top-0 h-full w-74 bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 pt-20 z-40">
            <div className="px-6 py-8 space-y-8">

                {/* User Info */}
                <div className="flex items-center gap-4 px-4">
                    {user?.profilePicture ? (
                        <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-green-500"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center font-bold text-xl text-white">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                    )}

                    <div>
                        <p className="font-semibold text-white">{user?.username}</p>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                            {isAdmin ? (
                                <>
                                    <User size={14} className="text-red-400" />
                                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                                        Admin
                                    </span>
                                </>
                            ) : (
                                <>
                                    <User size={14} className="text-blue-400" />
                                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">
                                        User
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="border-gray-800" />

                {/* Admin sees admin items, normal users see regular */}
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                                isActive(item.path)
                                    ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`}
                        >
                            <span className={`${isActive(item.path) ? 'text-white' : 'text-gray-400'}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}

                    {/* Logout button - separate from other menu items */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-gray-300 hover:bg-red-900/20 hover:text-red-300 hover:border-red-500/30 border border-transparent"
                    >
                        <span className="text-gray-400">
                            <LogOut size={20} />
                        </span>
                        <span className="font-medium">Logout</span>
                    </button>

                </nav>
            </div>
        </div>
    )
}

export default Sidebar
