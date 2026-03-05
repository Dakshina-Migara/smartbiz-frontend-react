import './StatCard.css'

export default function StatCard({ title, value, subtitle, valueColor, icon, iconColor }) {
    return (
        <div className="smartbiz-stat-card">
            <div className="smartbiz-stat-card__top">
                <span className="smartbiz-stat-card__title">{title}</span>
                {icon && (
                    <span
                        className="smartbiz-stat-card__icon"
                        style={iconColor ? { backgroundColor: `${iconColor}14`, color: iconColor } : undefined}
                    >
                        {icon}
                    </span>
                )}
            </div>
            <span
                className="smartbiz-stat-card__value"
                style={valueColor ? { color: valueColor } : undefined}
            >
                {value}
            </span>
            {subtitle && <span className="smartbiz-stat-card__subtitle">{subtitle}</span>}
        </div>
    )
}
