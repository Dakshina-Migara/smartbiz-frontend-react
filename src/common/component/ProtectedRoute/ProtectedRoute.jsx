import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, token, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return null
    }

    if (!token || !user) {
        // Not authenticated: redirect to login and preserve intended location
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    const userRole = user.role?.toUpperCase()

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Authenticated but unauthorized: redirect to appropriate default page
        if (userRole === 'ADMIN') {
            return <Navigate to="/admin/overview" replace />
        } else {
            return <Navigate to="/owner/dashboard" replace />
        }
    }

    return children
}
