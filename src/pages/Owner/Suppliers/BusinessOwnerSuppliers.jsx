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
import { useSuppliers } from '../../../context/SupplierContext'
import { useNotification } from '../../../context/NotificationContext'

export default function BusinessOwnerSuppliers() {
    const { suppliers, loading, addSupplier, updateSupplier, deleteSupplier } = useSuppliers()
    const { showNotification, showConfirm } = useNotification()
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: ''
    })

    const filteredSuppliers = suppliers.filter(s =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

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

    const handleDelete = async (id) => {
        const confirmed = await showConfirm('Are you sure you want to delete this supplier?')
        if (confirmed) {
            const result = await deleteSupplier(id)
            showNotification(result.success ? 'Supplier deleted' : 'Failed to delete', result.success ? 'success' : 'error')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        let result
        if (editingSupplier) {
            result = await updateSupplier(editingSupplier.id, formData)
        } else {
            result = await addSupplier(formData)
        }
        if (result.success) {
            setIsModalOpen(false)
            showNotification(`Supplier ${editingSupplier ? 'updated' : 'added'} successfully!`, 'success')
        } else {
            showNotification('Failed to save supplier.', 'error')
        }
        setIsSubmitting(false)
    }

    const columns = useMemo(() => [
        { key: 'name', label: 'Company Name' },
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
                    <IconButton size="small" onClick={() => handleDelete(row.id)}
                        sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2', color: '#b91c1c' } }}>
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        }
    ], [])

    return (
        <OwnerLayout breadcrumb="Suppliers">
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Supplier Management</Typography>
                    <Button startIcon={<AddIcon />} onClick={handleOpenAddModal}>Add Supplier</Button>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <TextField placeholder="Search Suppliers" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={<SearchIcon />} fullWidth />
                </Box>

                <Box sx={{ overflowX: 'auto' }}>
                    {loading && suppliers.length === 0 ? (
                        <Typography sx={{ p: 3, textAlign: 'center', color: '#7a6e64' }}>Loading suppliers...</Typography>
                    ) : (
                        <DataTable columns={columns} data={filteredSuppliers} />
                    )}
                </Box>
            </Box>

            <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title={editingSupplier ? "Edit Supplier" : "Add Supplier"}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
                        <TextField label="Company Name" name="name" value={formData.name} onChange={handleInputChange} required />
                        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                        <TextField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                        <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                            <TextField label="Address" name="address" value={formData.address} onChange={handleInputChange} fullWidth />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" variant="filled" disabled={isSubmitting}>
                            {isSubmitting ? 'SAVING...' : (editingSupplier ? 'SAVE CHANGES' : 'ADD SUPPLIER')}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </OwnerLayout>
    )
}
