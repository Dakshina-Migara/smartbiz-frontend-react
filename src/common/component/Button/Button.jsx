import MuiButton from '@mui/material/Button'
import './Button.css'

export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'filled',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    startIcon,
    endIcon,
    className = '',
    ...props
}) {
    // Map our custom variants to MUI variants
    const muiVariantMap = {
        filled: 'contained',
        outlined: 'outlined',
        text: 'text',
        danger: 'contained'
    }

    const classNames = [
        'smartbiz-btn',
        `smartbiz-btn--${variant}`,
        `smartbiz-btn--${size}`,
        className
    ].filter(Boolean).join(' ')

    return (
        <MuiButton
            type={type}
            variant={muiVariantMap[variant] || 'contained'}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled}
            onClick={onClick}
            startIcon={startIcon}
            endIcon={endIcon}
            className={classNames}
            disableElevation
            {...props}
        >
            {children}
        </MuiButton>
    )
}