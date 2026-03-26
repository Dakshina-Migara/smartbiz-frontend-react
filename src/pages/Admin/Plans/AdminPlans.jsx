import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AdminLayout from '../../../common/component/AdminLayout/AdminLayout'
import Modal from '../../../common/component/Modal/Modal'
import Button from '../../../common/component/Button/Button'
import TextField from '../../../common/component/TextField/TextField'
import { useAdmin } from '../../../context/AdminContext'
import { useNotification } from '../../../context/NotificationContext'

export default function AdminPlans() {
    const { plans, plansLoading, createPlan, updatePlan, deletePlan } = useAdmin()
    const { showNotification } = useNotification()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        planName: '', price: 0, aiTokenLimit: 5000, maxUsers: 1, billingCycle: 'monthly', features: ''
    })

    const openCreateModal = () => {
        setFormData({ planName: '', price: 0, aiTokenLimit: 5000, maxUsers: 1, billingCycle: 'monthly', features: '' })
        setSelectedPlan(null)
        setIsModalOpen(true)
    }

    const openEditModal = (plan) => {
        setFormData({
            planName: plan.planName, price: plan.price, aiTokenLimit: plan.aiTokenLimit,
            maxUsers: plan.maxUsers, billingCycle: plan.billingCycle || 'monthly', features: plan.features || ''
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
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>Subscription Tiers</Typography>
                        <Typography variant="body2" sx={{ color: '#7a6e64' }}>Configure and manage your service plans</Typography>
                    </Box>
                    <Button startIcon={<AddCircleOutlineIcon />} onClick={openCreateModal}>
                        Add New Plan
                    </Button>
                </Box>

                {plansLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                        <CircularProgress sx={{ color: '#3d3229' }} />
                    </Box>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                        {plans.map((plan) => (
                            <Paper key={plan.subscriptionId} elevation={0} sx={{
                                borderRadius: '20px', p: 3, position: 'relative',
                                border: '1px solid #eee',
                                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                                transition: 'all 0.3s ease',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)' },
                            }}>
                                {/* Actions */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mb: 1 }}>
                                    <IconButton size="small" onClick={() => openEditModal(plan)} title="Edit"
                                        sx={{ color: '#4a5568', '&:hover': { backgroundColor: '#ebf8ff', color: '#0369a1' } }}>
                                        <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => openDeleteModal(plan)} title="Delete"
                                        sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2', color: '#b91c1c' } }}>
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Box>

                                {/* Plan Info */}
                                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>{plan.planName}</Typography>
                                <Box sx={{ textAlign: 'center', my: 2 }}>
                                    <Typography component="span" sx={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a1a' }}>{formatCurrency(plan.price)}</Typography>
                                    <Typography component="span" sx={{ color: '#9a8e84' }}>/monthly</Typography>
                                </Box>

                                {/* Features */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Features:</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                                        {(plan.features || "").split(',').map((feat, i) => (
                                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircleOutlineIcon sx={{ color: '#27ae60', fontSize: 18 }} />
                                                <Typography variant="body2">{feat.trim()}</Typography>
                                            </Box>
                                        ))}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircleOutlineIcon sx={{ color: '#27ae60', fontSize: 18 }} />
                                            <Typography variant="body2">Up to {plan.maxUsers} users</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircleOutlineIcon sx={{ color: '#27ae60', fontSize: 18 }} />
                                            <Typography variant="body2">{plan.aiTokenLimit.toLocaleString()} AI tokens/month</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Metrics */}
                                <Box sx={{ pt: 2, borderTop: '1px solid #f0f0f0' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" sx={{ color: '#7a6e64' }}>Active Subscribers:</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{plan.activeSubscribers || 0}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" sx={{ color: '#7a6e64' }}>Monthly Revenue:</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#27ae60' }}>{formatCurrency(plan.monthlyRevenue || 0)}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Create/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title={selectedPlan ? "Edit Subscription Plan" : "Create New Plan"}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                        <TextField label="Plan Name" value={formData.planName} onChange={(e) => setFormData({ ...formData, planName: e.target.value })} required />
                        <TextField label="Price ($)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} required />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                        <TextField label="AI Token Limit" type="number" value={formData.aiTokenLimit} onChange={(e) => setFormData({ ...formData, aiTokenLimit: parseInt(e.target.value) })} required />
                        <TextField label="Max Users" type="number" value={formData.maxUsers} onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })} required />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField label="Features (Comma separated)" value={formData.features}
                            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                            multiline rows={3} placeholder="e.g. Basic reports, Advanced analytics, Premium support" fullWidth />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" variant="filled" disabled={isSubmitting}>
                            {isSubmitting ? "SAVING..." : (selectedPlan ? "SAVE CHANGES" : "CREATE PLAN")}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => !isSubmitting && setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '1.1rem', mb: 2 }}>
                        Are you sure you want to delete the <strong>{selectedPlan?.planName}</strong> plan?
                    </Typography>
                    <Typography sx={{ color: '#e53e3e', mb: 3, fontWeight: 500 }}>
                        Warning: This action might affect existing businesses on this plan.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button variant="outlined" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
                            {isSubmitting ? "DELETING..." : "DELETE PLAN"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </AdminLayout>
    )
}
