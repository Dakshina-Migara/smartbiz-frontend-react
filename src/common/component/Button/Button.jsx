import './Button.css'

function Button({
    children,
    onClick,
    type = 'button',
    variant = 'filled',  // 'filled' | 'outlined' | 'text'
    size = 'medium',      // 'small' | 'medium' | 'large'
    fullWidth = false,
    disabled = false,
    className = '',
    ...props
}) {
    const classNames = [
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth ? 'btn--full-width' : '',
        className
    ].filter(Boolean).join(' ')

    return (
        <button
            type={type}
            className={classNames}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
