import { useState } from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined'
import Button from '../../common/component/Button/Button'
import TextField from '../../common/component/TextField/TextField'
import API from '../../api/axios'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleReset = async () => {
        setError('')

        if (!email) {
            setError('Please enter your email address.')
            return
        }
        if (!newPassword) {
            setError('Please enter a new password.')
            return
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)
        try {
            const response = await API.post('/auth/reset-password', {
                email,
                newPassword,
            })
            console.log('Password reset response:', response.data)
            setSuccess(true)
        } catch (err) {
            console.error('Password reset error:', err)
            const message =
                err.response?.data?.message || 'Failed to reset password. Please try again.'
            setError(message)
        } finally {
            setLoading(false)
        }
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
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Reset Password
                </Typography>

                {!success ? (
                    <>
                        <Typography sx={{ color: '#7a6e64', fontSize: '0.9rem', textAlign: 'center' }}>
                            Enter your email and set a new password.
                        </Typography>

                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                icon={<EmailOutlinedIcon />}
                                placeholder="Enter Your Email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                            />

                            <TextField
                                type="password"
                                icon={<LockOutlinedIcon />}
                                placeholder="New Password"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                            />

                            <TextField
                                type="password"
                                icon={<LockResetOutlinedIcon />}
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth
                            />

                            {error && (
                                <Typography sx={{ color: '#e53e3e', fontSize: '0.85rem', fontWeight: 500, textAlign: 'center' }}>
                                    {error}
                                </Typography>
                            )}

                            <Button
                                variant="filled"
                                fullWidth
                                onClick={handleReset}
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>✅</Typography>
                        <Typography sx={{ color: '#27ae60', fontWeight: 600, fontSize: '1.1rem' }}>
                            Your password has been reset successfully!
                        </Typography>
                    </Box>
                )}

                <Link to="/login" style={{ textDecoration: 'none', width: '100%' }}>
                    <Button variant="outlined" size="medium" fullWidth>
                        ← Back to Login
                    </Button>
                </Link>
            </Paper>
        </Box>
    )
}
