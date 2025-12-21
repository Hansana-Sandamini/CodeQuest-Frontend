import { User } from "lucide-react"
import { useState } from "react"

interface AvatarProps {
    src?: string | null
    username?: string
    size?: "sm" | "md" | "lg"
    ring?: boolean
}

const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
}

const Avatar = ({
    src,
    username,
    size = "md",
    ring = false,
}: AvatarProps) => {
    const [imgError, setImgError] = useState(false)
    const initial = username?.charAt(0).toUpperCase()

    const showImage = src && !imgError

    return (
        <div
            className={`
                ${sizeClasses[size]}
                rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 font-bold text-white overflow-hidden
                ${ring ? "ring-2 ring-green-500" : ""}
            `}
        >
            {showImage ? (
                <img
                    src={src}
                    alt={username || "User"}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                />
            ) : initial ? (
                <span className="text-white">
                    {initial}
                </span>
            ) : (
                <User className="text-white" size={18} />
            )}
        </div>
    )
}

export default Avatar
