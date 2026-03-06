import { useState } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { useAuth } from '../../../context/AuthContext'
import './AdminHeader.css'

export default function AdminHeader({ breadcrumb }) {
    const { logout } = useAuth()
    const [isSearchActive, setIsSearchActive] = useState(false)

    return (
        <header className="admin-header">
            <div className="admin-header__left">
                <div className="breadcrumb-pill">
                    <span className="breadcrumb-home">Admin</span>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{breadcrumb}</span>
                </div>
            </div>

            <div className="admin-header__right">
                <div className={`search-container ${isSearchActive ? 'active' : ''}`}>
                    <SearchOutlinedIcon className="search-icon" onClick={() => setIsSearchActive(!isSearchActive)} />
                    <input type="text" placeholder="Search data..." />
                </div>

                <div className="header-actions">
                    <button className="header-btn" title="Fullscreen">
                        <FullscreenOutlinedIcon />
                    </button>
                    <button className="header-btn" title="Notifications">
                        <NotificationsNoneOutlinedIcon />
                        <span className="badge">3</span>
                    </button>
                    <button className="header-btn" title="Settings">
                        <SettingsOutlinedIcon />
                    </button>

                    <div className="divider" />

                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )
}
