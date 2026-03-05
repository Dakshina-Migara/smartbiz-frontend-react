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
]

export default function OwnerNavbar() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <nav className="owner-navbar">
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
        </nav>
    )
}
