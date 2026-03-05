import { useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import './Modal.css'

export default function Modal({ isOpen, onClose, title, children }) {
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    if (!isOpen) return null

    return (
        <div className="smartbiz-modal-overlay" onClick={onClose}>
            <div className="smartbiz-modal-container" onClick={e => e.stopPropagation()}>
                <div className="smartbiz-modal-header">
                    <h2 className="smartbiz-modal-title">{title}</h2>
                    <button className="smartbiz-modal-close" onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="smartbiz-modal-body">
                    {children}
                </div>
            </div>
        </div>
    )
}
