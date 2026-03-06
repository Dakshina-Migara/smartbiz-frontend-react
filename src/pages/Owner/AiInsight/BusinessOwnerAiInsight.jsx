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
    const [prompt, setPrompt] = useState('')
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)

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

    // Clear response when switching tabs
    useEffect(() => {
        setResponse(null)
        setError(null)
        setPrompt('')
    }, [activeTab])

    const handleGenerate = async (queryOverride = null) => {
        const query = typeof queryOverride === 'string' ? queryOverride : prompt
        if (!query.trim()) return

        setError(null)
        setResponse(null)
        setPrompt(query)

        const result = await generateInsight(query, activeTab)
        if (result.success) {
            setResponse(result.data.response)
        } else {
            setError(result.error)
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
                        <div className="status-badge" style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                            Demo Mode (Disabled)
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

                    <div className="ai-form-section">
                        <h3 className="ai-section-title">Ask a question about your business</h3>
                        <div className="ai-input-group">
                            <MuiTextField
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., How did I perform last month?"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        backgroundColor: '#F3F4F6'
                                    }
                                }}
                            />
                        </div>

                        <Button
                            variant="filled"
                            fullWidth
                            startIcon={<SendIcon sx={{ transform: 'rotate(-45deg)', mt: '-2px' }} />}
                            onClick={() => handleGenerate()}
                            disabled={loading || !prompt.trim()}
                            sx={{
                                backgroundColor: '#0B0F19',
                                color: '#FFF',
                                borderRadius: '8px',
                                padding: '12px',
                                mt: 2,
                                textTransform: 'none',
                                fontSize: '15px'
                            }}
                        >
                            {loading ? 'Generating...' : 'Generate AI Report'}
                        </Button>
                    </div>

                    <div className="ai-quick-questions">
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

                    {(response || error) && (
                        <div className={`ai-response-container ${error ? 'ai-response-error' : ''}`}>
                            <h4 className="response-title">{error ? 'Error Generating Insight' : 'AI Response'}</h4>
                            <div className="response-content">
                                {error ? error : response?.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </OwnerLayout >
    )
}
