import { createContext, useContext, useState } from 'react'

const ProductContext = createContext()

const initialProducts = [
    { id: 1, name: 'Wireless Mouse', sku: 'WM-001', category: 'Electronics', price: 29.99, cost: 15.00, stock: 45, minStock: 10 },
    { id: 2, name: 'USB-C Cable', sku: 'UC-002', category: 'Electronics', price: 12.99, cost: 5.50, stock: 120, minStock: 20 },
    { id: 3, name: 'Laptop Stand', sku: 'LS-003', category: 'Accessories', price: 49.99, cost: 25.00, stock: 8, minStock: 5 },
    { id: 4, name: 'Mechanical Keyboard', sku: 'MK-004', category: 'Electronics', price: 89.99, cost: 45.00, stock: 25, minStock: 10 },
    { id: 5, name: 'HDMI Adapter', sku: 'HA-005', category: 'Electronics', price: 15.99, cost: 6.00, stock: 0, minStock: 5 },
]

export function ProductProvider({ children }) {
    const [products, setProducts] = useState(initialProducts)

    const addProduct = (product) => {
        setProducts(prev => [...prev, { ...product, id: Date.now() }])
    }

    const updateProduct = (id, updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...updatedProduct, id } : p))
    }

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id))
    }

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
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
