import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/redux'
import { loadProfileAction } from '../../features/auth/authActions'
import swal from '../../utils/swal'
import LoadingSpinner from '../../components/LoadingSpinner'

const GoogleCallback = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useAppDispatch()

    useEffect(() => {
        const handleGoogleLogin = async () => {
            try {
                const params = new URLSearchParams(location.search)
                const accessToken = params.get('access')
                const refreshToken = params.get('refresh')
                const error = params.get('error')

                // Handle backend rejection (no account found)
                if (error === 'google_noaccount') {
                    throw new Error(
                        'No account found for this Google email. Please register first using email and password.'
                    )
                }

                if (!accessToken || !refreshToken) {
                    throw new Error('Authentication failed - no tokens received')
                }

                // Save tokens
                localStorage.setItem('accessToken', accessToken)
                localStorage.setItem('refreshToken', refreshToken)

                // Load profile
                await dispatch(loadProfileAction()).unwrap()

                // Success
                swal.fire({
                    icon: 'success',
                    title: 'Welcome!',
                    text: 'Successfully logged in with Google!',
                    timer: 2000,
                    showConfirmButton: false,
                    position: 'top-end',
                    toast: true,
                })

                navigate('/dashboard', { replace: true })
                window.history.replaceState({}, document.title, window.location.pathname)
                
            } catch (err: any) {
                console.error('Google login error:', err)

                // Show nice error message
                swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: err.message || 'Something went wrong with Google login. Please try again.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#10B981',
                })

                navigate('/login', { replace: true })
            }
        }
        handleGoogleLogin()
        
    }, [dispatch, location.search, navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="text-center space-y-6">
                <LoadingSpinner size="lg" />
                <p className="text-xl text-gray-300">Finalizing your Google login...</p>
            </div>
        </div>
    )
}

export default GoogleCallback
