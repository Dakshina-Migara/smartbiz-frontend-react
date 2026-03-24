import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useAuth } from '../../../context/AuthContext'
import Modal from '../Modal/Modal'
import Button from '../Button/Button'
import './OwnerNavbar.css'

const navItems = [
    { label: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/owner/dashboard' },
    { label: 'Products', icon: <Inventory2OutlinedIcon />, path: '/owner/products' },
    { label: 'Inventory', icon: <WarehouseOutlinedIcon />, path: '/owner/inventory' },
    { label: 'Customers', icon: <PeopleOutlinedIcon />, path: '/owner/customers' },
    { label: 'Suppliers', icon: <LocalShippingOutlinedIcon />, path: '/owner/suppliers' },
    { label: 'Sales', icon: <PointOfSaleOutlinedIcon />, path: '/owner/sales' },
    { label: 'Transactions', icon: <ReceiptLongOutlinedIcon />, path: '/owner/transactions' },
    { label: 'Reports', icon: <AssessmentOutlinedIcon />, path: '/owner/reports' },
    { label: 'AI-Insight', icon: <AutoAwesomeOutlinedIcon />, path: '/owner/ai-insight' },
    { label: 'Subscription', icon: <CardMembershipOutlinedIcon />, path: '/owner/subscription' },
]

export default function OwnerNavbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout } = useAuth()
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const navbarRef = useRef(null)

    useEffect(() => {
        if (navbarRef.current) {
            const activeItem = navbarRef.current.querySelector('.owner-navbar__item--active')
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
            <nav className="owner-navbar" ref={navbarRef}>
                {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path
                    return (
                        <button
                            key={index}
                            className={`owner-navbar__item ${isActive ? 'owner-navbar__item--active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="owner-navbar__icon">{item.icon}</span>
                            <span className="owner-navbar__label">{item.label}</span>
                        </button>
                    )
                })}

                <div className="owner-navbar__divider" />

                <button
                    className="owner-navbar__item owner-navbar__item--logout"
                    onClick={() => setIsLogoutModalOpen(true)}
                >
                    <span className="owner-navbar__icon"><LogoutOutlinedIcon /></span>
                    <span className="owner-navbar__label">Logout</span>
                </button>
            </nav>

            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="Confirm Logout"
            >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ paddingBottom: '24px', fontSize: '15px', color: '#4a5568' }}>
                        Are you sure you want to log out of your account?
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
