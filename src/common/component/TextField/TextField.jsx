import { useState } from 'react'
import MuiTextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

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
    helperText = '',
    multiline = false,
    rows,
    sx = {},
    ...rest
}) {
    const [showPassword, setShowPassword] = useState(false)
    const isPasswordField = type === 'password'

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
            className={className}
            multiline={multiline}
            rows={rows}
            sx={{
                opacity: disabled ? 0.5 : 1,
                '& .Mui-error .MuiInputAdornment-root .MuiSvgIcon-root': {
                    color: '#e53e3e',
                },
                '& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root': {
                    color: '#3d3229',
                },
                '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                    width: 20,
                    height: 20,
                    color: '#7a6e64',
                    transition: 'color 0.3s ease',
                },
                ...sx,
            }}
            slotProps={{
                inputLabel: {
                    shrink: true,
                },
                input: {
                    startAdornment: icon ? (
                        <InputAdornment position="start">
                            {icon}
                        </InputAdornment>
                    ) : null,
                    endAdornment: isPasswordField ? (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{
                                    color: '#7a6e64',
                                    transition: 'color 0.3s ease',
                                    '&:hover': {
                                        color: '#3d3229',
                                        backgroundColor: 'rgba(61, 50, 41, 0.08)',
                                    },
                                }}
                            >
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </InputAdornment>
                    ) : null,
                },
            }}
            {...rest}
        />
    )
}
