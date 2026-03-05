import { useState } from 'react'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import TextField from '../../../common/component/TextField/TextField'
import Button from '../../../common/component/Button/Button'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import './OwnerProductsPage.css'

const productColumns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (val) => `$${val.toFixed(2)}` },
    { key: 'cost', label: 'Cost', render: (val) => `$${val.toFixed(2)}` },
    { key: 'stock', label: 'Stock' },
    {
        key: 'status', label: 'Status', render: (val) => {
            const statusClass = val === 'In Stock'
                ? 'status--in-stock'
                : val === 'Low Stock'
                    ? 'status--low-stock'
                    : 'status--out-of-stock'
            return <span className={`status-badge ${statusClass}`}>{val}</span>
        }
    },
    {
        key: 'action', label: 'Action', render: (_, row) => (
            <div className="action-buttons">
                <button className="action-btn action-btn--edit" title="Edit">
                    <EditOutlinedIcon />
                </button>
                <button className="action-btn action-btn--delete" title="Delete">
                    <DeleteOutlineIcon />
                </button>
            </div>
        )
    }
]

const sampleProducts = [
    { name: 'Wireless Mouse', sku: 'WM-001', category: 'Electronics', price: 29.99, cost: 15.00, stock: 45, status: 'In Stock' },
    { name: 'USB-C Cable', sku: 'UC-002', category: 'Electronics', price: 12.99, cost: 5.50, stock: 120, status: 'In Stock' },
    { name: 'Laptop Stand', sku: 'LS-003', category: 'Accessories', price: 49.99, cost: 25.00, stock: 8, status: 'Low Stock' },
    { name: 'Mechanical Keyboard', sku: 'MK-004', category: 'Electronics', price: 89.99, cost: 45.00, stock: 25, status: 'In Stock' },
    { name: 'HDMI Adapter', sku: 'HA-005', category: 'Electronics', price: 15.99, cost: 6.00, stock: 0, status: 'Out of Stock' },
]

export default function OwnerProductsPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredProducts = sampleProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <OwnerLayout breadcrumb="Business Owner - Products">
            <div className="owner-products-inner-content">
                <div className="content-toolbar">
                    <h1 className="content-title">Product And Inventory</h1>
                    <Button
                        type="primary"
                        startIcon={<AddIcon />}
                        className="add-product-btn"
                    >
                        Add Product
                    </Button>
                </div>

                <div className="search-bar-container">
                    <TextField
                        placeholder="Search Product"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<SearchIcon />}
                        fullWidth
                        className="product-search-field"
                    />
                </div>

                <div className="table-container">
                    <DataTable columns={productColumns} data={filteredProducts} />
                </div>
            </div>
        </OwnerLayout>
    )
}
