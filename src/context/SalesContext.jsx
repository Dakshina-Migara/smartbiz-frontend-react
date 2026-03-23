import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { useProducts } from './ProductContext'
import API from '../api/axios'

const SalesContext = createContext()

export function SalesProvider({ children }) {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(false)
    const { user, token } = useAuth()
    const { refreshData } = useProducts()

    const fetchSales = useCallback(async () => {
        if (!user?.businessId || !token) return
        setLoading(true)
        try {
            const response = await API.get(`/business/${user.businessId}/sales`)
            setSales(response.data)
        } catch (error) {
            console.error('Failed to fetch sales:', error)
        } finally {
            setLoading(false)
        }
    }, [user?.businessId, token])

    useEffect(() => {
        if (user?.businessId && token) {
            fetchSales()
        } else {
            setSales([])
        }
    }, [user?.businessId, token, fetchSales])

    const searchSales = async (query) => {
        if (!user?.businessId || !token) return
        setLoading(true)
        try {
            const response = await API.get(`/business/${user.businessId}/sales/search`, {
                params: { q: query }
            })
            setSales(response.data)
        } catch (error) {
            console.error('Failed to search sales:', error)
        } finally {
            setLoading(false)
        }
    }

    const getSaleDetails = async (saleId) => {
        if (!user?.businessId || !token) return null
        try {
            const response = await API.get(`/business/${user.businessId}/sales/${saleId}`)
            return response.data
        } catch (error) {
            console.error('Failed to fetch sale details:', error)
            return null
        }
    }

    const recordSale = async (saleData) => {
        if (!user?.businessId || !token) return { success: false }
        try {
            const response = await API.post(`/mobile/${user.businessId}/sales`, {
                ...saleData
            })
            if (response.status === 201 || response.status === 200) {
                fetchSales()
                if (refreshData) refreshData()
                return { success: true, data: response.data }
            }
            return { success: false }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const deleteSale = async (saleId) => {
        if (!user?.businessId || !token) return { success: false }
        try {
            await API.delete(`/business/${user.businessId}/sales/${saleId}`)
            fetchSales() // Refresh the list
            if (refreshData) refreshData()
            return { success: true }
        } catch (error) {
            console.error('Failed to delete sale:', error)
            return { success: false, error: error.message }
        }
    }

    return (
        <SalesContext.Provider value={{
            sales,
            loading,
            fetchSales,
            searchSales,
            getSaleDetails,
            recordSale,
            deleteSale
        }}>
            {children}
        </SalesContext.Provider>
    )
}

export const useSales = () => {
    const context = useContext(SalesContext)
    if (!context) {
        throw new Error('useSales must be used within a SalesProvider')
    }
    return context
}
