import { useState } from 'react'
import AdminSidebar from '../AdminSidebar/AdminSidebar'
import AdminHeader from '../AdminHeader/AdminHeader'
import './AdminLayout.css'

export default function AdminLayout({ children, breadcrumb }) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className={`admin-app-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
            <AdminSidebar
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />

            <main className="admin-main-wrapper">
                <AdminHeader breadcrumb={breadcrumb} />

                <div className="admin-content-area">
                    {children}
                </div>

                <footer className="admin-footer-copyright">
                    © 2026 SmartBiz Systems. All Rights Reserved.
                </footer>
            </main>
        </div>
    )
}
