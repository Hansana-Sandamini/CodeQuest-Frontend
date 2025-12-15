import { useState } from "react"
import { useDispatch } from "react-redux"
import { registerUserAction } from "../features/auth/authActions"
import type { AppDispatch } from "../store/store"
import { Link, useNavigate } from "react-router-dom"
import Button from "../components/Button"
import { handleAuthAction } from "../utils/swal"

const Register = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: ""
    })
    const [profilePicture, setProfilePicture] = useState<File | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault()

        const fd = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            fd.append(key, value)
        })

        if (profilePicture) {
            fd.append("profilePicture", profilePicture)
        }

        await handleAuthAction(
            () => dispatch(registerUserAction(fd)),
            {
                loadingText: "Creating your account...",
                successTitle: "Welcome to CodeQuest!",
                successText: "Your account has been created successfully!",
                navigateTo: "/login",
                navigate,
            }
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700 shadow-2xl p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl">🚀</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            Join CodeQuest
                        </h1>
                        <p className="text-gray-400 mt-2">Start your coding adventure today</p>
                    </div>

                    <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Form Fields */}
                        {[
                            { key: "firstname", label: "First Name", type: "text" },
                            { key: "lastname", label: "Last Name", type: "text" },
                            { key: "username", label: "Username", type: "text" },
                            { key: "email", label: "Email", type: "email" },
                            { key: "password", label: "Password", type: "password", fullWidth: true },
                        ].map(({ key, label, type, fullWidth }) => (
                            <div key={key} className={fullWidth ? "md:col-span-2" : ""}>
                                <input
                                    type={type}
                                    name={key}
                                    placeholder={label}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                    value={(formData as any)[key]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}

                        {/* Profile Picture Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-300 mb-3 font-medium">Profile Picture (Optional)</label>
                            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center hover:border-green-500 transition-all cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="profilePicture"
                                />
                                <label htmlFor="profilePicture" className="cursor-pointer">
                                    <div className="text-3xl mb-2">📷</div>
                                    <p className="text-gray-400">
                                        {profilePicture ? profilePicture.name : "Click to upload profile picture"}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG (Max 5MB)</p>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2">
                            <Button type="submit" className="w-full">
                                Start Your Journey
                            </Button>
                        </div>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-green-400 hover:text-green-300 font-semibold transition"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Register
