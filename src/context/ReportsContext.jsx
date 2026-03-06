import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import API from '../api/axios'

const ReportsContext = createContext()

export function ReportsProvider({ children }) {
    const [salesTrend, setSalesTrend] = useState([])
    const [monthlyOverview, setMonthlyOverview] = useState({})
    const [topProducts, setTopProducts] = useState([])
    const [expensesByCategory, setExpensesByCategory] = useState([])
    const [lowStockAlerts, setLowStockAlerts] = useState([])
    const [loading, setLoading] = useState(false)
    const { user, token } = useAuth()

    const fetchReports = useCallback(async () => {
        if (!user?.businessId || !token) return
        setLoading(true)
        try {
            const [
                salesRes,
                monthlyRes,
                topRes,
                expensesRes,
                lowStockRes
            ] = await Promise.all([
                API.get(`/business/${user.businessId}/reports/sales-trend`),
                API.get(`/business/${user.businessId}/reports/monthly-overview`),
                API.get(`/business/${user.businessId}/reports/top-products`),
                API.get(`/business/${user.businessId}/reports/expenses-by-category`),
                API.get(`/business/${user.businessId}/reports/low-stock-alerts`)
            ])

            setSalesTrend(salesRes.data)
            setMonthlyOverview(monthlyRes.data)
            setTopProducts(topRes.data)
            setExpensesByCategory(expensesRes.data)
            setLowStockAlerts(lowStockRes.data)
        } catch (error) {
            console.error('Failed to fetch reports:', error)
        } finally {
            setLoading(false)
        }
    }, [user?.businessId, token])

    useEffect(() => {
        if (user?.businessId && token) {
            fetchReports()
        } else {
            setSalesTrend([])
            setMonthlyOverview({})
            setTopProducts([])
            setExpensesByCategory([])
            setLowStockAlerts([])
        }
    }, [user?.businessId, token, fetchReports])

    return (
        <ReportsContext.Provider value={{
            salesTrend,
            monthlyOverview,
            topProducts,
            expensesByCategory,
            lowStockAlerts,
            loading,
            fetchReports
        }}>
            {children}
        </ReportsContext.Provider>
    )
}

export const useReports = () => {
    const context = useContext(ReportsContext)
    if (!context) {
        throw new Error('useReports must be used within a ReportsProvider')
    }
    return context
}
