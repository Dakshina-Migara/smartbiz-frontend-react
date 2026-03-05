import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import GroupIcon from '@mui/icons-material/Group'
import InventoryIcon from '@mui/icons-material/Inventory'
import StatCard from '../../../common/component/StatCard/StatCard'
import DataTable from '../../../common/component/DataTable/DataTable'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import { useProducts } from '../../../context/ProductContext'
import './BusinessOwnerDashboard.css'

const productColumns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (val) => `$${Number(val).toFixed(2)}` },
    { key: 'cost', label: 'Cost', render: (val) => `$${Number(val).toFixed(2)}` },
    { key: 'stock', label: 'Stock' },
    { key: 'minStock', label: 'Min Stock' }
]

export default function BusinessOwnerDashboard() {
    const { products } = useProducts()

    // Calculate dynamic stats
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0)

    return (
        <OwnerLayout breadcrumb="Dashboard">
            <div className="dashboard-content">
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
                        value={lowStockCount.toString()}
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
                        value={`$${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        subtitle="Total stock value"
                        icon={<InventoryIcon />}
                        iconColor="#9b59b6"
                    />
                </div>

                {/* Table Section */}
                <div className="dashboard-section">
                    <h2 className="dashboard-section__title">Products Overview</h2>
                    <div className="dashboard-table-container">
                        {/* Show first 3 products as overview */}
                        <DataTable columns={productColumns} data={products.slice(0, 3)} />
                    </div>
                </div>
            </div>
        </OwnerLayout>
    )
}
