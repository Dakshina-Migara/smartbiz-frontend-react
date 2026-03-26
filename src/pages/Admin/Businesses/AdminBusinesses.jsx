import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MuiTextField from '@mui/material/TextField'
import AdminLayout from '../../../common/component/AdminLayout/AdminLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import TextField from '../../../common/component/TextField/TextField'
import Button from '../../../common/component/Button/Button'
import Modal from '../../../common/component/Modal/Modal'
import SearchIcon from '@mui/icons-material/Search'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useAdmin } from '../../../context/AdminContext'
import { useAuth } from '../../../context/AuthContext'
import { useNotification } from '../../../context/NotificationContext'

export default function AdminBusinesses() {
    const { businesses, businessesLoading, fetchBusinesses, deleteBusiness, deleteAccount, updateAccount, user } = useAdmin()
    const { logout } = useAuth()
    const { showNotification } = useNotification()
    const [searchQuery, setSearchQuery] = useState('')

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedBusiness, setSelectedBusiness] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [editForm, setEditForm] = useState({
        name: '', businessOwnerName: '', email: '', phone: '', address: ''
    })

    const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchQuery(query)
        fetchBusinesses(query)
    }

    const openDeleteModal = (business) => {
        setSelectedBusiness(business)
        setIsDeleteModalOpen(true)
    }

    const openEditModal = (account) => {
        setSelectedBusiness(account)
        setEditForm({
            name: account.name || '',
            businessOwnerName: account.businessOwnerName || '',
            email: account.email || '',
            phone: account.phone || '',
            address: account.address || ''
        })
        setIsEditModalOpen(true)
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({ ...prev, [name]: value }))
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        setIsUpdating(true)
        const result = await updateAccount(selectedBusiness.adminId, editForm)
        if (result.success) {
            setIsEditModalOpen(false)
            showNotification('Account updated successfully!', 'success')
        } else {
            showNotification(result.message || 'Failed to update account', 'error')
        }
        setIsUpdating(false)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedBusiness) return
        setIsDeleting(true)

        const rowAdminId = selectedBusiness.adminId ? String(selectedBusiness.adminId) : null
        const currentAdminId = user?.adminId ? String(user.adminId) : null
        const isOwnAccount = (rowAdminId && rowAdminId === currentAdminId) ||
            (selectedBusiness.email && selectedBusiness.email === user?.email)

        const result = await deleteAccount(selectedBusiness.adminId)

        if (result.success) {
            showNotification('Account deleted successfully', 'success')
            if (isOwnAccount) {
                logout()
            } else {
                setIsDeleteModalOpen(false)
                setSelectedBusiness(null)
            }
        } else {
            showNotification(result.message || 'Failed to delete account', 'error')
        }
        setIsDeleting(false)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
    }

    const columns = useMemo(() => [
        { key: 'name', label: 'Business Name' },
        {
            key: 'role', label: 'Role',
            render: (val) => (
                <Chip label={val || 'OWNER'} size="small" variant="outlined"
                    color={val?.toLowerCase() === 'admin' ? 'primary' : 'default'}
                    sx={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '0.7rem' }} />
            )
        },
        { key: 'businessOwnerName', label: 'User/Owner' },
        { key: 'email', label: 'Email' },
        {
            key: 'planName', label: 'Plan',
            render: (val) => <Chip label={val || 'N/A'} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
        },
        {
            key: 'aiUsage', label: 'AI Usage (Monthly)',
            render: (val, row) => (
                <Box>
                    <Typography component="span" sx={{ fontWeight: 600 }}>{(val || 0).toLocaleString()}</Typography>
                    {row.aiTokenLimit && (
                        <Typography component="span" sx={{ color: '#9a8e84', fontSize: '0.85rem' }}> / {row.aiTokenLimit.toLocaleString()}</Typography>
                    )}
                </Box>
            )
        },
        { key: 'revenue', label: 'Revenue', render: (val) => `$${(val || 0).toLocaleString()}` },
        { key: 'registeredDate', label: 'Joined', render: (val) => formatDate(val) },
        {
            key: 'actions', label: 'Actions', align: 'center',
            render: (_, row) => {
                const isAdmin = row.role?.toUpperCase() === 'ADMIN'
                const rowAdminId = row.adminId ? String(row.adminId) : null
                const currentAdminId = user?.adminId ? String(user.adminId) : null
                const isOwnAccount = (rowAdminId && rowAdminId === currentAdminId) ||
                    (row.email && row.email === user?.email)
                const canEdit = !isAdmin || isOwnAccount
                const canDelete = !isAdmin || isOwnAccount

                return (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton size="small" title={canEdit ? "Edit Account" : "You cannot edit other system admins"}
                            onClick={() => canEdit && openEditModal(row)} disabled={!canEdit}
                            sx={{ color: '#4a5568', '&:hover': { backgroundColor: '#ebf8ff', color: '#0369a1' }, '&.Mui-disabled': { opacity: 0.3 } }}>
                            <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" title={canDelete ? "Delete Account" : "You cannot delete other system admins"}
                            onClick={() => canDelete && openDeleteModal(row)} disabled={!canDelete}
                            sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2', color: '#b91c1c' }, '&.Mui-disabled': { opacity: 0.3 } }}>
                            <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )
            }
        }
    ], [user, deleteAccount, updateAccount, fetchBusinesses])

    return (
        <AdminLayout breadcrumb="Businesses">
            <Box>
                <Paper elevation={0} sx={{ borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Registered Businesses</Typography>
                            <Typography variant="body2" sx={{ color: '#7a6e64' }}>Manage all registered businesses</Typography>
                        </Box>
                        <MuiTextField
                            placeholder="Search businesses..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9a8e84' }} /></InputAdornment>,
                            }}
                            sx={{
                                minWidth: 250,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#f8f9fa',
                                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ overflowX: 'auto' }}>
                        {businessesLoading ? (
                            <Typography sx={{ p: 3, textAlign: 'center', color: '#7a6e64' }}>Loading businesses...</Typography>
                        ) : (
                            <DataTable columns={columns} data={businesses} />
                        )}
                    </Box>
                </Paper>
            </Box>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => !isDeleting && setIsDeleteModalOpen(false)} title="Confirm Account Deletion">
                <Box sx={{ textAlign: 'center', py: 1 }}>
                    <Box sx={{ pb: 4, fontSize: '1.1rem', color: '#4a5568', lineHeight: 1.5 }}>
                        Are you sure you want to permanently delete the account for <br />
                        <Typography component="span" sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '1.2rem' }}>{selectedBusiness?.name}</Typography>?
                        <Typography sx={{ fontSize: '0.95rem', color: '#e53e3e', mt: 2.5, fontWeight: 500 }}>
                            Warning: This action will delete all associated data and cannot be undone.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5 }}>
                        <Button variant="outlined" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>Cancel</Button>
                        <Button variant="danger" onClick={handleDeleteConfirm} disabled={isDeleting}>
                            {isDeleting ? 'DELETING...' : 'PERMANENTLY DELETE'}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => !isUpdating && setIsEditModalOpen(false)}
                title={`Edit ${selectedBusiness?.role === 'ADMIN' ? 'Admin' : 'Business'} Account`}>
                <Box component="form" onSubmit={handleEditSubmit} sx={{ py: 1 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                        <TextField label="User/Owner Name" name="businessOwnerName" value={editForm.businessOwnerName} onChange={handleEditChange} required />
                        <TextField label="Email Address" name="email" value={editForm.email} onChange={handleEditChange} type="email" required />
                    </Box>

                    {selectedBusiness?.role !== 'ADMIN' && (
                        <>
                            <Box sx={{ mb: 2 }}>
                                <TextField label="Business Name" name="name" value={editForm.name} onChange={handleEditChange} required fullWidth />
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                <TextField label="Phone Number" name="phone" value={editForm.phone} onChange={handleEditChange} />
                                <TextField label="Business Address" name="address" value={editForm.address} onChange={handleEditChange} />
                            </Box>
                        </>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button type="button" variant="outlined" onClick={() => setIsEditModalOpen(false)} disabled={isUpdating}>Cancel</Button>
                        <Button type="submit" variant="filled" disabled={isUpdating}>
                            {isUpdating ? 'SAVING...' : 'SAVE CHANGES'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </AdminLayout>
    )
}
