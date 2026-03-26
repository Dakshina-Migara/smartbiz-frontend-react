import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import AdminLayout from '../../../common/component/AdminLayout/AdminLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import { useAdmin } from '../../../context/AdminContext'

export default function AdminUsageLogs() {
    const { aiLogs, logsLoading } = useAdmin()

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleString('en-US', {
            month: 'numeric', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        })
    }

    const aiColumns = [
        { key: 'createdAt', label: 'Timestamp', render: (val) => formatDateTime(val) },
        {
            key: 'businessName', label: 'Business',
            render: (val, row) => (
                <Box>
                    <Typography sx={{ fontWeight: 600, color: '#2d3748', fontSize: '0.88rem' }}>{val}</Typography>
                    <Typography variant="caption" sx={{ color: '#a0aec0' }}>{row.businessOwnerName}</Typography>
                </Box>
            )
        },
        {
            key: 'type', label: 'AI Action',
            render: (val) => <Chip label={val || 'General'} size="small" variant="outlined" color="secondary" sx={{ textTransform: 'capitalize' }} />
        },
        {
            key: 'prompt', label: 'AI Usage (Prompt)',
            render: (val) => (
                <Typography title={val} sx={{ fontSize: '0.85rem', color: '#4a5568', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {val?.length > 60 ? val.substring(0, 60) + '...' : val}
                </Typography>
            )
        },
        {
            key: 'tokenUsed', label: 'AI Tokens',
            render: (val) => (
                <Typography sx={{ fontWeight: 600 }}>{val ? val.toLocaleString() : '-'}</Typography>
            )
        }
    ]

    return (
        <AdminLayout breadcrumb="Usage Logs">
            <Box>
                <Paper elevation={0} sx={{ borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>AI Usage Logs</Typography>
                        <Typography variant="body2" sx={{ color: '#7a6e64' }}>Monitor system-wide AI activity and token consumption</Typography>
                    </Box>

                    <Box sx={{ overflowX: 'auto' }}>
                        {logsLoading ? (
                            <Typography sx={{ p: 3, textAlign: 'center', color: '#7a6e64' }}>Loading logs...</Typography>
                        ) : (
                            <DataTable columns={aiColumns} data={aiLogs} />
                        )}
                    </Box>
                </Paper>
            </Box>
        </AdminLayout>
    )
}
