import MuiButton from '@mui/material/Button'

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
    sx = {},
    ...props
}) {
    const muiVariantMap = {
        filled: 'contained',
        outlined: 'outlined',
        text: 'text',
        danger: 'contained'
    }

    const dangerSx = variant === 'danger' ? {
        backgroundColor: '#ef4444',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
        '&:hover': {
            backgroundColor: '#dc2626',
            boxShadow: '0 6px 18px rgba(239, 68, 68, 0.45)',
            transform: 'translateY(-1px)',
        },
        '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
        },
    } : {}

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
            className={className}
            disableElevation
            sx={{ ...dangerSx, ...sx }}
            {...props}
        >
            {children}
        </MuiButton>
    )
}