import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Button from '../../common/component/Button/Button'
import TextField from '../../common/component/TextField/TextField'
import { useAuth } from '../../context/AuthContext'
import './LoginPage.css'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        if (e) e.preventDefault()
        setError('')
        setFieldErrors({})

        // Custom Validation
        let errors = {}
        if (!email.trim()) errors.email = 'Email is required'
        if (!password.trim()) errors.password = 'Password is required'

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            setError('Please correct the highlighted fields.')
            return
        }

        setIsLoading(true)

        const result = await login(email, password)

        if (result.success) {
            // Check role and navigate accordingly
            const userRole = result.data.role?.toUpperCase()
            if (userRole === 'ADMIN') {
                navigate('/admin/dashboard')
            } else {
                navigate('/owner/dashboard')
            }
        } else {
            setError(result.message)
        }
        setIsLoading(false)
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-card__title">Login</h1>

                <form className="login-card__form" onSubmit={handleLogin}>
                    {error && <div className="login-error-message">{error}</div>}

                    <TextField
                        icon={<PersonOutlineIcon />}
                        placeholder="Type Your Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }))
                        }}
                        fullWidth
                        error={!!fieldErrors.email}
                        helperText={fieldErrors.email}
                    />

                    <TextField
                        type="password"
                        icon={<LockOutlinedIcon />}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }))
                        }}
                        fullWidth
                        error={!!fieldErrors.password}
                        helperText={fieldErrors.password}
                    />

                    <Button
                        variant="filled"
                        fullWidth
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>

                    <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                        <Button variant="text">
                            Forget Password/Email?
                        </Button>
                    </Link>
                </form>

                <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" size="medium">
                        Create Your Account→
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default LoginPage
