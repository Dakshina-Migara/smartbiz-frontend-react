import AdminNavbar from '../AdminNavbar/AdminNavbar'
import './AdminLayout.css'

export default function AdminLayout({ children, breadcrumb }) {
    return (
        <div className="admin-layout">
            <div className="admin-layout__header">
                <h2 className="admin-layout__breadcrumb">{breadcrumb}</h2>
            </div>

            <div className="admin-layout__card">
                <AdminNavbar />
                <div className="admin-layout__content">
                    {children}
                </div>
            </div>
        </div>
    )
}
