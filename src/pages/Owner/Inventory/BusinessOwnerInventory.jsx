import { useState, useMemo } from 'react'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import TextField from '../../../common/component/TextField/TextField'
import SearchIcon from '@mui/icons-material/Search'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useProducts } from '../../../context/ProductContext'
import './BusinessOwnerInventory.css'

export default function BusinessOwnerInventory() {
    const { products, loading, updateStock } = useProducts()
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('All Items')

    // Calculated Statistics
    const stats = useMemo(() => {
        const totalItems = products.length
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length
        const outOfStock = products.filter(p => p.stock === 0).length
        const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0)

        return { totalItems, lowStock, outOfStock, totalValue }
    }, [products])

    // Filtering logic
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
        if (stock === 0) return { label: 'Out of Stock', class: 'status-badge--out-of-stock' }
        if (stock <= minStock) return { label: 'Low Stock', class: 'status-badge--low-stock' }
        return { label: 'In Stock', class: 'status-badge--in-stock' }
    }

    const columns = [
        { key: 'name', label: 'Product' },
        { key: 'sku', label: 'SKU' },
        { key: 'category', label: 'Category' },
        {
            key: 'stock',
            label: 'Current Stock',
            render: (val, row) => (
                <span style={{ fontWeight: 700, color: val <= row.minStock ? '#e74c3c' : '#2b3a4a' }}>
                    {val}
                </span>
            )
        },
        { key: 'minStock', label: 'Min Stock' },
        {
            key: 'status',
            label: 'Status',
            render: (_, row) => {
                const info = getStatusInfo(row.stock, row.minStock)
                return <span className={`status-badge ${info.class}`}>{info.label}</span>
            }
        },
        {
            key: 'price',
            label: 'Unit Price',
            render: (val) => `$${Number(val || 0).toFixed(2)}`
        },
        {
            key: 'totalValue',
            label: 'Stock Value',
            render: (_, row) => `$${(row.price * row.stock).toFixed(2)}`
        },
        {
            key: 'adjust',
            label: 'Quick Adjust',
            render: (_, row) => (
                <div className="quick-adjust-buttons">
                    <button
                        className="adjust-btn adjust-btn--minus"
                        onClick={() => updateStock(row.id, row.stock, -1)}
                        disabled={row.stock <= 0}
                    >
                        -
                    </button>
                    <button
                        className="adjust-btn adjust-btn--plus"
                        onClick={() => updateStock(row.id, row.stock, 1)}
                    >
                        +
                    </button>
                </div>
            )
        }
    ]

    return (
        <OwnerLayout breadcrumb="Business Owner - Inventory">
            <div className="inventory-page">
                {/* Statistics Cards */}
                <div className="inventory-stats-grid">
                    <div className="inventory-stat-card">
                        <span className="inventory-stat-card__title">Total Items</span>
                        <span className="inventory-stat-card__value">{stats.totalItems}</span>
                        <span className="inventory-stat-card__subtitle">SKUs in inventory</span>
                    </div>
                    <div className="inventory-stat-card">
                        <span className="inventory-stat-card__title">Low Stock Alerts</span>
                        <span className="inventory-stat-card__value">{stats.lowStock}</span>
                        <span className="inventory-stat-card__subtitle">Items need restock</span>
                    </div>
                    <div className="inventory-stat-card">
                        <span className="inventory-stat-card__title">Out of Stock</span>
                        <span className="inventory-stat-card__value">{stats.outOfStock}</span>
                        <span className="inventory-stat-card__subtitle">Items unavailable</span>
                    </div>
                    <div className="inventory-stat-card">
                        <span className="inventory-stat-card__title">Total Value</span>
                        <span className="inventory-stat-card__value">
                            ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="inventory-stat-card__subtitle">Stock value</span>
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="inventory-section">
                    <div className="inventory-section__header">
                        <h2 className="inventory-section__title">Inventory Overview</h2>
                        <p className="inventory-section__subtitle">Monitor and manage your stock levels</p>
                    </div>

                    <div className="inventory-toolbar">
                        <div className="inventory-search-box">
                            <TextField
                                placeholder="Search by name or SKU..."
                                icon={<SearchIcon />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                fullWidth
                            />
                        </div>
                        <div className="inventory-filter-box">
                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                fullWidth
                                variant="outlined"
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: '#f8f9fa',
                                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                            >
                                <MenuItem value="All Items">All Items</MenuItem>
                                <MenuItem value="In Stock">In Stock</MenuItem>
                                <MenuItem value="Low Stock">Low Stock</MenuItem>
                                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                            </Select>
                        </div>
                    </div>

                    <div className="inventory-table-container">
                        <DataTable
                            columns={columns}
                            data={filteredProducts}
                            isLoading={loading && products.length === 0}
                        />
                    </div>
                </div>
            </div>
        </OwnerLayout>
    )
}