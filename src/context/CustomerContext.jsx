import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import API from '../api/axios'

const CustomerContext = createContext()

export function CustomerProvider({ children }) {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(false)
    const { user, token } = useAuth()

    const fetchCustomers = useCallback(async () => {
        if (!user?.businessId || !token) return
        setLoading(true)
        try {
            const response = await API.get(`/business/${user.businessId}/customers/getAllCustomers`)
            setCustomers(response.data)
        } catch (error) {
            console.error('Failed to fetch customers:', error)
        } finally {
            setLoading(false)
        }
    }, [user?.businessId, token])

    useEffect(() => {
        if (user?.businessId && token) {
            fetchCustomers()
        } else {
            setCustomers([])
        }
    }, [user?.businessId, token, fetchCustomers])

    const addCustomer = async (customerData) => {
        if (!user?.businessId || !token) return { success: false }
        try {
            const response = await API.post(`/business/${user.businessId}/customers/create`, {
                ...customerData,
                businessId: user.businessId
            })
            if (response.status === 201 || response.status === 200) {
                fetchCustomers()
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const updateCustomer = async (id, updatedData) => {
        if (!user?.businessId || !token) return { success: false }
        try {
            const response = await API.put(`/business/${user.businessId}/customers/${id}`, {
                ...updatedData,
                businessId: user.businessId
            })
            if (response.status === 200) {
                fetchCustomers()
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const deleteCustomer = async (id) => {
        if (!user?.businessId || !token) return { success: false }
        try {
            const response = await API.delete(`/business/${user.businessId}/customers/${id}`)
            if (response.status === 204 || response.status === 200) {
                fetchCustomers()
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    return (
        <CustomerContext.Provider value={{
            customers,
            loading,
            addCustomer,
            updateCustomer,
            deleteCustomer,
            refreshCustomers: fetchCustomers
        }}>
            {children}
        </CustomerContext.Provider>
    )
}

export const useCustomers = () => {
    const context = useContext(CustomerContext)
    if (!context) {
        throw new Error('useCustomers must be used within a CustomerProvider')
    }
    return context
}
