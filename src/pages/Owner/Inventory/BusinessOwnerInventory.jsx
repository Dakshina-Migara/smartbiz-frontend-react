import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import SearchIcon from '@mui/icons-material/Search'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import TextField from '../../../common/component/TextField/TextField'
import { useProducts } from '../../../context/ProductContext'

export default function BusinessOwnerInventory() {
    const { products, loading, updateStock } = useProducts()
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('All Items')

    const stats = useMemo(() => {
        const totalItems = products.length
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length
        const outOfStock = products.filter(p => p.stock === 0).length
        const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0)
        return { totalItems, lowStock, outOfStock, totalValue }
    }, [products])

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch =
                (p.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (p.sku?.toLowerCase().includes(searchQuery.toLowerCase()))
            let matchesStatus = true
            if (filterStatus === 'In Stock') matchesStatus = p.stock > p.minStock
            if (filterStatus === 'Low Stock') matchesStatus = p.stock > 0 && p.stock <= p.minStock
            if (filterStatus === 'Out of Stock') matchesStatus = p.stock === 0
            return matchesSearch && matchesStatus
        })
    }, [products, searchQuery, filterStatus])

    const getStatusInfo = (stock, minStock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'error' }
        if (stock <= minStock) return { label: 'Low Stock', color: 'warning' }
        return { label: 'In Stock', color: 'success' }
    }

    const columns = [
        { key: 'name', label: 'Product' },
        { key: 'sku', label: 'SKU' },
        { key: 'category', label: 'Category' },
        {
            key: 'stock', label: 'Current Stock', align: 'right',
            render: (val, row) => (
                <Typography component="span" sx={{ fontWeight: 700, color: val <= row.minStock ? '#e74c3c' : '#2b3a4a' }}>
                    {val}
                </Typography>
            )
        },
        { key: 'minStock', label: 'Min Stock', align: 'right' },
        {
            key: 'status', label: 'Status', align: 'center',
            render: (_, row) => {
                const info = getStatusInfo(row.stock, row.minStock)
                return <Chip label={info.label} color={info.color} size="small" variant="outlined" />
            }
        },
        { key: 'price', label: 'Unit Price', align: 'right', render: (val) => `$${Number(val || 0).toFixed(2)}` },
        { key: 'totalValue', label: 'Stock Value', align: 'right', render: (_, row) => `$${(row.price * row.stock).toFixed(2)}` },
        {
            key: 'adjust', label: 'Quick Adjust', align: 'center',
            render: (_, row) => (
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <IconButton
                        size="small"
                        onClick={() => updateStock(row.id, row.stock, -1)}
                        disabled={row.stock <= 0}
                        sx={{
                            backgroundColor: '#fef2f2', color: '#ef4444', width: 32, height: 32,
                            '&:hover': { backgroundColor: '#fee2e2' },
                            '&:disabled': { opacity: 0.3 },
                        }}
                    >
                        <RemoveIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => updateStock(row.id, row.stock, 1)}
                        sx={{
                            backgroundColor: '#f0fdf4', color: '#22c55e', width: 32, height: 32,
                            '&:hover': { backgroundColor: '#dcfce7' },
                        }}
                    >
                        <AddIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
            )
        }
    ]

    return (
        <OwnerLayout breadcrumb="Inventory">
            <Box>
                {/* Statistics Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
                    {[
                        { title: 'Total Items', value: stats.totalItems, sub: 'SKUs in inventory' },
                        { title: 'Low Stock Alerts', value: stats.lowStock, sub: 'Items need restock' },
                        { title: 'Out of Stock', value: stats.outOfStock, sub: 'Items unavailable' },
                        { title: 'Total Value', value: `$${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: 'Stock value' },
                    ].map((stat, i) => (
                        <Paper key={i} elevation={0} sx={{ p: 2.5, borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                            <Typography variant="caption" sx={{ color: '#7a6e64', fontWeight: 500, fontSize: '0.8rem' }}>{stat.title}</Typography>
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', my: 0.5 }}>{stat.value}</Typography>
                            <Typography variant="caption" sx={{ color: '#9a8e84' }}>{stat.sub}</Typography>
                        </Paper>
                    ))}
                </Box>

                {/* Main Content Section */}
                <Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Inventory Overview</Typography>
                        <Typography variant="body2" sx={{ color: '#7a6e64' }}>Monitor and manage your stock levels</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ flex: 1, minWidth: 200 }}>
                            <TextField
                                placeholder="Search by name or SKU..."
                                icon={<SearchIcon />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ minWidth: 180 }}>
                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                fullWidth
                                variant="outlined"
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: '#f8f9fa',
                                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                }}
                            >
                                <MenuItem value="All Items">All Items</MenuItem>
                                <MenuItem value="In Stock">In Stock</MenuItem>
                                <MenuItem value="Low Stock">Low Stock</MenuItem>
                                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                            </Select>
                        </Box>
                    </Box>

                    <Box sx={{ overflowX: 'auto' }}>
                        <DataTable columns={columns} data={filteredProducts} isLoading={loading && products.length === 0} />
                    </Box>
                </Box>
            </Box>
        </OwnerLayout>
    )
}