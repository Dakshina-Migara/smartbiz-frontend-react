import { createContext, useContext, useState, useCallback } from 'react'
import Notification from '../common/component/Notification/Notification'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
    const [msg, setMsg] = useState(null)
    const [type, setType] = useState('info')
    const [isVisible, setIsVisible] = useState(false)
    const [confirmResolver, setConfirmResolver] = useState(null)

    const showNotification = useCallback((message, notificationType = 'info', duration = 4000) => {
        setMsg(message)
        setType(notificationType)
        setIsVisible(true)
        setConfirmResolver(null)

        if (duration > 0) {
            setTimeout(() => {
                setIsVisible(false)
            }, duration)
        }
    }, [])

    const showConfirm = useCallback((message) => {
        setMsg(message)
        setType('confirm')
        setIsVisible(true)
        
        return new Promise((resolve) => {
            setConfirmResolver(() => resolve)
        })
    }, [])

    const hideNotification = (result = false) => {
        setIsVisible(false)
        if (confirmResolver) {
            confirmResolver(result)
            setConfirmResolver(null)
        }
    }

    return (
        <NotificationContext.Provider value={{ showNotification, showConfirm }}>
            {children}
            {isVisible && (
                <Notification 
                    message={msg} 
                    type={type} 
                    onClose={() => hideNotification(false)} 
                    onConfirm={() => hideNotification(true)}
                />
            )}
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
