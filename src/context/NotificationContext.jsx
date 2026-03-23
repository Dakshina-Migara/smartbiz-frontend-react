import { createContext, useContext, useState, useCallback, useRef } from 'react'
import Modal from '../common/component/Modal/Modal'
import Button from '../common/component/Button/Button'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
    const [msg, setMsg] = useState(null)
    const [type, setType] = useState('info')
    const [isVisible, setIsVisible] = useState(false)
    const [confirmResolver, setConfirmResolver] = useState(null)
    const timeoutRef = useRef(null)

    const showNotification = useCallback((message, notificationType = 'info', duration = 4000) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        
        setMsg(message)
        setType(notificationType)
        setIsVisible(true)
        setConfirmResolver(null)

        if (duration > 0) {
            timeoutRef.current = setTimeout(() => {
                setIsVisible(false)
            }, duration)
        }
    }, [])

    const showConfirm = useCallback((message) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setMsg(message)
        setType('confirm')
        setIsVisible(true)
        
        return new Promise((resolve) => {
            setConfirmResolver(() => resolve)
        })
    }, [])

    const hideNotification = (result = false) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsVisible(false)
        if (confirmResolver) {
            confirmResolver(result)
            setConfirmResolver(null)
        }
    }

    const getIcon = () => {
        const iconStyle = { fontSize: '2.5rem', marginBottom: '16px' }
        switch (type) {
            case 'success': return <CheckCircleOutlineIcon sx={{ ...iconStyle, color: '#27ae60' }} />
            case 'error': return <ErrorOutlineIcon sx={{ ...iconStyle, color: '#e74c3c' }} />
            case 'confirm': return <HelpOutlineIcon sx={{ ...iconStyle, color: '#332e29' }} />
            default: return <InfoOutlinedIcon sx={{ ...iconStyle, color: '#3498db' }} />
        }
    }

    return (
        <NotificationContext.Provider value={{ showNotification, showConfirm }}>
            {children}
            <Modal
                isOpen={isVisible}
                onClose={() => hideNotification(false)}
                title={type === 'confirm' ? "Confirm Action" : "Notification"}
            >
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    {getIcon()}
                    <p style={{ 
                        fontSize: '1.1rem', 
                        color: '#4a5568', 
                        marginBottom: type === 'confirm' ? '32px' : '0',
                        fontWeight: 500
                    }}>
                        {msg}
                    </p>

                    {type === 'confirm' && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                            <Button variant="outlined" onClick={() => hideNotification(false)}>
                                Cancel
                            </Button>
                            <Button 
                                variant="filled" 
                                onClick={() => hideNotification(true)}
                                sx={{ backgroundColor: '#332e29', color: 'white' }}
                            >
                                CONFIRM
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}
