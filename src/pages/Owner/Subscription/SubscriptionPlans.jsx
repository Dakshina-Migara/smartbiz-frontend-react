import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import Modal from '../../../common/component/Modal/Modal'
import Button from '../../../common/component/Button/Button'
import { useAdmin } from '../../../context/AdminContext'
import { useAuth } from '../../../context/AuthContext'
import { useProducts } from '../../../context/ProductContext'
import { useNotification } from '../../../context/NotificationContext'

export default function SubscriptionPlans() {
    const { plans, plansLoading, fetchPlans, purchasePlan } = useAdmin()
    const { user, updateUser } = useAuth()
    const { refreshData } = useProducts()
    const { showNotification } = useNotification()
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => { fetchPlans() }, [fetchPlans])

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan)
        setIsModalOpen(true)
    }

    const handleConfirmPurchase = async () => {
        if (!selectedPlan || !user?.businessId) return
        setIsSubmitting(true)
        const result = await purchasePlan(user.businessId, selectedPlan.subscriptionId)
        if (result.success) {
            updateUser({ planName: selectedPlan.planName })
            if (refreshData) refreshData()
            showNotification(`Successfully subscribed to ${selectedPlan.planName}!`, 'success')
            setIsModalOpen(false)
        } else {
            showNotification(result.message || 'Purchase failed', 'error')
        }
        setIsSubmitting(false)
    }

    const formatCurrency = (val) => `$${Number(val).toLocaleString()}`

    return (
        <OwnerLayout breadcrumb="Subscription Plans">
            <Box>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Upgrade Your Business</Typography>
                    <Typography variant="body1" sx={{ color: '#7a6e64' }}>Select a plan that fits your growth needs</Typography>
                </Box>

                {plansLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                        <CircularProgress sx={{ color: '#3d3229' }} />
                    </Box>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                        {plans.map((plan) => {
                            const isCurrentPlan = user?.planName === plan.planName
                            return (
                                <Paper
                                    key={plan.subscriptionId}
                                    elevation={0}
                                    sx={{
                                        borderRadius: '20px',
                                        p: 4,
                                        position: 'relative',
                                        border: isCurrentPlan ? '2px solid #3d3229' : '1px solid #eee',
                                        boxShadow: isCurrentPlan
                                            ? '0 8px 30px rgba(61, 50, 41, 0.15)'
                                            : '0 2px 12px rgba(0, 0, 0, 0.04)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                                        },
                                    }}
                                >
                                    {isCurrentPlan && (
                                        <Chip
                                            label="Your Current Plan"
                                            color="primary"
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: -12,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                fontWeight: 700,
                                                backgroundColor: '#3d3229',
                                            }}
                                        />
                                    )}

                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>{plan.planName}</Typography>
                                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                                        <Typography component="span" sx={{ fontSize: '0.9rem', color: '#7a6e64', verticalAlign: 'top' }}>$</Typography>
                                        <Typography component="span" sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a1a' }}>{plan.price}</Typography>
                                        <Typography component="span" sx={{ fontSize: '0.9rem', color: '#9a8e84' }}>/mo</Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircleOutlineIcon sx={{ color: '#27ae60', fontSize: 20 }} />
                                            <Typography variant="body2">{plan.aiTokenLimit.toLocaleString()} AI Tokens / mo</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircleOutlineIcon sx={{ color: '#27ae60', fontSize: 20 }} />
                                            <Typography variant="body2">Up to {plan.maxUsers} Users</Typography>
                                        </Box>
                                        {(plan.features || "").split(',').map((feat, i) => (
                                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckCircleOutlineIcon sx={{ color: '#27ae60', fontSize: 20 }} />
                                                <Typography variant="body2">{feat.trim()}</Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Button
                                        variant={isCurrentPlan ? 'outlined' : 'filled'}
                                        fullWidth
                                        onClick={() => !isCurrentPlan && handleSelectPlan(plan)}
                                        disabled={isCurrentPlan}
                                    >
                                        {isCurrentPlan ? 'Active' : 'Get Started'}
                                    </Button>
                                </Paper>
                            )
                        })}
                    </Box>
                )}
            </Box>

            <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title="Confirm Subscription">
                <Box>
                    <Typography sx={{ mb: 2, color: '#4a5568' }}>
                        You are about to subscribe to the <strong>{selectedPlan?.planName}</strong> plan.
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', backgroundColor: '#f8f9fa', mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#7a6e64' }}>Monthly Price:</Typography>
                            <Typography sx={{ fontWeight: 700 }}>{formatCurrency(selectedPlan?.price || 0)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: '#7a6e64' }}>AI Tokens:</Typography>
                            <Typography sx={{ fontWeight: 700 }}>{selectedPlan?.aiTokenLimit?.toLocaleString()}</Typography>
                        </Box>
                    </Paper>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button variant="filled" onClick={handleConfirmPurchase} disabled={isSubmitting}>
                            {isSubmitting ? 'Processing...' : 'Confirm & Subscribe'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </OwnerLayout>
    )
}
