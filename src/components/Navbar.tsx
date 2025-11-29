import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useDispatch } from "react-redux"
import { logout } from "../features/auth/authSlice"

const Navbar = () => {
    const { isAuthenticated, user } = useAuth()
    const dispatch = useDispatch()

    return (
        <nav className="bg-gray-900 text-white p-4 flex justify-between">
            <Link to="/" className="font-bold text-xl">CodeQuest</Link>

            <div className="flex gap-4 items-center">
                {!isAuthenticated && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                {isAuthenticated && (
                    <>
                        <Link to="/profile">{user?.username}</Link>
                        <button
                            onClick={() => dispatch(logout())}
                            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar
