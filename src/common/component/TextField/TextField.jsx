import { useState } from 'react'
import MuiTextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import './TextField.css'

export default function TextField({
    type = 'text',
    placeholder = '',
    value,
    onChange,
    icon,
    name,
    id,
    disabled = false,
    required = false,
    fullWidth = false,
    className = '',
    label,
    error = false,
    helperText = ''
}) {

    const [showPassword, setShowPassword] = useState(false)
    const isPasswordField = type === 'password'

    const classNames = [
        'smartbiz-textfield',
        disabled ? 'smartbiz-textfield--disabled' : '',
        className
    ].filter(Boolean).join(' ')

    return (
        <MuiTextField
            type={isPasswordField && showPassword ? 'text' : type}
            label={label}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            id={id}
            disabled={disabled}
            required={required}
            fullWidth={fullWidth}
            error={error}
            helperText={helperText}
            variant="outlined"
            className={classNames}
            slotProps={{
                inputLabel: {
                    shrink: true,
                },
                input: {
                    startAdornment: icon ? (
                        <InputAdornment position="start">
                            <span className="smartbiz-textfield__icon">{icon}</span>
                        </InputAdornment>
                    ) : null,
                    endAdornment: isPasswordField ? (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                className="smartbiz-textfield__eye-btn"
                            >
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </InputAdornment>
                    ) : null,
                }
            }}
        />
    )
}
