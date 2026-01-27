import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'professor') return <Navigate to="/professor/dashboard" replace />
    if (user.role === 'hod') return <Navigate to="/hod/dashboard" replace />
    if (user.role === 'student') return <Navigate to="/student/dashboard" replace />
    return <Navigate to="/home" replace />
  }

  return children
}

export default PrivateRoute
