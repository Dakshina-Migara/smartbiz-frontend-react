import { useState } from 'react'
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
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import GroupIcon from '@mui/icons-material/Group'
import InventoryIcon from '@mui/icons-material/Inventory'
import StatCard from '../../../common/component/StatCard/StatCard'
import DataTable from '../../../common/component/DataTable/DataTable'
import './BusinessOwnerDashboard.css'

const sidebarItems = [
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

const productColumns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (val) => `$${val.toFixed(2)}` },
    { key: 'cost', label: 'Cost', render: (val) => `$${val.toFixed(2)}` },
    { key: 'stock', label: 'Stock' },
    {
        key: 'status', label: 'Status', render: (val) => {
            const statusClass = val === 'In Stock'
                ? 'smartbiz-table__status--in-stock'
                : val === 'Low Stock'
                    ? 'smartbiz-table__status--low-stock'
                    : 'smartbiz-table__status--out-of-stock'
            return <span className={`smartbiz-table__status ${statusClass}`}>{val}</span>
        }
    }
]

const sampleProducts = [
    { name: 'Wireless Mouse', sku: 'WM-001', category: 'Electronics', price: 29.99, cost: 15.00, stock: 45, status: 'In Stock' },
    { name: 'USB-C Cable', sku: 'UC-002', category: 'Electronics', price: 12.99, cost: 5.50, stock: 120, status: 'In Stock' },
    { name: 'Laptop Stand', sku: 'LS-003', category: 'Accessories', price: 49.99, cost: 25.00, stock: 8, status: 'Low Stock' },
]

export default function BusinessOwnerDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div className="dashboard-layout">
            {/* Sidebar Overlay for mobile */}
            {sidebarOpen && (
                <div className="dashboard-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${sidebarOpen ? 'dashboard-sidebar--open' : ''}`}>
                <div className="dashboard-sidebar__brand">
                    <span className="dashboard-sidebar__logo">S</span>
                    <span className="dashboard-sidebar__brand-name">SmartBiz</span>
                </div>

                <nav className="dashboard-sidebar__nav">
                    {sidebarItems.map((item, index) => {
                        const isActive = location.pathname === item.path
                        return (
                            <button
                                key={index}
                                className={`dashboard-sidebar__nav-item ${isActive ? 'dashboard-sidebar__nav-item--active' : ''}`}
                                onClick={() => {
                                    navigate(item.path)
                                    setSidebarOpen(false)
                                }}
                            >
                                <span className="dashboard-sidebar__nav-icon">{item.icon}</span>
                                <span className="dashboard-sidebar__nav-label">{item.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Top Header */}
                <header className="dashboard-header">
                    <button className="dashboard-header__menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                    <div className="dashboard-header__info">
                        <h1 className="dashboard-header__title">Dashboard</h1>
                        <p className="dashboard-header__subtitle">Welcome back! Here's your business overview.</p>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="dashboard-stats-grid">
                    <StatCard
                        title="Total Revenue"
                        value="$300.36"
                        subtitle="From 3 sales"
                        icon={<TrendingUpIcon />}
                        iconColor="#27ae60"
                    />
                    <StatCard
                        title="Total Expenses"
                        value="$3,260.36"
                        subtitle="Tracked expenses"
                        icon={<TrendingDownIcon />}
                        iconColor="#e67e22"
                    />
                    <StatCard
                        title="Net Profit"
                        value="$-3,000.36"
                        subtitle="612.4% margin"
                        valueColor="#e74c3c"
                        icon={<TrendingDownIcon />}
                        iconColor="#e74c3c"
                    />
                    <StatCard
                        title="Low Stock Alerts"
                        value="1"
                        subtitle="Items below minimum"
                        icon={<WarningAmberIcon />}
                        iconColor="#f39c12"
                    />
                    <StatCard
                        title="Total Customers"
                        value="4"
                        subtitle="Active customers"
                        icon={<GroupIcon />}
                        iconColor="#3498db"
                    />
                    <StatCard
                        title="Inventory Value"
                        value="N/A"
                        subtitle="Total stock value"
                        icon={<InventoryIcon />}
                        iconColor="#9b59b6"
                    />
                </div>

                {/* Table Section */}
                <div className="dashboard-section">
                    <h2 className="dashboard-section__title">Products Overview</h2>
                    <DataTable columns={productColumns} data={sampleProducts} />
                </div>
            </main>
        </div>
    )
}
