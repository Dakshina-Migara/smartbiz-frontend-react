import { useLocation, useNavigate } from 'react-router-dom'
import './NavBar.css'

export default function NavBar({ items = [] }) {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <nav className="smartbiz-navbar">
            {items.map((item, index) => {
                const isActive = location.pathname === item.path
                return (
                    <button
                        key={index}
                        className={`smartbiz-navbar__item ${isActive ? 'smartbiz-navbar__item--active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="smartbiz-navbar__icon">{item.icon}</span>
                        <span className="smartbiz-navbar__label">{item.label}</span>
                    </button>
                )
            })}
        </nav>
    )
}
