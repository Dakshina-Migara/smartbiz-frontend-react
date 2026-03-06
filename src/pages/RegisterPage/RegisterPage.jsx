import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BusinessIcon from '@mui/icons-material/BusinessOutlined'
import LocationOnIcon from '@mui/icons-material/LocationOnOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '../../common/component/Button/Button'
import TextField from '../../common/component/TextField/TextField'
import { useAuth } from '../../context/AuthContext'
import './RegisterPage.css'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        businessName: '',
        businessAddress: '',
        ownerName: '',
        email: '',
        password: '',
        phone: '',
        role: ''
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { register } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handlePhoneChange = (e) => {
        const numericValue = e.target.value.replace(/\D/g, '')
        setFormData({ ...formData, phone: numericValue })
    }

    const handleRegister = async (e) => {
        if (e) e.preventDefault()
        setError('')

        // Explicit validation checks
        let missing = []
        if (!formData.businessName.trim()) missing.push('Business Name')
        if (!formData.businessAddress.trim()) missing.push('Address')
        if (!formData.ownerName.trim()) missing.push('Owner Name')
        if (!formData.email.trim()) missing.push('Email')
        if (!formData.password.trim()) missing.push('Password')
        if (!formData.phone.trim()) missing.push('Phone')
        if (!formData.role) missing.push('Role')

        if (missing.length > 0) {
            setError(`Missing required fields: ${missing.join(', ')}`)
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i
        if (!emailRegex.test(formData.email)) {
            setError('Email must contain "@" and end with ".com"')
            return
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.')
            return
        }

        setIsLoading(true)

        const result = await register(formData)

        if (result.success) {
            if (result.data.role === 'ADMIN') {
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
        <div className="register-page">
            <div className="register-card">
                <h1 className="register-card__title">Register</h1>

                <form className="register-card__form" onSubmit={handleRegister}>
                    {error && <div className="register-error-message">{error}</div>}

                    <TextField
                        icon={<BusinessIcon />}
                        placeholder="Business Name"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        icon={<LocationOnIcon />}
                        placeholder="Business Address"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        icon={<PersonOutlineIcon />}
                        placeholder="Owner Name"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        icon={<EmailOutlinedIcon />}
                        placeholder="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        type="password"
                        icon={<LockOutlinedIcon />}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        type="tel"
                        icon={<PhoneOutlinedIcon />}
                        placeholder="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        fullWidth
                    />

                    <FormControl fullWidth className="smartbiz-select">
                        <Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            displayEmpty
                            startAdornment={
                                <InputAdornment position="start">
                                    <span className="smartbiz-textfield__icon">
                                        <AdminPanelSettingsOutlinedIcon />
                                    </span>
                                </InputAdornment>
                            }
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <span className="smartbiz-select__placeholder">Select Role</span>
                                }
                                return selected
                            }}
                        >
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Owner">Owner</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="filled"
                        fullWidth
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </Button>

                    <p className="register-card__footer-text">Already have an account?</p>

                    <Link to="/login" className="register-card__login-link">
                        <Button variant="outlined" size="medium" fullWidth>
                            Login Here →
                        </Button>
                    </Link>
                </form>
            </div>
        </div>
    )
}
