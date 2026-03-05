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
import { useProducts } from '../../../context/ProductContext'
import './OwnerProductsPage.css'

export default function OwnerProductsPage() {
    const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts()
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

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
        (p.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.sku?.toLowerCase().includes(searchQuery.toLowerCase()))
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
            price: product.price?.toString() || '',
            cost: product.cost?.toString() || '',
            stock: product.stock?.toString() || '',
            minStock: product.minStock?.toString() || ''
        })
        setIsModalOpen(true)
    }

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const processedData = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            cost: parseFloat(formData.cost) || 0,
            stock: parseInt(formData.stock) || 0,
            minStock: parseInt(formData.minStock) || 0
        }

        let result;
        if (editingProduct) {
            result = await updateProduct(editingProduct.id, processedData)
        } else {
            result = await addProduct(processedData)
        }

        if (result.success) {
            setIsModalOpen(false)
        } else {
            alert('Failed to save product. Please try again.')
        }
        setIsSubmitting(false)
    }

    // Column Definitions moved inside component to access handlers
    const productColumns = useMemo(() => [
        { key: 'name', label: 'Name' },
        { key: 'sku', label: 'SKU' },
        { key: 'category', label: 'Category' },
        { key: 'price', label: 'Price', render: (val) => `$${Number(val || 0).toFixed(2)}` },
        { key: 'cost', label: 'Cost', render: (val) => `$${Number(val || 0).toFixed(2)}` },
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
    ], [products])

    return (
        <OwnerLayout breadcrumb="Products">
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
                    {loading && products.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Loading products...</div>
                    ) : (
                        <DataTable columns={productColumns} data={filteredProducts} />
                    )}
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
                            placeholder="Enter Product Name"
                            label="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="sku"
                            placeholder="Enter SKU Code"
                            label="SKU"
                            value={formData.sku}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="category"
                            placeholder="Enter Category"
                            label="Category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="price"
                            type="number"
                            placeholder="Enter Selling Price"
                            label="Price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="cost"
                            type="number"
                            placeholder="Enter Cost Price"
                            label="Cost"
                            value={formData.cost}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="stock"
                            type="number"
                            placeholder="Enter Initial Stock"
                            label="Stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="minStock"
                            type="number"
                            placeholder="Enter Min Stock Level"
                            label="Min Stock"
                            value={formData.minStock}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" variant="filled" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (editingProduct ? "Update Product" : "Save Product")}
                        </Button>
                    </div>
                </form>
            </Modal>
        </OwnerLayout>
    )
}
