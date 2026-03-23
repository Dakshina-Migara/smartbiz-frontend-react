import './Notification.css'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

export default function Notification({ message, type = 'info', onClose, onConfirm }) {
    if (!message) return null

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircleOutlineIcon className="notification-icon--success" />
            case 'error': return <ErrorOutlineIcon className="notification-icon--error" />
            case 'confirm': return <HelpOutlineIcon className="notification-icon--confirm" />
            default: return <InfoOutlinedIcon className="notification-icon--info" />
        }
    }

    return (
        <div className="notification-overlay">
            <div className={`notification-container notification-container--${type}`}>
                <div className="notification-main">
                    <div className="notification-content">
                        {getIcon()}
                        <span className="notification-message">{message}</span>
                    </div>
                    {type !== 'confirm' && (
                        <button className="notification-close" onClick={onClose}>
                            <CloseIcon />
                        </button>
                    )}
                </div>

                {type === 'confirm' && (
                    <div className="notification-actions">
                        <button className="confirm-btn cancel" onClick={onClose}>Cancel</button>
                        <button className="confirm-btn confirm" onClick={onConfirm}>Confirm</button>
                    </div>
                )}
            </div>
        </div>
    )
}
