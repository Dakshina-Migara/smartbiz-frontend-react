import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import BusinessIcon from '@mui/icons-material/BusinessOutlined'
import LocationOnIcon from '@mui/icons-material/LocationOnOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import Button from '../../common/component/Button/Button'
import TextField from '../../common/component/TextField/TextField'
import { useAuth } from '../../context/AuthContext'

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
                navigate('/admin/overview')
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

        let errors = {}

        if (!formData.role) errors.role = 'Role is required'
        if (!formData.ownerName.trim()) errors.ownerName = 'Name is required'
        if (!formData.email.trim()) errors.email = 'Email is required'
        if (!formData.password.trim()) errors.password = 'Password is required'
        if (!formData.phone.trim()) errors.phone = 'Phone Number is required'

        if (formData.role === 'Owner') {
            if (!formData.businessName.trim()) errors.businessName = 'Business Name is required'
            if (!formData.businessAddress.trim()) errors.businessAddress = 'Business Address is required'
        }

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
                    Register
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleRegister}
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

                    {/* Step 1: Role Selection */}
                    <FormControl fullWidth error={!!fieldErrors.role}>
                        <Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            displayEmpty
                            startAdornment={
                                <InputAdornment position="start">
                                    <AdminPanelSettingsOutlinedIcon sx={{ color: '#7a6e64', width: 20, height: 20 }} />
                                </InputAdornment>
                            }
                            sx={{
                                backgroundColor: '#e8e0da',
                                borderRadius: '30px',
                                '& .MuiOutlinedInput-notchedOutline': { border: '2px solid transparent' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(61, 50, 41, 0.3)' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3d3229', borderWidth: '2px' },
                            }}
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <Typography sx={{ color: '#9a8e84' }}>Choose Account Type</Typography>
                                }
                                return selected
                            }}
                        >
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Owner">Owner</MenuItem>
                        </Select>
                        {fieldErrors.role && (
                            <Typography sx={{ color: '#e53e3e', fontSize: '0.75rem', ml: '14px', mt: '4px', fontWeight: 500 }}>
                                {fieldErrors.role}
                            </Typography>
                        )}
                    </FormControl>

                    {/* Step 2: Show User Information */}
                    {formData.role && (
                        <>
                            <TextField
                                icon={<PersonOutlineIcon />}
                                placeholder={formData.role === 'Admin' ? "Admin Name" : "Owner Name"}
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

                            {/* Step 3: Show Business Information only for Owner */}
                            {formData.role === 'Owner' && (
                                <>
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
                                </>
                            )}

                            <Button
                                variant="filled"
                                fullWidth
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Registering...' : 'Complete Registration'}
                            </Button>
                        </>
                    )}

                    {!formData.role && (
                        <Typography sx={{ textAlign: 'center', color: '#9a8e84', fontSize: '0.9rem' }}>
                            Please select an account type to continue
                        </Typography>
                    )}

                    <Typography sx={{ textAlign: 'center', color: '#7a6e64', fontSize: '0.9rem' }}>
                        Already have an account?
                    </Typography>

                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" size="medium" fullWidth>
                            Login Here →
                        </Button>
                    </Link>
                </Box>
            </Paper>
        </Box>
    )
}
