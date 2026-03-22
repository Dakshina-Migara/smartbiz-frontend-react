import React from 'react'
import AdminLayout from '../../../common/component/AdminLayout/AdminLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import { useAdmin } from '../../../context/AdminContext'
import './AdminUsageLogs.css'

export default function AdminUsageLogs() {
    const { aiLogs, logsLoading } = useAdmin()

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    const aiColumns = [
        {
            key: 'createdAt',
            label: 'Timestamp',
            render: (val) => formatDateTime(val)
        },
        {
            key: 'businessName',
            label: 'Business',
            render: (val, row) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: '#2d3748' }}>{val}</span>
                    <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>{row.businessOwnerName}</span>
                </div>
            )
        },
        {
            key: 'type',
            label: 'AI Action',
            render: (val) => (
                <span className="table-pill feature-pill marketing">
                    {val || 'General'}
                </span>
            )
        },
        {
            key: 'prompt',
            label: 'AI Usage (Prompt)',
            render: (val) => (
                <div className="log-prompt-cell" title={val}>
                    {val?.length > 60 ? val.substring(0, 60) + '...' : val}
                </div>
            )
        },
        {
            key: 'tokenUsed',
            label: 'AI Tokens',
            render: (val) => val ? val.toLocaleString() : '-'
        }
    ]

    return (
        <AdminLayout breadcrumb="Usage Logs">
            <div className="admin-usage-logs">
                <div className="logs-card">
                    <div className="logs-card__header">
                        <div className="header-text">
                            <h3>AI Usage Logs</h3>
                            <p>Monitor system-wide AI activity and token consumption</p>
                        </div>
                    </div>

                    <div className="logs-card__content">
                        {logsLoading ? (
                            <div className="loading-state">Loading logs...</div>
                        ) : (
                            <DataTable
                                columns={aiColumns}
                                data={aiLogs}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
