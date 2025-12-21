import { useEffect, useState } from "react"
import { useUsers } from "../../hooks/useUsers"
import { UserPlus, Trash2, Edit, Save, X } from "lucide-react"
import { Role } from "../../types/User"
import { usePagination } from "../../hooks/usePagination"
import SearchBar from "../../components/SearchBar"
import Pagination from "../../components/Pagination"
import Avatar from "../../components/Avatar"

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
                <div className="text-xl lg:text-2xl text-gray-400 animate-pulse">Loading users...</div>
            </div>
        )
    }

    return (
        <div className="lg:ml-64 lg:ml-74 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 lg:py-16 xl:py-20 px-3 lg:px-6 xl:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                 <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 mb-6 lg:mb-10 xl:mb-12 border-b border-gray-700 pb-4 lg:pb-6">
                    <div>
                        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 lg:mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            Manage Users
                        </h1>
                        <p className="text-gray-400 text-sm lg:text-base xl:text-lg">
                            Manage all registered users and their permissions
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6 lg:mb-8">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search users by name, email, or username..."
                        className="w-full"
                    />
                    <div className="mt-3 lg:mt-4 flex flex-wrap items-center justify-between text-gray-400 text-xs lg:text-sm xl:text-base">
                        <p>
                            Showing {paginatedUsers.length} of {filteredUsers.length} users
                            {searchTerm && (
                                <span> for "<span className="text-green-400">{searchTerm}</span>"</span>
                            )}
                        </p>
                        {filteredUsers.length > ITEMS_PER_PAGE && (
                            <p className="mt-1 lg:mt-0">Page {currentPage} of {totalPages}</p>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-red-500/20 border border-red-500/50 rounded-lg lg:rounded-xl text-red-400 text-sm lg:text-base">
                        {error}
                    </div>
                )}

                {/* Users Table */}
                <div className="backdrop-blur-sm bg-gray-800/40 border border-gray-700 rounded-lg lg:rounded-xl xl:rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto -mx-3 lg:mx-0">
                        <table className="w-full min-w-[768px] lg:min-w-0">
                            <thead>
                                <tr className="bg-gray-900/80 border-b border-gray-700">
                                    <th className="py-3 px-3 lg:py-3 lg:px-4 xl:py-4 xl:px-6 text-left text-sm lg:text-base">User</th>
                                    <th className="py-3 px-3 lg:py-3 lg:px-4 xl:py-4 xl:px-6 text-left text-sm lg:text-base">Email</th>
                                    <th className="py-3 px-3 lg:py-3 lg:px-4 xl:py-4 xl:px-6 text-left text-sm lg:text-base">Roles</th>
                                    <th className="py-3 px-3 lg:py-3 lg:px-4 xl:py-4 xl:px-6 text-left text-sm lg:text-base">Joined</th>
                                    <th className="py-3 px-3 lg:py-3 lg:px-4 xl:py-4 xl:px-6 text-left text-sm lg:text-base">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map((user) => (
                                    <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                                        <td className="py-3 px-3 lg:py-3 lg:px-4 xl:py-4 xl:px-6">
                                            <div className="flex items-center gap-2 lg:gap-3">
                                                <Avatar 
                                                    src={user.profilePicture}
                                                    username={user.username}
                                                    size="sm"
                                                    ring
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm lg:text-base truncate">{user.username}</p>
                                                    <p className="text-gray-400 text-xs lg:text-sm truncate">
                                                        {user.firstname} {user.lastname}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 lg:py-3 lg:px-4 xl:py-4 xl:px-6 text-sm lg:text-base">
                                            <div className="truncate max-w-[120px] lg:max-w-[150px] xl:max-w-none">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 lg:py-3 lg:px-4 xl:py-4 xl:px-6">
                                            {editingUserId === user._id ? (
                                                <div className="flex flex-wrap gap-1 lg:gap-2">
                                                    <button
                                                        onClick={() => handleToggleRole(Role.USER)}
                                                        className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium transition-colors ${
                                                            userRoles.includes(Role.USER)
                                                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                                                                : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        User
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleRole(Role.ADMIN)}
                                                        className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium transition-colors ${
                                                            userRoles.includes(Role.ADMIN)
                                                                ? "bg-red-500/20 text-red-400 border border-red-500/50"
                                                                : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        Admin
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-1 lg:gap-2">
                                                    {user.roles.map((role) => (
                                                        <span
                                                            key={role}
                                                            className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium ${
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
                                        <td className="py-3 px-3 lg:py-3 lg:px-4 xl:py-4 xl:px-6 text-gray-400 text-sm lg:text-base">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-3 lg:py-3 lg:px-4 xl:py-4 xl:px-6">
                                            <div className="flex items-center gap-1 lg:gap-2">
                                                {editingUserId === user._id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveRoles(user._id)}
                                                            className="p-1.5 lg:p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                                            title="Save"
                                                        >
                                                            <Save className="w-3 h-3 lg:w-4 lg:h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingUserId(null)}
                                                            className="p-1.5 lg:p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-3 h-3 lg:w-4 lg:h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditRoles(user._id, user.roles)}
                                                            className="p-1.5 lg:p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                                            title="Edit Roles"
                                                        >
                                                            <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id, user.username)}
                                                            className="p-1.5 lg:p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
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
                        <div className="text-center py-12 lg:py-16 px-4">
                            <UserPlus className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 mx-auto mb-4 text-gray-700" />
                            <p className="text-lg lg:text-xl xl:text-2xl text-gray-400 mb-2">
                                {searchTerm ? "No users found matching your search" : "No users found"}
                            </p>
                            <p className="text-gray-600 text-sm lg:text-base">
                                {searchTerm ? "Try adjusting your search terms" : "No users have registered yet"}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="mt-4 lg:mt-6 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg lg:rounded-xl font-medium text-sm lg:text-base hover:from-green-700 hover:to-blue-700 transition"
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
                        className="mt-6 lg:mt-8 xl:mt-10"
                    />
                )}
            </div>
        </div>
    )
}

export default AdminUsers
