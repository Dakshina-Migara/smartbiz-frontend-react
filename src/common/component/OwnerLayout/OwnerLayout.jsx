import OwnerNavbar from '../OwnerNavbar/OwnerNavbar'
import './OwnerLayout.css'

export default function OwnerLayout({ children, breadcrumb }) {
    return (
        <div className="owner-layout">
            <div className="owner-layout__header">
                <h2 className="owner-layout__breadcrumb">{breadcrumb}</h2>
            </div>

            <div className="owner-layout__card">
                <OwnerNavbar />
                <div className="owner-layout__content">
                    {children}
                </div>
            </div>
        </div>
    )
}
