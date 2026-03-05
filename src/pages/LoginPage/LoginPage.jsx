import { useState } from 'react'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Button from '../../common/component/Button/Button'
import TextField from '../../common/component/TextField/TextField'
import './LoginPage.css'

function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        console.log('Login:', { username, password })
    }

    return (
        <div className="login-page">
            <p className="login-page__label">Login Page</p>

            <div className="login-card">
                <h1 className="login-card__title">Login</h1>

                <div className="login-card__form">
                    <TextField
                        icon={<PersonOutlineIcon />}
                        placeholder="Type Your Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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

                    <Button variant="text">
                        Forget Password/Email?
                    </Button>
                </div>

                <Button variant="outlined" size="medium">
                    Create Your Account→
                </Button>
            </div>
        </div>
    )
}

export default LoginPage
