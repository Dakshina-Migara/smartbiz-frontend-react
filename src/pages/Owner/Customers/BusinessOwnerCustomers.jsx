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
import { useCustomers } from '../../../context/CustomerContext'
import { useNotification } from '../../../context/NotificationContext'
import './BusinessOwnerCustomers.css'

export default function BusinessOwnerCustomers() {
    const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers()
    const { showNotification } = useNotification()
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    })

    const filteredCustomers = useMemo(() => {
        return customers.filter(c =>
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone?.includes(searchQuery)
        )
    }, [customers, searchQuery])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleOpenAddModal = () => {
        setEditingCustomer(null)
        setFormData({ name: '', email: '', phone: '', address: '' })
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (customer) => {
        setEditingCustomer(customer)
        setFormData({
            name: customer.name || '',
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || ''
        })
        setIsModalOpen(true)
    }

    const handleDeleteCustomer = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            const result = await deleteCustomer(id)
            if (result.success) {
                showNotification('Customer deleted successfully', 'success')
            } else {
                showNotification('Failed to delete customer.', 'error')
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        let result;
        if (editingCustomer) {
            result = await updateCustomer(editingCustomer.customerId, formData)
        } else {
            result = await addCustomer(formData)
        }

        if (result.success) {
            setIsModalOpen(false)
            showNotification(`Customer ${editingCustomer ? 'updated' : 'added'} successfully!`, 'success')
        } else {
            showNotification('Failed to save customer. Please try again.', 'error')
        }
        setIsSubmitting(false)
    }

    const columns = useMemo(() => [
        {
            key: 'name',
            label: 'Name',
            render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
        },
        {
            key: 'contact',
            label: 'Contact',
            render: (_, row) => (
                <div className="contact-cell">
                    <div className="contact-item">
                        <EmailOutlinedIcon /> {row.email}
                    </div>
                    <div className="contact-item">
                        <PhoneOutlinedIcon /> {row.phone}
                    </div>
                </div>
            )
        },
        {
            key: 'address',
            label: 'Address',
            render: (val) => <div className="address-cell">{val}</div>
        },
        {
            key: 'totalPurchases',
            label: 'Total Purchases',
            render: (val) => <span className="purchases-cell">${Number(val || 0).toFixed(2)}</span>
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
                        onClick={() => handleDeleteCustomer(row.customerId)}
                    >
                        <DeleteOutlineIcon />
                    </button>
                </div>
            )
        }
    ], [handleDeleteCustomer, handleOpenEditModal])

    return (
        <OwnerLayout breadcrumb="Customers">
            <div className="customers-page">
                <div className="customers-section">
                    <div className="customers-header">
                        <h2 className="customers-title">Customer Management</h2>
                        <Button
                            variant="filled"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAddModal}
                            sx={{ backgroundColor: '#000', borderRadius: '8px' }}
                        >
                            Add Customer
                        </Button>
                    </div>

                    <div className="customers-toolbar">
                        <TextField
                            placeholder="Search customers..."
                            icon={<SearchIcon />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            fullWidth
                        />
                    </div>

                    <div className="customers-table-container">
                        <DataTable
                            columns={columns}
                            data={filteredCustomers}
                            isLoading={loading && customers.length === 0}
                        />
                    </div>
                </div>
            </div>

            {/* Add/Edit Customer Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCustomer ? "Edit Customer" : "Add New Customer"}
            >
                <form className="customer-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <TextField
                            name="name"
                            label="Customer Name"
                            placeholder="Enter Customer Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="email"
                            label="Email Address"
                            type="email"
                            placeholder="Enter Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="phone"
                            label="Phone Number"
                            placeholder="Enter Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="address"
                            label="Address"
                            placeholder="Enter Address"
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
                            {isSubmitting ? 'Saving...' : (editingCustomer ? 'Update Customer' : 'Add Customer')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </OwnerLayout>
    )
}
