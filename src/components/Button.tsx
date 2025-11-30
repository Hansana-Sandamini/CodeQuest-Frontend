type ButtonProps = {
    children: React.ReactNode
    type?: "button" | "submit" | "reset"
    onClick?: () => void
    disabled?: boolean
    className?: string
}

const Button = ({ children, type = "button", onClick, disabled, className = "" }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                w-full bg-linear-to-r from-green-600 to-blue-600 
                hover:from-green-700 hover:to-blue-700 
                text-white font-semibold py-4 rounded-xl 
                transition-all duration-300 transform hover:scale-105 
                shadow-lg hover:shadow-green-500/25 disabled:opacity-50 
                disabled:cursor-not-allowed"
                ${className}
            `}
        >
            {children}
        </button>
    )
}

export default Button
