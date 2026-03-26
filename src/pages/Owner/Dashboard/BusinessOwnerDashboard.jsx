import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import GroupIcon from '@mui/icons-material/Group'
import InventoryIcon from '@mui/icons-material/Inventory'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import StatCard from '../../../common/component/StatCard/StatCard'
import DataTable from '../../../common/component/DataTable/DataTable'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import { useProducts } from '../../../context/ProductContext'

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
    const { products, dashboardStats, loading } = useProducts()

    const stats = dashboardStats || {
        totalRevenue: 0,
        salesCount: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0,
        lowStockAlerts: 0,
        totalCustomers: 0,
        inventoryValue: 0,
        aiTokensUsedMonthly: 0,
        aiTokenLimit: 0,
        planName: 'None'
    }

    const formatCurrency = (val) => `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    if (loading && !dashboardStats) {
        return <OwnerLayout breadcrumb="Dashboard"><Box sx={{ p: 3, color: '#7a6e64' }}>Loading dashboard...</Box></OwnerLayout>
    }

    return (
        <OwnerLayout breadcrumb="Dashboard">
            <Box>
                {/* Stats Grid */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                        gap: { xs: 1.5, sm: 2 },
                        mb: 3,
                    }}
                >
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(stats.totalRevenue)}
                        subtitle={`From ${stats.salesCount} sales`}
                        icon={<TrendingUpIcon />}
                        iconColor="#27ae60"
                    />
                    <StatCard
                        title="Total Expenses"
                        value={formatCurrency(stats.totalExpenses)}
                        subtitle="Tracked expenses"
                        icon={<TrendingDownIcon />}
                        iconColor="#e67e22"
                    />
                    <StatCard
                        title="Net Profit"
                        value={formatCurrency(stats.netProfit)}
                        subtitle={`${stats.profitMargin}% margin`}
                        valueColor={stats.netProfit >= 0 ? "#27ae60" : "#e74c3c"}
                        icon={stats.netProfit >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        iconColor={stats.netProfit >= 0 ? "#27ae60" : "#e74c3c"}
                    />
                    <StatCard
                        title="Low Stock Alerts"
                        value={stats.lowStockAlerts.toString()}
                        subtitle="Items below minimum"
                        icon={<WarningAmberIcon />}
                        iconColor="#f39c12"
                    />
                    <StatCard
                        title="Total Customers"
                        value={stats.totalCustomers.toString()}
                        subtitle="Active customers"
                        icon={<GroupIcon />}
                        iconColor="#3498db"
                    />
                    <StatCard
                        title="Inventory Value"
                        value={formatCurrency(stats.inventoryValue || 0)}
                        subtitle="Total stock value"
                        icon={<InventoryIcon />}
                        iconColor="#9b59b6"
                    />
                    <StatCard
                        title="AI Tokens Used"
                        value={Number(stats.aiTokensUsedMonthly || 0).toLocaleString()}
                        subtitle={`${stats.planName} (Limit: ${Number(stats.aiTokenLimit || 0).toLocaleString()})`}
                        icon={<AutoAwesomeIcon />}
                        iconColor="#8e44ad"
                    />
                </Box>

                {/* Table Section */}
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 2 }}>
                        Recent Products
                    </Typography>
                    <Box sx={{ overflowX: 'auto' }}>
                        <DataTable columns={productColumns} data={products.slice(0, 5)} />
                    </Box>
                </Box>
            </Box>
        </OwnerLayout>
    )
}
