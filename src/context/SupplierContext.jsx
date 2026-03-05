import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import API from '../api/axios'

const SupplierContext = createContext()

export function SupplierProvider({ children }) {
    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(false)
    const { user, token } = useAuth()

    const fetchSuppliers = useCallback(async () => {
        if (!user?.businessId || !token) return
        setLoading(true)
        try {
            const response = await API.get(`/business/${user.businessId}/suppliers/getAllSuppliers`)
            setSuppliers(response.data)
        } catch (error) {
            console.error('Failed to fetch suppliers:', error)
        } finally {
            setLoading(false)
        }
    }, [user?.businessId, token])

    useEffect(() => {
        if (user?.businessId && token) {
            fetchSuppliers()
        } else {
            setSuppliers([])
        }
    }, [user?.businessId, token, fetchSuppliers])

    const addSupplier = async (supplierData) => {
        if (!user?.businessId || !token) return { success: false }
        try {
            const response = await API.post(`/business/${user.businessId}/suppliers/addSupplier`, {
                ...supplierData,
                businessId: user.businessId
            })
            if (response.status === 201 || response.status === 200) {
                fetchSuppliers()
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const updateSupplier = async (id, updatedData) => {
        if (!user?.businessId || !token) return { success: false }
        try {
            const response = await API.put(`/business/${user.businessId}/suppliers/${id}`, {
                ...updatedData,
                businessId: user.businessId
            })
            if (response.status === 200) {
                fetchSuppliers()
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const deleteSupplier = async (id) => {
        if (!user?.businessId || !token) return { success: false }
        try {
            const response = await API.delete(`/business/${user.businessId}/suppliers/${id}`)
            if (response.status === 204 || response.status === 200) {
                fetchSuppliers()
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    return (
        <SupplierContext.Provider value={{
            suppliers,
            loading,
            addSupplier,
            updateSupplier,
            deleteSupplier,
            refreshSuppliers: fetchSuppliers
        }}>
            {children}
        </SupplierContext.Provider>
    )
}

export const useSuppliers = () => {
    const context = useContext(SupplierContext)
    if (!context) {
        throw new Error('useSuppliers must be used within a SupplierProvider')
    }
    return context
}
