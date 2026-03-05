import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import GroupIcon from '@mui/icons-material/Group'
import InventoryIcon from '@mui/icons-material/Inventory'
import StatCard from '../../../common/component/StatCard/StatCard'
import DataTable from '../../../common/component/DataTable/DataTable'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import './BusinessOwnerDashboard.css'

const productColumns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (val) => `$${val.toFixed(2)}` },
    { key: 'cost', label: 'Cost', render: (val) => `$${val.toFixed(2)}` },
    { key: 'stock', label: 'Stock' },
    { key: 'minStock', label: 'Min Stock' }
]

const sampleProducts = [
    { name: 'Wireless Mouse', sku: 'WM-001', category: 'Electronics', price: 29.99, cost: 15.00, stock: 45, minStock: 10 },
    { name: 'USB-C Cable', sku: 'UC-002', category: 'Electronics', price: 12.99, cost: 5.50, stock: 120, minStock: 20 },
    { name: 'Laptop Stand', sku: 'LS-003', category: 'Accessories', price: 49.99, cost: 25.00, stock: 8, minStock: 5 },
]

export default function BusinessOwnerDashboard() {
    return (
        <OwnerLayout breadcrumb="Business Owner - Dashboard">
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
                    <div className="dashboard-table-container">
                        <DataTable columns={productColumns} data={sampleProducts} />
                    </div>
                </div>
            </div>
        </OwnerLayout>
    )
}
