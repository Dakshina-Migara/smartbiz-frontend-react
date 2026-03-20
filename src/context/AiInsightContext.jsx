import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import API from '../api/axios'

const AiInsightContext = createContext()

export function AiInsightProvider({ children }) {
    const [history, setHistory] = useState([])
    const [quickQuestions, setQuickQuestions] = useState([])
    const [loading, setLoading] = useState(false)
    const { user, token } = useAuth()

    const generateInsight = async (prompt, activeType) => {
        if (!user?.businessId || !token) return { success: false, error: 'Not authenticated' }
        setLoading(true)
        try {
            let endpoint = `/business/${user.businessId}/ai/query`
            if (activeType === 'email') {
                endpoint = `/business/${user.businessId}/ai/generate-email`
            } else if (activeType === 'marketing') {
                endpoint = `/business/${user.businessId}/ai/generate-post`
            }

            const response = await API.post(endpoint, { prompt })

            return {
                success: true,
                data: {
                    response: response.data.response
                }
            }
        } catch (error) {
            console.error('Failed to generate insight:', error)
            return { success: false, error: error.response?.data?.message || 'Failed to connect to AI server' }
        } finally {
            setLoading(false)
        }
    }

    const fetchHistory = useCallback(async (type = null) => {
        if (!user?.businessId || !token) return
        setLoading(true)
        try {
            const endpoint = type
                ? `/business/${user.businessId}/ai-insights/history?type=${type}`
                : `/business/${user.businessId}/ai-insights/history`
            const response = await API.get(endpoint)
            setHistory(response.data)
        } catch (error) {
            console.error('Failed to fetch AI insights history:', error)
        } finally {
            setLoading(false)
        }
    }, [user?.businessId, token])

    const fetchQuickQuestions = useCallback(async (type) => {
        if (!user?.businessId || !token) return
        try {
            const response = await API.get(`/business/${user.businessId}/ai-insights/quick-questions?type=${type}`)
            setQuickQuestions(response.data)
        } catch (error) {
            console.error('Failed to fetch quick questions:', error)
        }
    }, [user?.businessId, token])

    return (
        <AiInsightContext.Provider value={{
            history,
            quickQuestions,
            loading,
            generateInsight,
            fetchHistory,
            fetchQuickQuestions
        }}>
            {children}
        </AiInsightContext.Provider>
    )
}

export const useAiInsight = () => {
    const context = useContext(AiInsightContext)
    if (!context) {
        throw new Error('useAiInsight must be used within an AiInsightProvider')
    }
    return context
}
