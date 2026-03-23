import { createContext, useContext, useState, useCallback } from 'react'
import Notification from '../common/component/Notification/Notification'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
    const [msg, setMsg] = useState(null)
    const [type, setType] = useState('info')
    const [isVisible, setIsVisible] = useState(false)

    const showNotification = useCallback((message, notificationType = 'info', duration = 4000) => {
        setMsg(message)
        setType(notificationType)
        setIsVisible(true)

        if (duration > 0) {
            setTimeout(() => {
                setIsVisible(false)
            }, duration)
        }
    }, [])

    const hideNotification = () => setIsVisible(false)

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {isVisible && <Notification message={msg} type={type} onClose={hideNotification} />}
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
