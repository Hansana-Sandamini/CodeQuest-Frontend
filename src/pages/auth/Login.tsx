import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { forgotPasswordAction, loginUserAction, resetPasswordAction } from "../../features/auth/authActions"
import type { AppDispatch } from "../../store/store"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Button from "../../components/Button"
import swal, { handleAuthAction } from "../../utils/swal"
import RoleBasedRedirect from "../../components/RoleBasedRedirect"
import { useAuth } from "../../hooks/useAuth"
import PasswordInput from "../../components/PasswordInput"
import { GOOGLE_AUTH_URL } from '../../features/auth/constants/auth'

const Login = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const location = useLocation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Forgot Password Modal states
    const [showForgotModal, setShowForgotModal] = useState(false)
    const [forgotEmail, setForgotEmail] = useState("")

    // OTP Modal states
    const [showOtpModal, setShowOtpModal] = useState(false)
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

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

    const openForgotPasswordModal = () => {
        setForgotEmail("")
        setShowForgotModal(true)
    }

    const handleSendCode = async () => {
        if (!forgotEmail || !/^\S+@\S+\.\S+$/.test(forgotEmail)) {
            swal.fire("Invalid Email", "Please enter a valid email address", "error")
            return
        }

        setIsLoading(true)
        const success = await handleAuthAction(
            () => dispatch(forgotPasswordAction({ email: forgotEmail.trim() })),
            {
                loadingText: "Sending code...",
                successTitle: "Code Sent!",
                successText: "Check your email for the 6-digit code",
                navigateTo: "",
                navigate,
            }
        )
        setIsLoading(false)

        if (success) {
            setShowForgotModal(false)
            setShowOtpModal(true)
        }
    }

    const handleResetPassword = async () => {
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            swal.fire("Invalid Code", "Please enter a valid 6-digit code", "error")
            return
        }
        if (newPassword.length < 6) {
            swal.fire("Weak Password", "Password must be at least 6 characters", "error")
            return
        }
        if (newPassword !== confirmPassword) {
            swal.fire("Passwords Don't Match", "Please make sure both passwords are the same", "error")
            return
        }

        setIsLoading(true)
        await handleAuthAction(
            () => dispatch(resetPasswordAction({ email: forgotEmail, otp, newPassword })),
            {
                loadingText: "Resetting password...",
                successTitle: "Password Reset!",
                successText: "Your password has been successfully updated. You can now log in.",
                navigateTo: "/login",
                navigate,
            }
        )
        setIsLoading(false)
        setShowOtpModal(false)
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const error = params.get('error')

        if (error === 'google_failed') {
            swal.fire({
                icon: 'error',
                title: 'Google Login Failed',
                text: 'The Google sign-in process was cancelled or failed. Please try again.',
                timer: 4000,
                showConfirmButton: false,
            })
        } else if (error === 'google_noaccount') {
            swal.fire({
                icon: 'warning',
                title: 'No Account Found',
                text: 'We couldn\'t find an account linked to this Google email. Please register first using email and password.',
                confirmButtonText: 'Go to Register',
                confirmButtonColor: '#10B981',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    navigate('/register')
                }
            })
        }
    }, [location.search, navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">

            {isAuthenticated && <RoleBasedRedirect />}
            <div className="w-full max-w-md">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700 shadow-2xl p-4 sm:p-6 md:p-8">

                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl mx-auto mb-3 md:mb-4 flex items-center justify-center">
                            <span className="text-xl sm:text-2xl">🔐</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm sm:text-base">Sign in to continue your journey</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submitHandler} className="space-y-4 sm:space-y-6">
                        <div>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <PasswordInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm sm:text-base">
                                <button
                                    type="button"
                                    onClick={openForgotPasswordModal}
                                    className="text-green-400 hover:text-green-300 font-semibold transition"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full py-3 sm:py-4 text-sm sm:text-base">
                            Sign In
                        </Button>

                        <div className="mt-3">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-400"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-gray-800 text-gray-300">OR</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => window.location.href = GOOGLE_AUTH_URL}
                                className="mt-6 w-full flex items-center justify-center gap-3 bg-gray-300 text-gray-900 hover:bg-gray-200 px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-95"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.31-.98 2.42-2.07 3.16v2.63h3.35c1.96-1.81 3.09-4.47 3.09-7.25z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.35-2.63c-1.01.68-2.29 1.08-3.93 1.08-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.75 20.92 6.84 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.51 14.21c-.23-.68-.36-1.41-.36-2.21s.13-1.53.36-2.21V7.34H.96C.35 8.79 0 10.36 0 12s.35 3.21.96 4.66l4.55-2.45z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.84 0 2.75 2.08.96 5.34l4.55 2.45C6.42 5.02 8.98 4.98 12 4.98z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span>Sign in with Google</span>
                            </button>
                        </div>

                    </form>

                    {/* Footer Link */}
                    <div className="mt-6 md:mt-8 text-center">
                        <p className="text-gray-400 text-sm sm:text-base">
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

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setShowForgotModal(false)}></div>
                    <div className="relative w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4">Forgot Password?</h2>
                        <p className="text-gray-400 text-center mb-4 sm:mb-6 text-sm sm:text-base">We'll send a 6-digit code to your email</p>
                        <input
                            type="email"
                            placeholder="Your email address"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm sm:text-base"
                            autoFocus
                        />
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                            <Button onClick={handleSendCode} isLoading={isLoading} className="flex-1 px-4 sm:px-8 py-3 text-sm sm:text-base">
                                Send Code
                            </Button>
                            <button
                                onClick={() => setShowForgotModal(false)}
                                className="flex-1 px-4 sm:px-8 py-3 rounded-xl font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 transition text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* OTP + Reset Password Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setShowOtpModal(false)}></div>
                    <div className="relative w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4">Enter Verification Code</h2>
                        <p className="text-gray-400 text-xs sm:text-sm text-center mb-4 sm:mb-6">
                            We sent a 6-digit code to <strong>{forgotEmail}</strong>
                        </p>
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            maxLength={6}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 text-center text-xl sm:text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        />

                         <div className="mt-4">
                            <PasswordInput
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New password"
                                required
                                minLength={6}
                            />
                        </div>
                            
                        <div className="mt-4">
                            <PasswordInput
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                            <Button onClick={handleResetPassword} isLoading={isLoading} className="flex-1 px-4 sm:px-8 py-3 text-sm sm:text-base">
                                Reset Password
                            </Button>
                            <button
                                onClick={() => setShowOtpModal(false)}
                                className="flex-1 px-4 sm:px-8 py-3 rounded-xl font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 transition text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Login
