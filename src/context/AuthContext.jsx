import { createContext, useContext, useState, useEffect } from 'react'
import API from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        const expirationTime = localStorage.getItem('expirationTime')

        if (savedUser && token && expirationTime) {
            const currentTime = Date.now()
            const timeLeft = parseInt(expirationTime) - currentTime

            if (timeLeft <= 0) {
                logout()
            } else {
                const timer = setTimeout(() => {
                    console.log('Session expired. Logging out...')
                    logout()
                }, timeLeft)
                setUser(JSON.parse(savedUser))
                return () => clearTimeout(timer)
            }
        }
        setLoading(false)
    }, [token])

    const login = async (email, password) => {
        try {
            const response = await API.post('/auth/login', { email, password })
            const data = response.data

            const expirationTime = Date.now() + (data.expiresIn || 3600000)
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data))
            localStorage.setItem('expirationTime', expirationTime.toString())

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

            const expirationTime = Date.now() + (data.expiresIn || 3600000)
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data))
            localStorage.setItem('expirationTime', expirationTime.toString())

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
        localStorage.removeItem('expirationTime')
        setToken(null)
        setUser(null)
        window.location.assign('/login')
    }

    const updateUser = (newData) => {
        const updatedUser = { ...user, ...newData }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, updateUser }}>
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
