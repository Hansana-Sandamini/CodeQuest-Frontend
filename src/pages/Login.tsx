import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginUserAction } from "../features/auth/authActions"
import type { AppDispatch } from "../store/store"
import { Link, useNavigate } from "react-router-dom"
import Button from "../components/Button"
import { handleAuthAction } from "../utils/swal"
import RoleBasedRedirect from "../components/RoleBasedRedirect"
import { useAuth } from "../hooks/useAuth"

const Login = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault()

        await handleAuthAction(
            () => dispatch(loginUserAction({ email: email.trim(), password })),
            {
                loadingText: "Signing you in...",
                successTitle: "Welcome back!",
                successText: "You've successfully logged in",
                navigateTo: "",
                navigate,
            }
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 to-black flex items-center justify-center p-4">

            {isAuthenticated && <RoleBasedRedirect />}

            <div className="w-full max-w-md">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700 shadow-2xl p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-linear-to-r from-green-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl">🔐</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400 mt-2">Sign in to continue your journey</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submitHandler} className="space-y-6">

                        <div>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>

                    </form>

                    {/* Footer Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-green-400 hover:text-green-300 font-semibold transition"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login
