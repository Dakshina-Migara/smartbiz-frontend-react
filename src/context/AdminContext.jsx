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
        subscriptionCount: 0,
        aiTokensUsed: 0,
        totalSubscribers: 0
    })
    const [charts, setCharts] = useState({
        tokenUsage: [],
        revenueByPlan: [],
        subscribersByPlan: []
    })
    const [businesses, setBusinesses] = useState([])
    const [activityLogs, setActivityLogs] = useState([])
    const [aiLogs, setAiLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [businessesLoading, setBusinessesLoading] = useState(false)
    const [logsLoading, setLogsLoading] = useState(false)

    // Dashboard Data Fetch
    const fetchDashboardData = useCallback(async () => {
        const isAdmin = user?.role?.toUpperCase() === 'ADMIN'
        if (!isAdmin || !token) return

        setLoading(true)
        try {
            const response = await API.get('/admin/dashboard')
            const data = response.data

            if (data) {
                setStats({
                    totalBusinesses: data.totalBusinesses || 0,
                    activeBusinesses: data.activeBusinesses || 0,
                    monthlyRevenue: data.monthlyRevenue || 0,
                    subscriptionCount: data.totalSubscribers || 0,
                    aiTokensUsed: data.totalTokensThisMonth || 0,
                    totalSubscribers: data.totalSubscribers || 0
                })

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

    // Businesses Management
    const fetchBusinesses = useCallback(async (query = '') => {
        const isAdmin = user?.role?.toUpperCase() === 'ADMIN'
        if (!isAdmin || !token) return

        setBusinessesLoading(true)
        try {
            const endpoint = query ? `/admin/businesses/search?q=${query}` : '/admin/businesses'
            const response = await API.get(endpoint)
            setBusinesses(response.data || [])
        } catch (error) {
            console.error('Error fetching businesses:', error)
        } finally {
            setBusinessesLoading(false)
        }
    }, [user, token])

    const fetchActivityLogs = useCallback(async () => {
        const isAdmin = user?.role?.toUpperCase() === 'ADMIN'
        if (!isAdmin || !token) return

        setLogsLoading(true)
        try {
            const response = await API.get('/admin/logs/activity')
            setActivityLogs(response.data || [])
        } catch (error) {
            console.error('Error fetching activity logs:', error)
        } finally {
            setLogsLoading(false)
        }
    }, [user, token])

    const fetchAiLogs = useCallback(async () => {
        const isAdmin = user?.role?.toUpperCase() === 'ADMIN'
        if (!isAdmin || !token) return

        setLogsLoading(true)
        try {
            const response = await API.get('/admin/logs/ai')
            setAiLogs(response.data || [])
        } catch (error) {
            console.error('Error fetching AI logs:', error)
        } finally {
            setLogsLoading(false)
        }
    }, [user, token])

    const deleteBusiness = async (id) => {
        try {
            const response = await API.delete(`/admin/businesses/${id}`)
            if (response.status === 204 || response.status === 200) {
                setBusinesses(prev => prev.filter(b => b.businessId !== id))
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            console.error('Error deleting business:', error)
            return { success: false, message: error.message }
        }
    }

    const deleteAccount = async (adminId) => {
        try {
            const response = await API.delete(`/admin/accounts/${adminId}`)
            if (response.status === 204 || response.status === 200) {
                setBusinesses(prev => prev.filter(b => b.adminId !== adminId))
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            console.error('Error deleting account:', error)
            return { success: false, message: error.message }
        }
    }

    const updateAccount = async (adminId, accountData) => {
        try {
            const response = await API.put(`/admin/accounts/${adminId}`, accountData)
            if (response.status === 200) {
                // Update local businesses state
                setBusinesses(prev => prev.map(b =>
                    b.adminId === adminId ? { ...b, ...response.data } : b
                ))
                return { success: true, data: response.data }
            }
            return { success: false }
        } catch (error) {
            console.error('Error updating account:', error)
            return { success: false, message: error.message }
        }
    }

    useEffect(() => {
        const isAdmin = user?.role?.toUpperCase() === 'ADMIN'
        if (isAdmin && token) {
            fetchDashboardData()
            fetchBusinesses()
            fetchActivityLogs()
            fetchAiLogs()
        }
    }, [user, token, fetchDashboardData, fetchBusinesses, fetchActivityLogs, fetchAiLogs])

    return (
        <AdminContext.Provider value={{
            stats,
            charts,
            businesses,
            activityLogs,
            aiLogs,
            loading,
            businessesLoading,
            logsLoading,
            fetchDashboardData,
            fetchBusinesses,
            fetchActivityLogs,
            fetchAiLogs,
            updateAccount,
            deleteBusiness,
            deleteAccount,
            user
        }}>
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
