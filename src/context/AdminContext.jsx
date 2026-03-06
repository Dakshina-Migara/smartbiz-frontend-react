import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import API from '../api/axios'
import { useAuth } from './AuthContext'

const AdminContext = createContext()

export function AdminProvider({ children }) {
    const { user, token } = useAuth()
    const [stats, setStats] = useState({
        totalBusinesses: 0,
        activeBusinesses: 0,
        monthlyRevenue: 0,
        subscriptionCount: 0, // Inferred from totalSubscribers if needed
        aiTokensUsed: 0,
        totalSubscribers: 0
    })
    const [charts, setCharts] = useState({
        tokenUsage: [],
        revenueByPlan: [],
        subscribersByPlan: []
    })
    const [loading, setLoading] = useState(true)

    const fetchDashboardData = useCallback(async () => {
        // Only fetch if admin
        const isAdmin = user?.role?.toUpperCase() === 'ADMIN'
        if (!isAdmin || !token) {
            setLoading(false)
            return
        }

        setLoading(true)
        console.log('Fetching Admin Dashboard Data from /admin/dashboard...')

        try {
            const response = await API.get('/admin/dashboard')
            const data = response.data

            if (data) {
                // Map backend fields to frontend state
                setStats({
                    totalBusinesses: data.totalBusinesses || 0,
                    activeBusinesses: data.activeBusinesses || 0,
                    monthlyRevenue: data.monthlyRevenue || 0,
                    subscriptionCount: data.totalSubscribers || 0,
                    aiTokensUsed: data.totalTokensThisMonth || 0,
                    totalSubscribers: data.totalSubscribers || 0
                })

                // Map Chart Data
                const mappedTokenUsage = (data.dailyAiTokenUsage || []).map(entry => ({
                    name: entry.date ? new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown',
                    usage: entry.tokens || 0
                }))

                const planColors = ['#f6ad55', '#319795', '#805ad5', '#4fd1c5', '#38a169']

                const mappedRevenue = (data.revenueByPlan || []).map((entry, idx) => ({
                    name: entry.planName || 'Unknown',
                    value: entry.revenue || 0,
                    color: planColors[idx % planColors.length]
                }))

                const mappedSubscribers = (data.subscribersByPlan || []).map(entry => ({
                    name: entry.planName || 'Unknown',
                    count: entry.count || 0
                }))

                setCharts({
                    tokenUsage: mappedTokenUsage,
                    revenueByPlan: mappedRevenue,
                    subscribersByPlan: mappedSubscribers
                })
            }
        } catch (error) {
            console.error('Error fetching admin dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }, [user, token])

    useEffect(() => {
        fetchDashboardData()
    }, [fetchDashboardData])

    return (
        <AdminContext.Provider value={{ stats, charts, loading, refreshData: fetchDashboardData }}>
            {children}
        </AdminContext.Provider>
    )
}

export const useAdmin = () => {
    const context = useContext(AdminContext)
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider')
    }
    return context
}
