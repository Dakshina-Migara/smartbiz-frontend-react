import MuiTextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import './TextField.css'

export default function TextField({
    type = 'text', placeholder = '', value, onChange, icon, name, id, disabled = false, required = false, fullWidth = false, className = '' }) {
    const classNames = [
        'smartbiz-textfield',
        disabled ? 'smartbiz-textfield--disabled' : '',
        className
    ].filter(Boolean).join(' ')

    return (
        <MuiTextField
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            id={id}
            disabled={disabled}
            required={required}
            fullWidth={fullWidth}
            variant="outlined"
            className={classNames}
            slotProps={{
                input: {
                    startAdornment: icon ? (
                        <InputAdornment position="start">
                            <span className="smartbiz-textfield__icon">{icon}</span>
                        </InputAdornment>
                    ) : null,
                }
            }}
        />
    )
}
