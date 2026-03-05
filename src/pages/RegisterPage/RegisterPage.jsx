import { useState } from 'react'
import { Link } from 'react-router-dom'
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handlePhoneChange = (e) => {
        const numericValue = e.target.value.replace(/\D/g, '')
        setFormData({ ...formData, phone: numericValue })
    }

    const handleRegister = () => {
        console.log('Register:', formData)
    }

    return (
        <div className="register-page">
            <div className="register-card">
                <h1 className="register-card__title">Register</h1>

                <div className="register-card__form">
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

                    <Button variant="filled" fullWidth onClick={handleRegister}>
                        Register
                    </Button>

                    <p className="register-card__footer-text">Already have an account?</p>

                    <Link to="/login" className="register-card__login-link">
                        <Button variant="outlined" size="medium" fullWidth>
                            Login Here →
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
