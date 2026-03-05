import { createContext, useContext, useState, useEffect } from 'react'
import API from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser && token) {
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    }, [token])

    const login = async (email, password) => {
        try {
            const response = await API.post('/auth/login', { email, password })
            const data = response.data

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data))
            setToken(data.token)
            setUser(data)
            return { success: true, data }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            }
        }
    }

    const register = async (formData) => {
        try {
            const response = await API.post('/auth/register', formData)
            const data = response.data

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data))
            setToken(data.token)
            setUser(data)
            return { success: true, data }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
        window.location.href = '/login'
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
