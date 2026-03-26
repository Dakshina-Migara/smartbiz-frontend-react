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
import { useCustomers } from '../../../context/CustomerContext'
import { useNotification } from '../../../context/NotificationContext'

export default function BusinessOwnerCustomers() {
    const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers()
    const { showNotification, showConfirm } = useNotification()
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: ''
    })

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
        setFormData({ name: customer.name || '', email: customer.email || '', phone: customer.phone || '', address: customer.address || '' })
        setIsModalOpen(true)
    }

    const handleDelete = async (id) => {
        const confirmed = await showConfirm('Are you sure you want to delete this customer?')
        if (confirmed) {
            const result = await deleteCustomer(id)
            showNotification(result.success ? 'Customer deleted' : 'Failed to delete', result.success ? 'success' : 'error')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        let result
        if (editingCustomer) {
            result = await updateCustomer(editingCustomer.customerId, formData)
        } else {
            result = await addCustomer(formData)
        }
        if (result.success) {
            setIsModalOpen(false)
            showNotification(`Customer ${editingCustomer ? 'updated' : 'added'} successfully!`, 'success')
        } else {
            showNotification('Failed to save customer.', 'error')
        }
        setIsSubmitting(false)
    }

    const columns = useMemo(() => [
        { key: 'name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'address', label: 'Address' },
        {
            key: 'actions', label: 'Actions', align: 'center',
            render: (_, row) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton size="small" onClick={() => handleOpenEditModal(row)}
                        sx={{ color: '#4a5568', '&:hover': { backgroundColor: '#ebf8ff', color: '#0369a1' } }}>
                        <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(row.customerId)}
                        sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2', color: '#b91c1c' } }}>
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        }
    ], [])

    return (
        <OwnerLayout breadcrumb="Customers">
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Customer Management</Typography>
                    <Button startIcon={<AddIcon />} onClick={handleOpenAddModal}>Add Customer</Button>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <TextField placeholder="Search Customers" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={<SearchIcon />} fullWidth />
                </Box>

                <Box sx={{ overflowX: 'auto' }}>
                    {loading && customers.length === 0 ? (
                        <Typography sx={{ p: 3, textAlign: 'center', color: '#7a6e64' }}>Loading customers...</Typography>
                    ) : (
                        <DataTable columns={columns} data={filteredCustomers} />
                    )}
                </Box>
            </Box>

            <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title={editingCustomer ? "Edit Customer" : "Add Customer"}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
                        <TextField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
                        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                        <TextField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                        <TextField label="Address" name="address" value={formData.address} onChange={handleInputChange} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" variant="filled" disabled={isSubmitting}>
                            {isSubmitting ? 'SAVING...' : (editingCustomer ? 'SAVE CHANGES' : 'ADD CUSTOMER')}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </OwnerLayout>
    )
}
