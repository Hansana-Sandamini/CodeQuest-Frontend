import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useAuth } from "../hooks/useAuth"
import { updateUser, updateProfilePicture } from "../features/auth/authSlice"
import { Camera, Save, Key, Award, FileText, Flame, Trophy, Shield, Users, BarChart } from "lucide-react"
import { userApi } from "../api/userService"
import swal from "../utils/swal"
import type { IBadge, ICertificate } from "../types/User"
import { Link } from "react-router-dom"
import PasswordInput from "../components/PasswordInput"
import Avatar from "../components/Avatar"

const Profile = () => {
    const { user, isAdmin } = useAuth()
    const dispatch = useDispatch()
    
    const [loading, setLoading] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
    })
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [showPasswordForm, setShowPasswordForm] = useState(false)

    useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                username: user.username || "",
            })
        }
    }, [user])

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const updated = await userApi.updateMyProfile(formData)
            
            // Update user in Redux store
            dispatch(updateUser(updated))
            
            setEditMode(false)
            
            await swal.fire({
                icon: "success",
                title: "Profile Updated!",
                text: "Your profile has been updated successfully.",
                timer: 2000,
                showConfirmButton: false,
            })
            
        } catch (err: any) {
            await swal.fire({
                icon: "error",
                title: "Update Failed",
                text: err.response?.data?.message || "Failed to update profile. Please try again.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLoading(true)
        
        try {
            const result = await userApi.updateProfilePicture(file)
            
            // Update profile picture in Redux store
            dispatch(updateProfilePicture({ profilePicture: result.profilePicture }))
            
            await swal.fire({
                icon: "success",
                title: "Profile Picture Updated!",
                text: "Your profile picture has been updated successfully.",
                timer: 2000,
                showConfirmButton: false,
            })
            
        } catch (err: any) {
            await swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: err.response?.data?.message || "Failed to upload profile picture. Please try again.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            await swal.fire({
                icon: "warning",
                title: "Passwords Don't Match",
                text: "Please make sure your new passwords match.",
            })
            return
        }

        if (passwordData.newPassword.length < 6) {
            await swal.fire({
                icon: "warning",
                title: "Password Too Short",
                text: "Password must be at least 6 characters long.",
            })
            return
        }

        setLoading(true)
        
        try {
            await userApi.changePassword(passwordData.oldPassword, passwordData.newPassword)
            
            await swal.fire({
                icon: "success",
                title: "Password Changed!",
                text: "Your password has been updated successfully.",
                timer: 2000,
                showConfirmButton: false,
            })
            
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
            setShowPasswordForm(false)
            
        } catch (err: any) {
            await swal.fire({
                icon: "error",
                title: "Password Change Failed",
                text: err.response?.data?.message || "Failed to change password. Please check your current password.",
            })
        } finally {
            setLoading(false)
        }
    }

    // Get user badges
    const getUserBadges = (): IBadge[] => {
        if (!user?.badges) return []
        try {
            if (Array.isArray(user.badges)) {
                return user.badges;
            }
        } catch (err) {
            console.error("Error parsing badges:", err)
        }
        return []
    }

    // Get user certificates
    const getUserCertificates = (): ICertificate[] => {
        if (!user?.certificates) return []
        try {
            if (Array.isArray(user.certificates)) {
                return user.certificates;
            }
        } catch (err) {
            console.error("Error parsing certificates:", err)
        }
        return []
    }

    // Get display name
    const getDisplayName = () => {
        if (user?.firstname || user?.lastname) {
            return `${user.firstname || ''} ${user.lastname || ''}`.trim()
        }
        return user?.username || "User"
    }

    // Handle view certificate
    const handleViewCertificate = (url: string) => {
        window.open(url, "_blank")
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-20 px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        Profile
                    </h1>
                    <p className="text-xl text-gray-400">Please log in to view your profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 lg:py-20 px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12  border-b border-gray-700 pb-6">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        Your Profile {isAdmin && <span className="text-red-400">(Admin)</span>}
                    </h1>
                    {isAdmin && (
                        <p className="text-gray-400">
                            Administrator account with full system access
                        </p>
                    )}
                </div>

                <div className={"grid md:grid-cols-3 gap-8"}>
                    {/* Left Column - Profile Info */}
                    <div className={isAdmin ? "md:col-span-2" : "md:col-span-2 space-y-8"}>
                        {/* Profile Card */}
                        <div className="backdrop-blur-sm bg-gray-800/40 border border-gray-700 rounded-2xl p-8">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="relative">
                                    <Avatar 
                                        src={user.profilePicture}
                                        username={user.username}
                                        size="lg"
                                        ring
                                    />
                                    <label className="
                                        absolute -bottom-3 -right-3 bg-gray-800 hover:bg-gray-700 p-2 rounded-full cursor-pointer transition-colors border border-gray-600
                                        group-hover:scale-110 transform transition-transform
                                    ">
                                        <Camera size={16} className="text-gray-300" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePictureUpload}
                                            disabled={loading}
                                        />
                                    </label>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold">{getDisplayName()}</h2>
                                    <p className="text-gray-400">{user?.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        {isAdmin ? (
                                            <div className="flex items-center gap-2">
                                                <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm flex items-center gap-1">
                                                    <Shield size={12} />
                                                    Administrator
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                                    Learner
                                                </div>
                                                {user?.currentStreak && user.currentStreak > 0 && (
                                                    <div className="flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                                                        <Flame size={14} />
                                                        {user.currentStreak} day streak
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Edit Form */}
                            <form onSubmit={handleProfileUpdate}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            value={formData.firstname}
                                            onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 disabled:opacity-50"
                                            disabled={!editMode || loading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.lastname}
                                            onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 disabled:opacity-50"
                                            disabled={!editMode || loading}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-400 mb-2">Username</label>
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 disabled:opacity-50"
                                            disabled={!editMode || loading}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 mt-8">
                                    {!editMode ? (
                                        <button
                                            type="button"
                                            onClick={() => setEditMode(true)}
                                            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="submit"
                                                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    "Saving..."
                                                ) : (
                                                    <>
                                                        <Save size={18} />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditMode(false);
                                                    setFormData({
                                                        firstname: user?.firstname || "",
                                                        lastname: user?.lastname || "",
                                                        username: user?.username || "",
                                                    });
                                                }}
                                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        <Key size={18} />
                                        Change Password
                                    </button>
                                </div>
                            </form>

                            {/* Password Change Form */}
                            {showPasswordForm && (
                                <form onSubmit={handlePasswordChange} className="mt-8 pt-8 border-t border-gray-700">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Key size={20} />
                                        Change Password
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                                            <PasswordInput
                                                value={passwordData.oldPassword}
                                                onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                                placeholder="Current password"
                                                required
                                                disabled={loading}
                                                name="oldPassword"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">New Password</label>
                                            <PasswordInput
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                placeholder="New password"
                                                required
                                                disabled={loading}
                                                minLength={6}
                                                name="newPassword"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                                            <PasswordInput
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                placeholder="Confirm new password"
                                                required
                                                disabled={loading}
                                                minLength={6}
                                                name="confirmPassword"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            {loading ? "Updating..." : "Update Password"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPasswordForm(false);
                                                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                                            }}
                                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Achievements - Only for regular users */}
                        {!isAdmin && (
                            <div className="backdrop-blur-sm bg-gray-800/40 border border-gray-700 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Award className="text-yellow-400" />
                                    Achievements
                                </h3>
                                <div className="space-y-6">
                                    {/* Badges */}
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4 text-gray-300">Badges</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {getUserBadges().length > 0 ? (
                                                getUserBadges().map((badge: IBadge, index: number) => (
                                                    <div key={badge._id || index} className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-center">
                                                        <div 
                                                            className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" 
                                                            style={{ backgroundColor: (badge.color || '#CD7F32') + '40' }}
                                                        >
                                                            <Award size={32} style={{ color: badge.color || '#CD7F32' }} />
                                                        </div>
                                                        <p className="font-medium">{badge.level || 'Badge'}</p>
                                                        <p className="text-sm text-gray-400">{badge.percentage}%</p>
                                                        <p className="text-xs text-gray-500">{badge.language?.name || 'Unknown Language'}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-full text-center py-8">
                                                    <Award size={48} className="mx-auto mb-4 text-gray-700" />
                                                    <p className="text-gray-500">No badges earned yet.</p>
                                                    <p className="text-sm text-gray-600">Start solving questions to earn badges!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Certificates */}
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2">
                                            <FileText className="text-green-400" />
                                            Certificates
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {getUserCertificates().length > 0 ? (
                                                getUserCertificates().map((cert: ICertificate, index: number) => (
                                                    <div key={cert._id || index} className="bg-gray-900/50 border border-green-500/30 rounded-xl p-4">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <FileText className="text-green-400" size={24} />
                                                            <div>
                                                                <p className="font-medium">Mastery Certificate</p>
                                                                <p className="text-sm text-gray-400">{cert.language?.name || 'Unknown Language'}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleViewCertificate(cert.url)}
                                                            className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            View Certificate
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-full text-center py-8">
                                                    <FileText size={48} className="mx-auto mb-4 text-gray-700" />
                                                    <p className="text-gray-500">No certificates earned yet.</p>
                                                    <p className="text-sm text-gray-600">Complete 100% of any language to earn certificates!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Stats & Admin Features */}
                    <div className="space-y-8">
                        {/* Stats Card - Only for regular users */}
                        {!isAdmin && (
                            <div className="backdrop-blur-sm bg-gray-800/40 border border-gray-700 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Trophy className="text-yellow-400" />
                                    Stats
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                                        <span className="text-gray-400">Current Streak</span>
                                        <span className="text-2xl font-bold text-orange-400">{user?.currentStreak || 0} days</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                                        <span className="text-gray-400">Longest Streak</span>
                                        <span className="text-2xl font-bold text-blue-400">{user?.longestStreak || 0} days</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                                        <span className="text-gray-400">Badges Earned</span>
                                        <span className="text-2xl font-bold text-green-400">{getUserBadges().length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Certificates</span>
                                        <span className="text-2xl font-bold text-purple-400">{getUserCertificates().length}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Admin Quick Actions (Only for Admins) */}
                        {isAdmin && (
                            <div className="backdrop-blur-sm bg-red-900/20 border border-red-700/50 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Shield className="text-red-400" />
                                    Admin Actions
                                </h3>
                                <div className="space-y-4">
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors"
                                    >
                                        <BarChart className="text-red-400" size={20} />
                                        <div>
                                            <p className="font-medium">Dashboard</p>
                                            <p className="text-sm text-gray-400">View system analytics</p>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/admin/users"
                                        className="flex items-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors"
                                    >
                                        <Users className="text-red-400" size={20} />
                                        <div>
                                            <p className="font-medium">Manage Users</p>
                                            <p className="text-sm text-gray-400">View and manage all users</p>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/admin/languages"
                                        className="flex items-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors"
                                    >
                                        <Award className="text-red-400" size={20} />
                                        <div>
                                            <p className="font-medium">Manage Content</p>
                                            <p className="text-sm text-gray-400">Edit languages and questions</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
