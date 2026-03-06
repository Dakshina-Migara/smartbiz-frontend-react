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
    const [fieldErrors, setFieldErrors] = useState({})
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { register, user, token } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user && token && !isLoading) {
            const userRole = user.role?.toUpperCase()
            if (userRole === 'ADMIN') {
                navigate('/admin/dashboard')
            } else {
                navigate('/owner/dashboard')
            }
        }
    }, [user, token, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handlePhoneChange = (e) => {
        const numericValue = e.target.value.replace(/\D/g, '')
        setFormData({ ...formData, phone: numericValue })
        if (fieldErrors.phone) {
            setFieldErrors(prev => ({ ...prev, phone: '' }))
        }
    }

    const handleRegister = async (e) => {
        if (e) e.preventDefault()
        setError('')
        setFieldErrors({})

        // Explicit validation checks
        let errors = {}
        if (!formData.businessName.trim()) errors.businessName = 'Business Name is required'
        if (!formData.businessAddress.trim()) errors.businessAddress = 'Business Address is required'
        if (!formData.ownerName.trim()) errors.ownerName = 'Owner Name is required'
        if (!formData.email.trim()) errors.email = 'Email is required'
        if (!formData.password.trim()) errors.password = 'Password is required'
        if (!formData.phone.trim()) errors.phone = 'Phone Number is required'
        if (!formData.role) errors.role = 'Role is required'

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            setError('Please fix the errors below.')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i
        if (!emailRegex.test(formData.email)) {
            setFieldErrors({ email: 'Email must contain "@" and end with ".com"' })
            setError('Invalid email format.')
            return
        }

        if (formData.password.length < 8) {
            setFieldErrors({ password: 'Password must be at least 8 characters long.' })
            setError('Password too short.')
            return
        }

        setIsLoading(true)

        const result = await register(formData)

        if (result.success) {
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
                        error={!!fieldErrors.businessName}
                        helperText={fieldErrors.businessName}
                    />

                    <TextField
                        icon={<LocationOnIcon />}
                        placeholder="Business Address"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleChange}
                        fullWidth
                        error={!!fieldErrors.businessAddress}
                        helperText={fieldErrors.businessAddress}
                    />

                    <TextField
                        icon={<PersonOutlineIcon />}
                        placeholder="Owner Name"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        fullWidth
                        error={!!fieldErrors.ownerName}
                        helperText={fieldErrors.ownerName}
                    />

                    <TextField
                        icon={<EmailOutlinedIcon />}
                        placeholder="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        error={!!fieldErrors.email}
                        helperText={fieldErrors.email}
                    />

                    <TextField
                        type="password"
                        icon={<LockOutlinedIcon />}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        error={!!fieldErrors.password}
                        helperText={fieldErrors.password}
                    />

                    <TextField
                        type="tel"
                        icon={<PhoneOutlinedIcon />}
                        placeholder="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        fullWidth
                        error={!!fieldErrors.phone}
                        helperText={fieldErrors.phone}
                    />

                    <FormControl fullWidth className="smartbiz-select" error={!!fieldErrors.role}>
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
