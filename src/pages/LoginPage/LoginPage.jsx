import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Button from '../../common/component/Button/Button'
import TextField from '../../common/component/TextField/TextField'
import { useAuth } from '../../context/AuthContext'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { login, user, token } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user && token && !isLoading) {
            const userRole = user.role?.toUpperCase()
            if (userRole === 'ADMIN') {
                navigate('/admin/overview')
            } else {
                navigate('/owner/dashboard')
            }
        }
    }, [user, token, navigate])

    const handleLogin = async (e) => {
        if (e) e.preventDefault()
        setError('')
        setFieldErrors({})

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
            const homePath = result.data.homePath
            if (homePath) {
                navigate(homePath)
            } else {
                const userRole = result.data.role?.toUpperCase()
                if (userRole === 'ADMIN') {
                    navigate('/admin/overview')
                } else {
                    navigate('/owner/dashboard')
                }
            }
        } else {
            setError(result.message)
        }
        setIsLoading(false)
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'background.default',
                p: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, sm: 5 },
                    borderRadius: '40px',
                    maxWidth: 420,
                    width: '100%',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Login
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    {error && (
                        <Typography
                            sx={{
                                color: '#e53e3e',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                textAlign: 'center',
                                backgroundColor: '#fef2f2',
                                p: 1.5,
                                borderRadius: '12px',
                            }}
                        >
                            {error}
                        </Typography>
                    )}

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
                            Forget Password?
                        </Button>
                    </Link>
                </Box>

                <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" size="medium">
                        Create Your Account→
                    </Button>
                </Link>
            </Paper>
        </Box>
    )
}

export default LoginPage
