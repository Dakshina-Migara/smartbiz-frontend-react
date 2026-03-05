import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import API from '../api/axios'

const ProductContext = createContext()

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [dashboardStats, setDashboardStats] = useState(null)
    const { user, token } = useAuth()

    const fetchProducts = useCallback(async () => {
        if (!user?.businessId || !token) return
        setLoading(true)
        try {
            const response = await API.get(`/business/${user.businessId}/inventory`)
            const data = response.data

            // Map backend fields to frontend fields
            const mappedData = data.map(p => ({
                id: p.productId,
                name: p.productName,
                sku: p.sku,
                category: p.category,
                price: p.price,
                cost: p.cost,
                stock: p.stockLevel,
                minStock: p.minStockLevel
            }))
            setProducts(mappedData)
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setLoading(false)
        }
    }, [user?.businessId, token])

    const fetchDashboardStats = useCallback(async () => {
        if (!user?.businessId || !token) return
        try {
            const response = await API.get(`/business/${user.businessId}/dashboard/kpis`)
            setDashboardStats(response.data)
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error)
        }
    }, [user?.businessId, token])

    useEffect(() => {
        if (user?.businessId && token) {
            fetchProducts()
            fetchDashboardStats()
        } else {
            setProducts([])
            setDashboardStats(null)
        }
    }, [user?.businessId, token, fetchProducts, fetchDashboardStats])

    const addProduct = async (product) => {
        if (!user?.businessId) return { success: false }
        try {
            const response = await API.post('/business/inventory', {
                productName: product.name,
                sku: product.sku,
                category: product.category,
                price: parseFloat(product.price),
                cost: parseFloat(product.cost),
                stockLevel: parseInt(product.stock),
                minStockLevel: parseInt(product.minStock),
                businessId: user.businessId
            })
            if (response.status === 201 || response.status === 200) {
                fetchProducts()
                fetchDashboardStats()
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const updateProduct = async (id, updatedProduct) => {
        if (!user?.businessId) return { success: false }
        try {
            const response = await API.put(`/business/${user.businessId}/inventory/${id}/edit`, {
                productName: updatedProduct.name,
                sku: updatedProduct.sku,
                category: updatedProduct.category,
                price: parseFloat(updatedProduct.price),
                cost: parseFloat(updatedProduct.cost),
                stockLevel: parseInt(updatedProduct.stock),
                minStockLevel: parseInt(updatedProduct.minStock),
                businessId: user.businessId
            })
            if (response.status === 200) {
                fetchProducts()
                fetchDashboardStats()
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const updateStock = async (productId, currentStock, change) => {
        if (!user?.businessId || !token) return { success: false }
        const newQuantity = currentStock + change
        if (newQuantity < 0) return { success: false, message: 'Stock cannot be negative' }

        try {
            const response = await API.put(`/business/${user.businessId}/inventory/${productId}`, null, {
                params: { quantity: newQuantity }
            })
            if (response.status === 200) {
                // Update local state for fast feedback
                setProducts(prev => prev.map(p =>
                    p.id === productId ? { ...p, stock: newQuantity } : p
                ))
                fetchDashboardStats() // Refresh totals
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            console.error('Failed to update stock:', error)
            return { success: false }
        }
    }

    const deleteProduct = async (id) => {
        if (!user?.businessId) return { success: false }
        try {
            const response = await API.delete(`/business/${user.businessId}/inventory/${id}`)
            if (response.status === 204 || response.status === 200) {
                fetchProducts()
                fetchDashboardStats()
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    return (
        <ProductContext.Provider value={{
            products,
            loading,
            dashboardStats,
            addProduct,
            updateProduct,
            updateStock,
            deleteProduct,
            refreshData: () => { fetchProducts(); fetchDashboardStats(); }
        }}>
            {children}
        </ProductContext.Provider>
    )
}

export const useProducts = () => {
    const context = useContext(ProductContext)
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider')
    }
    return context
}
