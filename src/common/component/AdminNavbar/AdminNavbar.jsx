import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useAuth } from '../../../context/AuthContext'
import Modal from '../Modal/Modal'
import Button from '../Button/Button'
import './AdminNavbar.css'

const navItems = [
    { label: 'Overview', icon: <BarChartOutlinedIcon />, path: '/admin/overview' },
    { label: 'Businesses', icon: <BusinessOutlinedIcon />, path: '/admin/businesses' },
    { label: 'Usage Logs', icon: <AssessmentOutlinedIcon />, path: '/admin/logs' },
    { label: 'Plans', icon: <CardMembershipOutlinedIcon />, path: '/admin/plans' },
]

export default function AdminNavbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout } = useAuth()
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const navbarRef = useRef(null)

    useEffect(() => {
        if (navbarRef.current) {
            const activeItem = navbarRef.current.querySelector('.admin-navbar__item--active')
            if (activeItem) {
                activeItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                })
            }
        }
    }, [location.pathname])

    return (
        <>
            <nav className="admin-navbar" ref={navbarRef}>
                {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path
                    return (
                        <button
                            key={index}
                            className={`admin-navbar__item ${isActive ? 'admin-navbar__item--active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="admin-navbar__icon">{item.icon}</span>
                            <span className="admin-navbar__label">{item.label}</span>
                        </button>
                    )
                })}

                <div className="admin-navbar__divider" />

                <button
                    className="admin-navbar__item admin-navbar__item--logout"
                    onClick={() => setIsLogoutModalOpen(true)}
                >
                    <span className="admin-navbar__icon"><LogoutOutlinedIcon /></span>
                    <span className="admin-navbar__label">Logout</span>
                </button>
            </nav>

            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="Confirm Logout"
            >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ paddingBottom: '24px', fontSize: '15px', color: '#4a5568' }}>
                        Are you sure you want to log out of your Admin account?
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <Button
                            variant="outlined"
                            onClick={() => setIsLogoutModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            onClick={() => logout()}
                            sx={{ backgroundColor: '#e53e3e', color: 'white' }}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
