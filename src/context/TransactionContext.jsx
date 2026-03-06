import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import API from '../api/axios'

const TransactionContext = createContext()

export function TransactionProvider({ children }) {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(false)
    const { user, token } = useAuth()

    const fetchTransactions = useCallback(async () => {
        if (!user?.businessId || !token) return
        setLoading(true)
        try {
            const response = await API.get(`/business/${user.businessId}/transactions/getAll`)
            setTransactions(response.data)
        } catch (error) {
            console.error('Failed to fetch transactions:', error)
        } finally {
            setLoading(false)
        }
    }, [user?.businessId, token])

    useEffect(() => {
        if (user?.businessId && token) {
            fetchTransactions()
        } else {
            setTransactions([])
        }
    }, [user?.businessId, token, fetchTransactions])

    const addTransaction = async (data) => {
        if (!user?.businessId || !token) return { success: false, error: 'Not authenticated' }
        try {
            const payload = { ...data, businessId: user.businessId }
            const response = await API.post(`/business/${user.businessId}/transactions/addTransaction`, payload)
            if (response.status === 201 || response.status === 200) {
                fetchTransactions()
                return { success: true, data: response.data }
            }
            return { success: false, error: 'Failed to record transaction' }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const editTransaction = async (id, data) => {
        if (!user?.businessId || !token) return { success: false, error: 'Not authenticated' }
        try {
            const payload = { ...data, businessId: user.businessId }
            const response = await API.put(`/business/${user.businessId}/transactions/${id}`, payload)
            if (response.status === 200) {
                fetchTransactions()
                return { success: true, data: response.data }
            }
            return { success: false, error: 'Failed to update transaction' }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const deleteTransaction = async (id) => {
        if (!user?.businessId || !token) return { success: false, error: 'Not authenticated' }
        try {
            await API.delete(`/business/${user.businessId}/transactions/${id}`)
            fetchTransactions() // Refresh the list
            return { success: true }
        } catch (error) {
            console.error('Failed to delete transaction:', error)
            return { success: false, error: error.message }
        }
    }

    return (
        <TransactionContext.Provider value={{
            transactions,
            loading,
            fetchTransactions,
            addTransaction,
            editTransaction,
            deleteTransaction
        }}>
            {children}
        </TransactionContext.Provider>
    )
}

export const useTransactions = () => {
    const context = useContext(TransactionContext)
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider')
    }
    return context
}
