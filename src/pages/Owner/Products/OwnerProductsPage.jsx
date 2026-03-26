import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
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
import { useNotification } from '../../../context/NotificationContext'

export default function OwnerProductsPage() {
    const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts()
    const { showNotification, showConfirm } = useNotification()
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: '', sku: '', category: '', price: '', cost: '', stock: '', minStock: ''
    })

    const filteredProducts = products.filter(p =>
        (p.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.sku?.toLowerCase().includes(searchQuery.toLowerCase()))
    )

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
        const confirmed = await showConfirm('Are you sure you want to delete this product?')
        if (confirmed) {
            const result = await deleteProduct(id)
            if (result.success) {
                showNotification('Product deleted successfully', 'success')
            } else {
                showNotification('Failed to delete product.', 'error')
            }
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
            showNotification(`Product ${editingProduct ? 'updated' : 'added'} successfully!`, 'success')
        } else {
            showNotification('Failed to save product. Please try again.', 'error')
        }
        setIsSubmitting(false)
    }

    const productColumns = useMemo(() => [
        { key: 'name', label: 'Name' },
        { key: 'sku', label: 'SKU' },
        { key: 'category', label: 'Category' },
        { key: 'price', label: 'Price', align: 'right', render: (val) => `$${Number(val || 0).toFixed(2)}` },
        { key: 'cost', label: 'Cost', align: 'right', render: (val) => `$${Number(val || 0).toFixed(2)}` },
        { key: 'stock', label: 'Stock', align: 'right' },
        { key: 'minStock', label: 'Min Stock', align: 'right' },
        {
            key: 'action', label: 'Actions', align: 'center', render: (_, row) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton
                        size="small"
                        onClick={() => handleOpenEditModal(row)}
                        sx={{ color: '#4a5568', '&:hover': { backgroundColor: '#ebf8ff', color: '#0369a1' } }}
                    >
                        <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleDeleteProduct(row.id)}
                        sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2', color: '#b91c1c' } }}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        }
    ], [products, handleDeleteProduct, handleOpenEditModal])

    return (
        <OwnerLayout breadcrumb="Products">
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Product And Inventory</Typography>
                    <Button startIcon={<AddIcon />} onClick={handleOpenAddModal}>
                        Add Product
                    </Button>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <TextField
                        placeholder="Search Product"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<SearchIcon />}
                        fullWidth
                    />
                </Box>

                <Box sx={{ overflowX: 'auto' }}>
                    {loading && products.length === 0 ? (
                        <Typography sx={{ p: 3, textAlign: 'center', color: '#7a6e64' }}>Loading products...</Typography>
                    ) : (
                        <DataTable columns={productColumns} data={filteredProducts} />
                    )}
                </Box>
            </Box>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? "Edit Product" : "Add New Product"}
            >
                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
                        <TextField name="name" placeholder="Enter Product Name" label="Name" value={formData.name} onChange={handleInputChange} required />
                        <TextField name="sku" placeholder="Enter SKU Code" label="SKU" value={formData.sku} onChange={handleInputChange} required />
                        <TextField name="category" placeholder="Enter Category" label="Category" value={formData.category} onChange={handleInputChange} required />
                        <TextField name="price" type="number" placeholder="Enter Selling Price" label="Price" value={formData.price} onChange={handleInputChange} required />
                        <TextField name="cost" type="number" placeholder="Enter Cost Price" label="Cost" value={formData.cost} onChange={handleInputChange} required />
                        <TextField name="stock" type="number" placeholder="Enter Initial Stock" label="Stock" value={formData.stock} onChange={handleInputChange} required />
                        <TextField name="minStock" type="number" placeholder="Enter Min Stock Level" label="Min Stock" value={formData.minStock} onChange={handleInputChange} required />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" variant="filled" disabled={isSubmitting}>
                            {isSubmitting ? 'SAVING...' : (editingProduct ? 'SAVE CHANGES' : 'ADD PRODUCT')}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </OwnerLayout>
    )
}
