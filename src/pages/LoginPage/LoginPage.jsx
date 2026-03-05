import { useState } from 'react'
import { Link } from 'react-router-dom'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Button from '../../common/component/Button/Button'
import TextField from '../../common/component/TextField/TextField'
import './LoginPage.css'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        console.log('Login:', { email, password })
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-card__title">Login</h1>

                <div className="login-card__form">
                    <TextField
                        icon={<PersonOutlineIcon />}
                        placeholder="Type Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        type="password"
                        icon={<LockOutlinedIcon />}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />

                    <Button variant="filled" fullWidth onClick={handleLogin}>
                        Login
                    </Button>

                    <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                        <Button variant="text">
                            Forget Password/Email?
                        </Button>
                    </Link>
                </div>

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
