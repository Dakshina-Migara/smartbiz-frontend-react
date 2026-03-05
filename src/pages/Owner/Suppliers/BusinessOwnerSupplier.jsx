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
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import { useSuppliers } from '../../../context/SupplierContext'
import './BusinessOwnerSupplier.css'

export default function BusinessOwnerSupplier() {
    const { suppliers, loading, addSupplier, updateSupplier, deleteSupplier } = useSuppliers()
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    })

    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(s =>
            s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.phone?.includes(searchQuery)
        )
    }, [suppliers, searchQuery])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleOpenAddModal = () => {
        setEditingSupplier(null)
        setFormData({ name: '', email: '', phone: '', address: '' })
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (supplier) => {
        setEditingSupplier(supplier)
        setFormData({
            name: supplier.name || '',
            email: supplier.email || '',
            phone: supplier.phone || '',
            address: supplier.address || ''
        })
        setIsModalOpen(true)
    }

    const handleDeleteSupplier = async (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            await deleteSupplier(id)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        let result;
        if (editingSupplier) {
            result = await updateSupplier(editingSupplier.supplierId, formData)
        } else {
            result = await addSupplier(formData)
        }

        if (result.success) {
            setIsModalOpen(false)
        } else {
            alert('Failed to save supplier. Please try again.')
        }
        setIsSubmitting(false)
    }

    const columns = useMemo(() => [
        {
            key: 'name',
            label: 'Company Name',
            render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
        },
        {
            key: 'email',
            label: 'Email',
            render: (val) => (
                <div className="contact-item">
                    <EmailOutlinedIcon sx={{ fontSize: 18, marginRight: 1, color: '#666' }} /> {val}
                </div>
            )
        },
        {
            key: 'phone',
            label: 'Phone',
            render: (val) => (
                <div className="contact-item">
                    <PhoneOutlinedIcon sx={{ fontSize: 18, marginRight: 1, color: '#666' }} /> {val}
                </div>
            )
        },
        {
            key: 'address',
            label: 'Address',
            render: (val) => <div className="address-cell">{val}</div>
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="action-buttons">
                    <button
                        className="action-btn action-btn--edit"
                        onClick={() => handleOpenEditModal(row)}
                    >
                        <EditOutlinedIcon />
                    </button>
                    <button
                        className="action-btn action-btn--delete"
                        onClick={() => handleDeleteSupplier(row.supplierId)}
                    >
                        <DeleteOutlineIcon />
                    </button>
                </div>
            )
        }
    ], [])

    return (
        <OwnerLayout breadcrumb="Suppliers">
            <div className="suppliers-page">
                <div className="suppliers-section">
                    <div className="suppliers-header">
                        <h2 className="suppliers-title">Supplier Management</h2>
                        <Button
                            variant="filled"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAddModal}
                            sx={{ backgroundColor: '#000', borderRadius: '8px' }}
                        >
                            Add Supplier
                        </Button>
                    </div>

                    <div className="suppliers-toolbar">
                        <TextField
                            placeholder="Search suppliers..."
                            icon={<SearchIcon />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            fullWidth
                        />
                    </div>

                    <div className="suppliers-table-container">
                        <DataTable
                            columns={columns}
                            data={filteredSuppliers}
                            isLoading={loading && suppliers.length === 0}
                        />
                    </div>
                </div>
            </div>

            {/* Add/Edit Supplier Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            >
                <form className="supplier-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <TextField
                            name="name"
                            label="Company Name"
                            placeholder="e.g. Tech Supplies Co."
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="email"
                            label="Email Address"
                            type="email"
                            placeholder="e.g. orders@techsupplies.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="phone"
                            label="Phone Number"
                            placeholder="e.g. +1-800-555-0001"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="address"
                            label="Address"
                            placeholder="e.g. 1000 Industrial Blvd, San Jose, CA 95101"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                    </div>
                    <div className="form-actions">
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="filled" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (editingSupplier ? 'Update Supplier' : 'Add Supplier')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </OwnerLayout>
    )
}
