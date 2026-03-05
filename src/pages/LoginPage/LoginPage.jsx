import { useState } from 'react'
import Button from '../../common/component/Button/Button'
import TextField from '../../common/component/TextField/TextField'
import './LoginPage.css'

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .66.54 1.2 1.2 1.2h16.8c.66 0 1.2-.54 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
)

const LockIcon = () => (
    < svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" >
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
    </svg >
)

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
                        icon={<UserIcon />}
                        placeholder="Type Your User Name/Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        type="password"
                        icon={<LockIcon />}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />

                    <Button variant="filled" fullWidth onClick={handleLogin}>
                        Login
                    </Button>

                    <Button variant="text">
                        Forget Password/User Name?
                    </Button>
                </div>

                <Button variant="outlined" size="medium">
                    Create Your Account→
                </Button>
            </div>
        </div>
    )
}

export default LoginPage;
