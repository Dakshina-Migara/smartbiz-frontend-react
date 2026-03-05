import { useState, useMemo } from 'react'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import TextField from '../../../common/component/TextField/TextField'
import Button from '../../../common/component/Button/Button'
import Modal from '../../../common/component/Modal/Modal'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import './OwnerProductsPage.css'

const initialProducts = [
    { id: 1, name: 'Wireless Mouse', sku: 'WM-001', category: 'Electronics', price: 29.99, cost: 15.00, stock: 45, minStock: 10 },
    { id: 2, name: 'USB-C Cable', sku: 'UC-002', category: 'Electronics', price: 12.99, cost: 5.50, stock: 120, minStock: 20 },
    { id: 3, name: 'Laptop Stand', sku: 'LS-003', category: 'Accessories', price: 49.99, cost: 25.00, stock: 8, minStock: 5 },
    { id: 4, name: 'Mechanical Keyboard', sku: 'MK-004', category: 'Electronics', price: 89.99, cost: 45.00, stock: 25, minStock: 10 },
    { id: 5, name: 'HDMI Adapter', sku: 'HA-005', category: 'Electronics', price: 15.99, cost: 6.00, stock: 0, minStock: 5 },
]

export default function OwnerProductsPage() {
    const [products, setProducts] = useState(initialProducts)
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        price: '',
        cost: '',
        stock: '',
        minStock: ''
    })

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleOpenAddModal = () => {
        setEditingProduct(null)
        setFormData({ name: '', sku: '', category: '', price: '', cost: '', stock: '', minStock: '' })
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (product) => {
        setEditingProduct(product)
        setFormData({
            ...product,
            price: product.price.toString(),
            cost: product.cost.toString(),
            stock: product.stock.toString(),
            minStock: product.minStock.toString()
        })
        setIsModalOpen(true)
    }

    const handleDeleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(prev => prev.filter(p => p.id !== id))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const processedData = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            cost: parseFloat(formData.cost) || 0,
            stock: parseInt(formData.stock) || 0,
            minStock: parseInt(formData.minStock) || 0
        }

        if (editingProduct) {
            // Update existing
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...processedData, id: p.id } : p))
        } else {
            // Add new
            setProducts(prev => [...prev, { ...processedData, id: Date.now() }])
        }

        setIsModalOpen(false)
    }

    // Column Definitions moved inside component to access handlers
    const productColumns = useMemo(() => [
        { key: 'name', label: 'Name' },
        { key: 'sku', label: 'SKU' },
        { key: 'category', label: 'Category' },
        { key: 'price', label: 'Price', render: (val) => `$${Number(val).toFixed(2)}` },
        { key: 'cost', label: 'Cost', render: (val) => `$${Number(val).toFixed(2)}` },
        { key: 'stock', label: 'Stock' },
        { key: 'minStock', label: 'Min Stock' },
        {
            key: 'action', label: 'Action', render: (_, row) => (
                <div className="action-buttons">
                    <button
                        className="action-btn action-btn--edit"
                        title="Edit"
                        onClick={() => handleOpenEditModal(row)}
                    >
                        <EditOutlinedIcon />
                    </button>
                    <button
                        className="action-btn action-btn--delete"
                        title="Delete"
                        onClick={() => handleDeleteProduct(row.id)}
                    >
                        <DeleteOutlineIcon />
                    </button>
                </div>
            )
        }
    ], [products]) // Re-memoize when products change to ensure updated handlers

    return (
        <OwnerLayout breadcrumb="Business Owner - Products">
            <div className="owner-products-inner-content">
                <div className="content-toolbar">
                    <h1 className="content-title">Product And Inventory</h1>
                    <Button
                        type="primary"
                        startIcon={<AddIcon />}
                        className="add-product-btn"
                        onClick={handleOpenAddModal}
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

            {/* Product Modal (Add/Edit) */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? "Edit Product" : "Add New Product"}
            >
                <form className="add-product-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <TextField
                            name="name"
                            placeholder="Product Name"
                            label="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="sku"
                            placeholder="SKU Code"
                            label="SKU"
                            value={formData.sku}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="category"
                            placeholder="Category"
                            label="Category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="price"
                            type="number"
                            placeholder="Selling Price"
                            label="Price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="cost"
                            type="number"
                            placeholder="Cost Price"
                            label="Cost"
                            value={formData.cost}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="stock"
                            type="number"
                            placeholder="Initial Stock"
                            label="Stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="minStock"
                            type="number"
                            placeholder="Min Stock Level"
                            label="Min Stock"
                            value={formData.minStock}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="filled">
                            {editingProduct ? "Update Product" : "Save Product"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </OwnerLayout>
    )
}
