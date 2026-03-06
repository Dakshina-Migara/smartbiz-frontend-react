import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import MenuIcon from '@mui/icons-material/Menu'
import './AdminSidebar.css'

const navItems = [
    { label: 'Overview', icon: <BarChartOutlinedIcon />, path: '/admin/overview' },
    { label: 'Businesses', icon: <BusinessOutlinedIcon />, path: '/admin/businesses' },
    { label: 'Usage Logs', icon: <AssessmentOutlinedIcon />, path: '/admin/logs' },
    { label: 'Plans', icon: <CardMembershipOutlinedIcon />, path: '/admin/plans' },
]

export default function AdminSidebar({ isCollapsed, onToggle }) {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="admin-sidebar__logo-container">
                <div className="admin-sidebar__logo">
                    <span className="logo-icon">S</span>
                    {!isCollapsed && <span className="logo-text">SmartBiz<span>Admin</span></span>}
                </div>
                <button className="admin-sidebar__toggle" onClick={onToggle}>
                    {isCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
                </button>
            </div>

            <nav className="admin-sidebar__nav">
                <div className="nav-header">{!isCollapsed && "Dashboard"}</div>
                {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path
                    return (
                        <button
                            key={index}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                            title={isCollapsed ? item.label : ''}
                        >
                            <span className="nav-item__icon">{item.icon}</span>
                            {!isCollapsed && <span className="nav-item__label">{item.label}</span>}
                            {isActive && !isCollapsed && <div className="active-glow" />}
                        </button>
                    )
                })}
            </nav>

            <div className="admin-sidebar__footer">
                {!isCollapsed && (
                    <div className="user-profile-summary">
                        <div className="user-avatar">AD</div>
                        <div className="user-info">
                            <span className="user-name">Admin User</span>
                            <span className="user-role">Super Admin</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    )
}
