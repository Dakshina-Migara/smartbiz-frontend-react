import './TextField.css'

function TextField({
    type = 'text',
    placeholder = '',
    value,
    onChange,
    icon,               // React node for the left icon
    name,
    id,
    disabled = false,
    required = false,
    fullWidth = false,
    className = '',
    ...props
}) {
    const wrapperClasses = [
        'textfield',
        fullWidth ? 'textfield--full-width' : '',
        disabled ? 'textfield--disabled' : '',
        className
    ].filter(Boolean).join(' ')

    return (
        <div className={wrapperClasses}>
            {icon && <span className="textfield__icon">{icon}</span>}
            <input
                type={type}
                className="textfield__input"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                id={id}
                disabled={disabled}
                required={required}
                {...props}
            />
        </div>
    )
}

export default TextField
