import React, { useState } from 'react'
import AdminLayout from '../../../common/component/AdminLayout/AdminLayout'
import { useAdmin } from '../../../context/AdminContext'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Modal from '../../../common/component/Modal/Modal'
import Button from '../../../common/component/Button/Button'
import TextField from '../../../common/component/TextField/TextField'
import { useNotification } from '../../../context/NotificationContext'
import './AdminPlans.css'


export default function AdminPlans() {
    const {
        plans,
        plansLoading,
        createPlan,
        updatePlan,
        deletePlan
    } = useAdmin()

    const { showNotification } = useNotification()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        planName: '',
        price: 0,
        aiTokenLimit: 5000,
        maxUsers: 1,
        billingCycle: 'monthly',
        features: ''
    })

    const openCreateModal = () => {
        setFormData({
            planName: '',
            price: 0,
            aiTokenLimit: 5000,
            maxUsers: 1,
            billingCycle: 'monthly',
            features: ''
        })
        setSelectedPlan(null)
        setIsModalOpen(true)
    }

    const openEditModal = (plan) => {
        setFormData({
            planName: plan.planName,
            price: plan.price,
            aiTokenLimit: plan.aiTokenLimit,
            maxUsers: plan.maxUsers,
            billingCycle: plan.billingCycle || 'monthly',
            features: plan.features || ''
        })
        setSelectedPlan(plan)
        setIsModalOpen(true)
    }

    const openDeleteModal = (plan) => {
        setSelectedPlan(plan)
        setIsDeleteModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        let result
        if (selectedPlan) {
            result = await updatePlan(selectedPlan.subscriptionId, formData)
        } else {
            result = await createPlan(formData)
        }

        if (result.success) {
            setIsModalOpen(false)
            showNotification(`Plan ${selectedPlan ? 'updated' : 'created'} successfully!`, 'success')
        } else {
            showNotification(result.message || 'Action failed', 'error')
        }
        setIsSubmitting(false)
    }

    const handleDelete = async () => {
        setIsSubmitting(true)
        const result = await deletePlan(selectedPlan.subscriptionId)
        if (result.success) {
            setIsDeleteModalOpen(false)
            showNotification('Plan deleted successfully', 'success')
        } else {
            showNotification(result.message || 'Deletion failed', 'error')
        }
        setIsSubmitting(false)
    }

    const formatCurrency = (val) => `$${Number(val).toLocaleString()}`

    return (
        <AdminLayout breadcrumb="Plans">
            <div className="admin-plans">
                <div className="admin-plans__header">
                    <div className="header-info">
                        <h3>Subscription Tiers</h3>
                        <p>Configure and manage your service plans</p>
                    </div>
                    <button className="add-plan-btn" onClick={openCreateModal}>
                        <AddCircleOutlineIcon className="btn-icon" />
                        Add New Plan
                    </button>
                </div>

                {plansLoading ? (
                    <div className="loading-state">Loading plans...</div>
                ) : (
                    <div className="plans-grid">
                        {plans.map((plan) => (
                            <div key={plan.subscriptionId} className="plan-card">
                                <div className="plan-card__actions">
                                    <button onClick={() => openEditModal(plan)} title="Edit"><EditOutlinedIcon /></button>
                                    <button onClick={() => openDeleteModal(plan)} className="delete" title="Delete"><DeleteOutlineIcon /></button>
                                </div>
                                <div className="plan-card__info">
                                    <h4 className="plan-name">{plan.planName}</h4>
                                    <div className="plan-price">
                                        <span className="amount">{formatCurrency(plan.price)}</span>
                                        <span className="cycle">/monthly</span>
                                    </div>

                                    <div className="features-section">
                                        <h5>Features:</h5>
                                        <ul className="features-list">
                                            {(plan.features || "").split(',').map((feat, i) => (
                                                <li key={i}>{feat.trim()}</li>
                                            ))}
                                            <li>Up to {plan.maxUsers} users</li>
                                            <li>{plan.aiTokenLimit.toLocaleString()} AI tokens/month</li>
                                        </ul>
                                    </div>

                                    <div className="plan-metrics">
                                        <div className="metric">
                                            <span>Active Subscribers:</span>
                                            <span className="metric-value">{plan.activeSubscribers || 0}</span>
                                        </div>
                                        <div className="metric">
                                            <span>Monthly Revenue:</span>
                                            <span className="metric-value revenue">{formatCurrency(plan.monthlyRevenue || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => !isSubmitting && setIsModalOpen(false)}
                title={selectedPlan ? "Edit Subscription Plan" : "Create New Plan"}
            >
                <form onSubmit={handleSubmit} className="plan-form">
                    <div className="form-row">
                        <TextField
                            label="Plan Name"
                            value={formData.planName}
                            onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                            required
                        />
                        <TextField
                            label="Price ($)"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <TextField
                            label="AI Token Limit"
                            type="number"
                            value={formData.aiTokenLimit}
                            onChange={(e) => setFormData({ ...formData, aiTokenLimit: parseInt(e.target.value) })}
                            required
                        />
                        <TextField
                            label="Max Users"
                            type="number"
                            value={formData.maxUsers}
                            onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <TextField
                            label="Features (Comma separated)"
                            value={formData.features}
                            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                            multiline
                            rows={3}
                            placeholder="e.g. Basic reports, Advanced analytics, Premium support"
                        />
                    </div>
                    <div className="form-buttons">
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" variant="filled" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : (selectedPlan ? "Save Changes" : "Create Plan")}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
            >
                <div className="delete-confirm">
                    <p>Are you sure you want to delete the <strong>{selectedPlan?.planName}</strong> plan?</p>
                    <p className="warning">This action might affect existing businesses on this plan.</p>
                    <div className="form-buttons">
                        <Button variant="outlined" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button variant="filled" onClick={handleDelete} disabled={isSubmitting} sx={{ bgcolor: '#e53e3e', color: 'white' }}>
                            {isSubmitting ? "Deleting..." : "Delete Plan"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    )
}
