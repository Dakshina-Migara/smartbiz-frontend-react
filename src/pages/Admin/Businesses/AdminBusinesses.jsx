import { useState, useMemo } from 'react'
import AdminLayout from '../../../common/component/AdminLayout/AdminLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import { useAdmin } from '../../../context/AdminContext'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Modal from '../../../common/component/Modal/Modal'
import Button from '../../../common/component/Button/Button'
import './AdminBusinesses.css'

export default function AdminBusinesses() {
    const { businesses, businessesLoading, fetchBusinesses, updateBusinessStatus, deleteBusiness } = useAdmin()
    const [searchQuery, setSearchQuery] = useState('')

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedBusiness, setSelectedBusiness] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchQuery(query)
        fetchBusinesses(query)
    }

    const handleToggleStatus = async (id, currentStatus) => {
        const targetStatus = (currentStatus === 'active') ? 'suspended' : 'active'
        await updateBusinessStatus(id, targetStatus)
    }

    const openDeleteModal = (business) => {
        setSelectedBusiness(business)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedBusiness) return
        setIsDeleting(true)
        const result = await deleteBusiness(selectedBusiness.businessId)
        if (result.success) {
            setIsDeleteModalOpen(false)
            setSelectedBusiness(null)
        } else {
            alert(result.message || 'Failed to delete business')
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
            key: 'status',
            label: 'Status',
            render: (val) => (
                <span className={`table-pill status-pill ${val?.toLowerCase()}`}>
                    {val || 'Unknown'}
                </span>
            )
        },
        {
            key: 'aiUsage',
            label: 'AI Usage',
            render: (val) => (val || 0).toLocaleString()
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
                return (
                    <div className="table-actions">
                        <button className="icon-btn" title="View Details">
                            <VisibilityOutlinedIcon />
                        </button>
                        <button
                            className={`action-btn ${row.status === 'active' ? 'suspend' : 'activate'}`}
                            onClick={() => !isAdmin && handleToggleStatus(row.businessId, row.status)}
                            disabled={isAdmin}
                            style={isAdmin ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                            title={isAdmin ? "System Admins cannot be suspended" : ""}
                        >
                            {row.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                            className="icon-btn delete-btn"
                            title={isAdmin ? "System Admins cannot be deleted" : "Delete Account"}
                            onClick={() => !isAdmin && openDeleteModal(row)}
                            disabled={isAdmin}
                            style={isAdmin ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                            <DeleteOutlinedIcon />
                        </button>
                    </div>
                );
            }
        }
    ], [handleToggleStatus])

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

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                title="Confirm Business Deletion"
            >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ paddingBottom: '24px', fontSize: '15px', color: '#4a5568' }}>
                        Are you sure you want to permanently delete <strong>{selectedBusiness?.name}</strong>?<br />
                        <span style={{ fontSize: '13px', color: '#e53e3e', marginTop: '10px', display: 'block' }}>
                            Warning: This action will delete all associated data and cannot be undone.
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <Button
                            variant="outlined"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            sx={{ backgroundColor: '#e53e3e', color: 'white', '&:hover': { backgroundColor: '#c53030' } }}
                        >
                            {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    )
}
