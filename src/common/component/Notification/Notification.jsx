import './Notification.css'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

export default function Notification({ message, type = 'info', onClose }) {
    if (!message) return null

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircleOutlineIcon className="notification-icon--success" />
            case 'error': return <ErrorOutlineIcon className="notification-icon--error" />
            default: return <InfoOutlinedIcon className="notification-icon--info" />
        }
    }

    return (
        <div className="notification-overlay">
            <div className={`notification-container notification-container--${type}`}>
                <div className="notification-content">
                    {getIcon()}
                    <span className="notification-message">{message}</span>
                </div>
                <button className="notification-close" onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>
        </div>
    )
}
