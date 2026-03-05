import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined'
import Button from '../../common/component/Button/Button'
import TextField from '../../common/component/TextField/TextField'
import './ForgotPasswordPage.css'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleReset = () => {
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

        console.log('Password reset:', { email, newPassword })
        setSuccess(true)
    }

    return (
        <div className="forgot-page">
            <div className="forgot-card">
                <h1 className="forgot-card__title">Reset Password</h1>

                {!success ? (
                    <>
                        <p className="forgot-card__subtitle">
                            Enter your email and set a new password.
                        </p>

                        <div className="forgot-card__form">
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

                            {error && <p className="forgot-card__error">{error}</p>}

                            <Button variant="filled" fullWidth onClick={handleReset}>
                                Reset Password
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="forgot-card__success">
                        <div className="forgot-card__success-icon">✅</div>
                        <p className="forgot-card__success-text">
                            Your password has been reset successfully!
                        </p>
                    </div>
                )}

                <Link to="/login" className="forgot-card__back-link">
                    <Button variant="outlined" size="medium" fullWidth>
                        ← Back to Login
                    </Button>
                </Link>
            </div>
        </div>
    )
}
