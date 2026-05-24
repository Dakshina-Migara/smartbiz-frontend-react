import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

export default function PublicRoute({ children }) {
    const { user, token, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return null
    }

    if (token && user) {
        // Authenticated: redirect to target or default home path based on role
        const userRole = user.role?.toUpperCase()
        const from = location.state?.from?.pathname || (userRole === 'ADMIN' ? '/admin/overview' : '/owner/dashboard')
        return <Navigate to={from} replace />
    }

    return children
}
