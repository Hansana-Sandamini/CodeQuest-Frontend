import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    className?: string
    required?: boolean
    disabled?: boolean
    name?: string
    autoFocus?: boolean
    minLength?: number
}

const PasswordInput = ({
    value,
    onChange,
    placeholder = "Password",
    className = "",
    required = false,
    disabled = false,
    name = "password",
    autoFocus = false,
    minLength,
}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 sm:py-4 text-white 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 
                    focus:border-transparent transition-all duration-300 pr-12 text-sm sm:text-base ${className}`}
                required={required}
                disabled={disabled}
                autoFocus={autoFocus}
                minLength={minLength}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                tabIndex={-1}
            >
                {showPassword ? <Eye size={18} className="sm:w-5 sm:h-5" /> : <EyeOff size={18} className="sm:w-5 sm:h-5" />}
            </button>
        </div>
    )
}

export default PasswordInput
