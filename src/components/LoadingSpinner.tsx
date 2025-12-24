import React from 'react'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    color?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color = 'text-green-500',
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    }[size]

    return (
        <div className="flex justify-center items-center">
            <div className={`${sizeClasses} border-4 border-t-4 ${color} border-solid rounded-full animate-spin`}></div>
        </div>
    )
}

export default LoadingSpinner
