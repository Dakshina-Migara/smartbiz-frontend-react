import React, { useEffect, useState } from 'react'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import Modal from '../../../common/component/Modal/Modal'
import Button from '../../../common/component/Button/Button'
import './SubscriptionPlans.css'

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

    useEffect(() => {
        fetchPlans()
    }, [fetchPlans])

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
            <div className="subscription-plans">
                <div className="plans-header">
                    <h2>Upgrade Your Business</h2>
                    <p>Select a plan that fits your growth needs</p>
                </div>

                {plansLoading ? (
                    <div className="loading-state">Loading available plans...</div>
                ) : (
                    <div className="plans-container">
                        {plans.map((plan) => {
                            const isCurrentPlan = user?.planName === plan.planName
                            return (
                                <div key={plan.subscriptionId} className={`plan-tier ${isCurrentPlan ? 'current' : ''}`}>
                                    {isCurrentPlan && <span className="current-badge">Your Current Plan</span>}
                                    <div className="tier-header">
                                        <h3>{plan.planName}</h3>
                                        <div className="tier-price">
                                            <span className="currency">$</span>
                                            <span className="amount">{plan.price}</span>
                                            <span className="cycle">/mo</span>
                                        </div>
                                    </div>

                                    <div className="tier-features">
                                        <div className="feature-item">
                                            <CheckCircleOutlineIcon className="feature-icon" />
                                            <span>{plan.aiTokenLimit.toLocaleString()} AI Tokens / mo</span>
                                        </div>
                                        <div className="feature-item">
                                            <CheckCircleOutlineIcon className="feature-icon" />
                                            <span>Up to {plan.maxUsers} Users</span>
                                        </div>
                                        {(plan.features || "").split(',').map((feat, i) => (
                                            <div key={i} className="feature-item">
                                                <CheckCircleOutlineIcon className="feature-icon" />
                                                <span>{feat.trim()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className={`select-plan-btn ${isCurrentPlan ? 'disabled' : ''}`}
                                        onClick={() => !isCurrentPlan && handleSelectPlan(plan)}
                                        disabled={isCurrentPlan}
                                    >
                                        {isCurrentPlan ? 'Active' : 'Get Started'}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => !isSubmitting && setIsModalOpen(false)}
                title="Confirm Subscription"
            >
                <div className="purchase-modal">
                    <p>You are about to subscribe to the <strong>{selectedPlan?.planName}</strong> plan.</p>
                    <div className="plan-summary">
                        <div className="summary-row">
                            <span>Monthly Price:</span>
                            <span className="val">{formatCurrency(selectedPlan?.price || 0)}</span>
                        </div>
                        <div className="summary-row">
                            <span>AI Tokens:</span>
                            <span className="val">{selectedPlan?.aiTokenLimit.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button variant="filled" onClick={handleConfirmPurchase} disabled={isSubmitting}>
                            {isSubmitting ? 'Processing...' : 'Confirm & Subscribe'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </OwnerLayout>
    )
}
