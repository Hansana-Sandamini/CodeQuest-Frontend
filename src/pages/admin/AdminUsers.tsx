import { useEffect, useState } from "react"
import { useUsers } from "../../hooks/useUsers"
import { UserPlus, Trash2, Edit, Save, X } from "lucide-react"
import { Role } from "../../types/User"
import { usePagination } from "../../hooks/usePagination"
import { SearchBar } from "../../components/SearchBar"
import { Pagination } from "../../components/Pagination"

const AdminUsers = () => {
    const { users, loading, error, fetchUsers, updateUserRole, deleteUser } = useUsers()
    const [searchTerm, setSearchTerm] = useState("")
    const [editingUserId, setEditingUserId] = useState<string | null>(null)
    const [userRoles, setUserRoles] = useState<Role[]>([])

    const ITEMS_PER_PAGE = 6
    const {
        currentPage,
        setCurrentPage,
        filteredData: filteredUsers,
        paginatedData: paginatedUsers,
        totalPages,
    } = usePagination({
        data: users,
        itemsPerPage: ITEMS_PER_PAGE,
        searchTerm,
        searchFields: ['username', 'email', 'firstname', 'lastname'],
    })
    
    useEffect(() => {
        fetchUsers()
    }, [])

    const handleEditRoles = (userId: string, currentRoles: Role[]) => {
        setEditingUserId(userId)
        setUserRoles([...currentRoles])
    }

    const handleSaveRoles = async (userId: string) => {
        try {
            await updateUserRole(userId, userRoles)
            setEditingUserId(null)
        } catch (err) {
            console.error("Failed to update roles:", err)
        }
    }

    const handleToggleRole = (role: Role) => {
        setUserRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        )
    }

    const handleDeleteUser = async (userId: string, username: string) => {
        if (window.confirm(`Are you sure you want to delete user ${username}?`)) {
            try {
                await deleteUser(userId)
            } catch (err) {
                console.error("Failed to delete user:", err)
            }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-2xl text-gray-400 animate-pulse">Loading users...</div>
            </div>
        )
    }

    return (
        <div className="ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-20 px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12  border-b border-gray-700 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            Manage Users
                        </h1>
                        <p className="text-gray-400 mt-3 text-lg">
                            Manage all registered users and their permissions
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search users by name, email, or username..."
                    />
                    <div className="mt-4 flex flex-wrap items-center justify-between text-gray-400">
                        <p>
                            Showing {paginatedUsers.length} of {filteredUsers.length} users
                            {searchTerm && (
                                <span> for "<span className="text-green-400">{searchTerm}</span>"</span>
                            )}
                        </p>
                        {filteredUsers.length > ITEMS_PER_PAGE && (
                            <p>Page {currentPage} of {totalPages}</p>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
                        {error}
                    </div>
                )}

                {/* Users Table */}
                <div className="backdrop-blur-sm bg-gray-800/40 border border-gray-700 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-900/80 border-b border-gray-700">
                                    <th className="py-4 px-6 text-left">User</th>
                                    <th className="py-4 px-6 text-left">Email</th>
                                    <th className="py-4 px-6 text-left">Roles</th>
                                    <th className="py-4 px-6 text-left">Joined</th>
                                    <th className="py-4 px-6 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map((user) => (
                                    <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {user.profilePicture ? (
                                                    <img
                                                        src={user.profilePicture}
                                                        alt={user.username}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white">
                                                        {user.username[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{user.username}</p>
                                                    <p className="text-sm text-gray-400">
                                                        {user.firstname} {user.lastname}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">{user.email}</td>
                                        <td className="py-4 px-6">
                                            {editingUserId === user._id ? (
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => handleToggleRole(Role.USER)}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                            userRoles.includes(Role.USER)
                                                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                                                                : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        User
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleRole(Role.ADMIN)}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                            userRoles.includes(Role.ADMIN)
                                                                ? "bg-red-500/20 text-red-400 border border-red-500/50"
                                                                : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        Admin
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {user.roles.map((role) => (
                                                        <span
                                                            key={role}
                                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                                role === Role.ADMIN
                                                                    ? "bg-red-500/20 text-red-400 border border-red-500/50"
                                                                    : "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                                                            }`}
                                                        >
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {editingUserId === user._id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveRoles(user._id)}
                                                            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                                            title="Save"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingUserId(null)}
                                                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditRoles(user._id, user.roles)}
                                                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                                            title="Edit Roles"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id, user.username)}
                                                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Empty State */}
                    {paginatedUsers.length === 0 && (
                        <div className="text-center py-16">
                            <UserPlus size={64} className="mx-auto mb-4 text-gray-700" />
                            <p className="text-xl text-gray-400">
                                {searchTerm ? "No users found matching your search" : "No users found"}
                            </p>
                            <p className="text-gray-600">
                                {searchTerm ? "Try adjusting your search terms" : "No users have registered yet"}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {paginatedUsers.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        className="mt-8"
                    />
                )}
            </div>
        </div>
    )
}

export default AdminUsers
