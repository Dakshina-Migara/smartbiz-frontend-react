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
            // Simulated delay for dummy response
            await new Promise(resolve => setTimeout(resolve, 1500))

            let dummyResponse = ''
            if (activeType === 'business_report') {
                dummyResponse = "Based on your recent data, your top performing product is 'Wireless Mouse'. Your overall profit margin has increased by 12% compared to last month. Consider reducing marketing spend on low-performing campaigns to further optimize costs."
            } else if (activeType === 'email') {
                dummyResponse = "Subject: Special 20% Discount Just for You!\n\nHi [Customer Name],\n\nWe noticed you've been a loyal customer of SmartBiz, and we want to thank you! Use code SMART20 at checkout for a 20% discount on your next purchase.\n\nBest regards,\nThe SmartBiz Team"
            } else {
                dummyResponse = "🚀 Exciting news from SmartBiz! We've just restocked our most popular items. Don't miss out on upgrading your workspace today. Shop now at the link in our bio! #Workspace #Tech #SmartBiz"
            }

            return {
                success: true,
                data: {
                    response: dummyResponse
                }
            }
        } catch (error) {
            console.error('Failed to generate insight:', error)
            return { success: false, error: error.response?.data?.message || error.message }
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
