import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import MuiTextField from '@mui/material/TextField'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import CircularProgress from '@mui/material/CircularProgress'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SendIcon from '@mui/icons-material/Send'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import Button from '../../../common/component/Button/Button'
import { useAiInsight } from '../../../context/AiInsightContext'

export default function BusinessOwnerAiInsight() {
    const { generateInsight, loading } = useAiInsight()

    const [activeTab, setActiveTab] = useState(0)
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState('')

    const tabConfig = [
        { id: 'business_report', label: 'Business Reports' },
        { id: 'email', label: 'Email Generator' },
        { id: 'marketing', label: 'Marketing Posts' }
    ]

    const quickQuestions = {
        'business_report': ['Top Products', 'Profit Analysis', 'Stock Status'],
        'email': ['Follow-up Email', 'Welcome Email', 'Discount Offer'],
        'marketing': ['Facebook Post', 'Instagram Captions', 'Holiday Promo']
    }

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

        const result = await generateInsight(query, tabConfig[activeTab].id)
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
            <Box>
                <Paper elevation={0} sx={{ borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AutoAwesomeIcon sx={{ color: '#8A2BE2', fontSize: 24 }} />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>AI Insights</Typography>
                        </Box>
                        <Chip label="Live" color="success" size="small" sx={{ fontWeight: 'bold' }} />
                    </Box>

                    {/* Tabs */}
                    <Tabs
                        value={activeTab}
                        onChange={(_, newVal) => setActiveTab(newVal)}
                        sx={{
                            mb: 2,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: '8px',
                                minHeight: 40,
                            },
                            '& .Mui-selected': { color: '#8A2BE2' },
                            '& .MuiTabs-indicator': { backgroundColor: '#8A2BE2' },
                        }}
                    >
                        {tabConfig.map((tab, idx) => <Tab key={idx} label={tab.label} />)}
                    </Tabs>

                    {/* Chat Display */}
                    <Box sx={{
                        height: 400, overflowY: 'auto', border: '1px solid #E5E7EB',
                        borderRadius: '12px', p: 2, mb: 2.5, backgroundColor: '#F9FAFB',
                        display: 'flex', flexDirection: 'column', gap: 1.5,
                    }}>
                        {messages.length === 0 && (
                            <Box sx={{ textAlign: 'center', color: '#6B7280', m: 'auto' }}>
                                <AutoAwesomeIcon sx={{ opacity: 0.3, fontSize: 40, mb: 1 }} />
                                <Typography>No messages yet. Ask something about your business!</Typography>
                            </Box>
                        )}
                        {messages.map((msg, i) => (
                            <Box key={i} sx={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%', p: '12px 16px', borderRadius: '12px',
                                backgroundColor: msg.role === 'user' ? '#8A2BE2' : (msg.role === 'error' ? '#FEE2E2' : '#FFFFFF'),
                                color: msg.role === 'user' ? 'white' : (msg.role === 'error' ? '#991B1B' : '#1F2937'),
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                border: msg.role === 'ai' ? '1px solid #E5E7EB' : 'none',
                                whiteSpace: 'pre-wrap',
                            }}>
                                {msg.content}
                            </Box>
                        ))}
                        {loading && (
                            <Box sx={{ alignSelf: 'flex-start', p: '12px 16px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={16} sx={{ color: '#8A2BE2' }} />
                                Considering your data...
                            </Box>
                        )}
                    </Box>

                    {/* Input */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <MuiTextField
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
                            placeholder="Type your command or question..."
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={1}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#F3F4F6' } }}
                        />
                        <Button
                            variant="filled"
                            onClick={() => handleGenerate()}
                            disabled={loading || !prompt.trim()}
                            sx={{ backgroundColor: '#0B0F19', color: '#FFF', minWidth: 100, borderRadius: '12px', textTransform: 'none' }}
                        >
                            <SendIcon sx={{ transform: 'rotate(-45deg)' }} />
                        </Button>
                    </Box>

                    {/* Quick Questions */}
                    <Box sx={{ mt: 2.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#4a5568' }}>Quick Questions</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {quickQuestions[tabConfig[activeTab].id]?.map((q, idx) => (
                                <Chip
                                    key={idx}
                                    label={q}
                                    onClick={() => handleGenerate(q)}
                                    variant="outlined"
                                    sx={{
                                        cursor: 'pointer',
                                        borderColor: '#E5E7EB',
                                        '&:hover': { backgroundColor: '#f3f0ff', borderColor: '#8A2BE2' },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </OwnerLayout>
    )
}
