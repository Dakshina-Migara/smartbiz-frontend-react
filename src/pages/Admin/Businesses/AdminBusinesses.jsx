import { useState, useMemo } from 'react'
import AdminLayout from '../../../common/component/AdminLayout/AdminLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import { useAdmin } from '../../../context/AdminContext'
import { useAuth } from '../../../context/AuthContext'
import SearchIcon from '@mui/icons-material/Search'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Modal from '../../../common/component/Modal/Modal'
import Button from '../../../common/component/Button/Button'
import TextField from '../../../common/component/TextField/TextField'
import { useNotification } from '../../../context/NotificationContext'
import './AdminBusinesses.css'

export default function AdminBusinesses() {
    const { businesses, businessesLoading, fetchBusinesses, deleteBusiness, deleteAccount, updateAccount, user } = useAdmin()
    const { logout } = useAuth()
    const { showNotification } = useNotification()
    const [searchQuery, setSearchQuery] = useState('')

    // Deletion State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedBusiness, setSelectedBusiness] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Editing State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [editForm, setEditForm] = useState({
        name: '',
        businessOwnerName: '',
        email: '',
        phone: '',
        address: ''
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

        const rowAdminId = selectedBusiness.adminId ? String(selectedBusiness.adminId) : null;
        const currentAdminId = user?.adminId ? String(user.adminId) : null;
        const isOwnAccount = (rowAdminId && rowAdminId === currentAdminId) ||
            (selectedBusiness.email && selectedBusiness.email === user?.email);

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
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const columns = useMemo(() => [
        { key: 'name', label: 'Business Name' },
        {
            key: 'role',
            label: 'Role',
            render: (val) => (
                <span className={`table-pill role-pill ${val?.toLowerCase()}`}>
                    {val || 'OWNER'}
                </span>
            )
        },
        { key: 'businessOwnerName', label: 'User/Owner' },
        { key: 'email', label: 'Email' },
        {
            key: 'planName',
            label: 'Plan',
            render: (val) => (
                <span className="table-pill plan-pill">
                    {val || 'N/A'}
                </span>
            )
        },
        {
            key: 'aiUsage',
            label: 'AI Usage (Monthly)',
            render: (val, row) => (
                <div className="ai-usage-cell">
                    <span className="current">{(val || 0).toLocaleString()}</span>
                    {row.aiTokenLimit && (
                        <span className="limit"> / {row.aiTokenLimit.toLocaleString()}</span>
                    )}
                </div>
            )
        },
        {
            key: 'revenue',
            label: 'Revenue',
            render: (val) => `$${(val || 0).toLocaleString()}`
        },
        {
            key: 'registeredDate',
            label: 'Joined',
            render: (val) => formatDate(val)
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => {
                const isAdmin = row.role?.toUpperCase() === 'ADMIN';

                // Compare IDs more strictly with conversion, and use email as a fallback
                const rowAdminId = row.adminId ? String(row.adminId) : null;
                const currentAdminId = user?.adminId ? String(user.adminId) : null;

                const isOwnAccount = (rowAdminId && rowAdminId === currentAdminId) ||
                    (row.email && row.email === user?.email);

                const canEdit = !isAdmin || isOwnAccount;
                const canDelete = !isAdmin || isOwnAccount;

                return (
                    <div className="table-actions">
                        <button
                            className="icon-btn"
                            title={canEdit ? "Edit Account" : "You cannot edit other system admins"}
                            onClick={() => canEdit && openEditModal(row)}
                            disabled={!canEdit}
                            style={!canEdit ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                        >
                            <EditOutlinedIcon />
                        </button>
                        <button
                            className="icon-btn delete-btn"
                            title={canDelete ? "Delete Account" : "You cannot delete other system admins"}
                            onClick={() => canDelete && openDeleteModal(row)}
                            disabled={!canDelete}
                            style={!canDelete ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                        >
                            <DeleteOutlinedIcon />
                        </button>
                    </div>
                );
            }
        }
    ], [user, deleteAccount, updateAccount, fetchBusinesses])

    return (
        <AdminLayout breadcrumb="Businesses">
            <div className="admin-businesses">
                <div className="businesses-card">
                    <div className="businesses-card__header">
                        <div className="header-text">
                            <h3>Registered Businesses</h3>
                            <p>Manage all registered businesses</p>
                        </div>
                        <div className="search-bar">
                            <SearchIcon className="search-bar__icon" />
                            <input
                                type="text"
                                placeholder="Search businesses..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    <div className="businesses-card__content">
                        {businessesLoading ? (
                            <div className="loading-state">Loading businesses...</div>
                        ) : (
                            <DataTable columns={columns} data={businesses} />
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                title="Confirm Account Deletion"
            >
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{ paddingBottom: '32px', fontSize: '1.1rem', color: '#4a5568', lineHeight: 1.5 }}>
                        Are you sure you want to permanently delete the account for <br />
                        <strong style={{ color: '#1a1a1a', fontSize: '1.2rem' }}>{selectedBusiness?.name}</strong>?
                        <div style={{ fontSize: '0.95rem', color: '#e53e3e', marginTop: '20px', fontWeight: 500 }}>
                            Warning: This action will delete all associated data and cannot be undone.
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <Button
                            variant="outlined"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'DELETING...' : 'PERMANENTLY DELETE'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => !isUpdating && setIsEditModalOpen(false)}
                title={`Edit ${selectedBusiness?.role === 'ADMIN' ? 'Admin' : 'Business'} Account`}
            >
                <form onSubmit={handleEditSubmit} style={{ padding: '10px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <TextField
                            label="User/Owner Name"
                            name="businessOwnerName"
                            value={editForm.businessOwnerName}
                            onChange={handleEditChange}
                            required
                        />
                        <TextField
                            label="Email Address"
                            name="email"
                            value={editForm.email}
                            onChange={handleEditChange}
                            type="email"
                            required
                        />
                    </div>

                    {selectedBusiness?.role !== 'ADMIN' && (
                        <>
                            <div style={{ marginBottom: '16px' }}>
                                <TextField
                                    label="Business Name"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <TextField
                                    label="Phone Number"
                                    name="phone"
                                    value={editForm.phone}
                                    onChange={handleEditChange}
                                />
                                <TextField
                                    label="Business Address"
                                    name="address"
                                    value={editForm.address}
                                    onChange={handleEditChange}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => setIsEditModalOpen(false)}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="filled"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'SAVING...' : 'SAVE CHANGES'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    )
}
