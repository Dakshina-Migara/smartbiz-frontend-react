import { useState, useEffect } from 'react'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import Button from '../../../common/component/Button/Button'
import MuiTextField from '@mui/material/TextField'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SendIcon from '@mui/icons-material/Send'
import { useAiInsight } from '../../../context/AiInsightContext'
import './BusinessOwnerAiInsight.css'

export default function BusinessOwnerAiInsight() {
    const { generateInsight, loading } = useAiInsight()

    const [activeTab, setActiveTab] = useState('business_report')
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState('')

    const tabs = [
        { id: 'business_report', label: 'Business Reports' },
        { id: 'email', label: 'Email Generator' },
        { id: 'marketing', label: 'Marketing Posts' }
    ]

    const quickQuestions = {
        'business_report': ['Top Products', 'Profit Analysis', 'Stock Status'],
        'email': ['Follow-up Email', 'Welcome Email', 'Discount Offer'],
        'marketing': ['Facebook Post', 'Instagram Captions', 'Holiday Promo']
    }

    // Clear messages when switching tabs
    useEffect(() => {
        setMessages([])
        setPrompt('')
    }, [activeTab])

    const handleGenerate = async (queryOverride = null) => {
        const query = typeof queryOverride === 'string' ? queryOverride : prompt
        if (!query.trim()) return

        const userMessage = { role: 'user', content: query }
        setMessages(prev => [...prev, userMessage])
        setPrompt('')

        const result = await generateInsight(query, activeTab)
        if (result.success) {
            const aiMessage = { role: 'ai', content: result.data.response }
            setMessages(prev => [...prev, aiMessage])
        } else {
            const errorMessage = { role: 'error', content: result.error || 'Failed to generate response' }
            setMessages(prev => [...prev, errorMessage])
        }
    }

    return (
        <OwnerLayout breadcrumb="AI-Insight">
            <div className="ai-insight-page">
                <div className="ai-card">
                    <div className="ai-card-header" style={{ justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AutoAwesomeIcon sx={{ color: '#8A2BE2', fontSize: 24 }} />
                            <h2 className="ai-title">AI Insights</h2>
                        </div>
                        <div className="status-badge" style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                            Live
                        </div>
                    </div>

                    <div className="ai-tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ai-tab ${activeTab === tab.id ? 'ai-tab--active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="ai-chat-display" style={{ 
                        height: '400px', 
                        overflowY: 'auto', 
                        border: '1px solid #E5E7EB', 
                        borderRadius: '8px', 
                        padding: '16px', 
                        marginBottom: '20px',
                        backgroundColor: '#F9FAFB',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        {messages.length === 0 && (
                            <div style={{ textAlign: 'center', color: '#6B7280', margin: 'auto' }}>
                                <AutoAwesomeIcon sx={{ opacity: 0.3, fontSize: 40, mb: 1 }} />
                                <p>No messages yet. Ask something about your business!</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} style={{ 
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                backgroundColor: msg.role === 'user' ? '#8A2BE2' : (msg.role === 'error' ? '#FEE2E2' : '#FFFFFF'),
                                color: msg.role === 'user' ? 'white' : (msg.role === 'error' ? '#991B1B' : '#1F2937'),
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                border: msg.role === 'ai' ? '1px solid #E5E7EB' : 'none',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', padding: '12px 16px', color: '#6B7280' }}>
                                Considering your data...
                            </div>
                        )}
                    </div>

                    <div className="ai-form-section">
                        <div className="ai-input-group" style={{ display: 'flex', gap: '8px' }}>
                            <MuiTextField
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
                                placeholder="Type your command or question..."
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={1}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        backgroundColor: '#F3F4F6'
                                    }
                                }}
                            />
                            <Button
                                variant="filled"
                                onClick={() => handleGenerate()}
                                disabled={loading || !prompt.trim()}
                                sx={{
                                    backgroundColor: '#0B0F19',
                                    color: '#FFF',
                                    minWidth: '100px',
                                    borderRadius: '8px',
                                    textTransform: 'none'
                                }}
                            >
                                <SendIcon sx={{ transform: 'rotate(-45deg)' }} />
                            </Button>
                        </div>
                    </div>

                    <div className="ai-quick-questions" style={{ marginTop: '20px' }}>
                        <h4 className="quick-questions-title">Quick Questions</h4>
                        <div className="quick-chips">
                            {quickQuestions[activeTab]?.map((q, idx) => (
                                <button
                                    key={idx}
                                    className="quick-chip"
                                    onClick={() => handleGenerate(q)}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </OwnerLayout >
    )
}
