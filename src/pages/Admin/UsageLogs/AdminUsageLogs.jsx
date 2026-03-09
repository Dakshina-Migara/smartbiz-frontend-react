import React, { useState } from 'react'
import AdminLayout from '../../../common/component/AdminLayout/AdminLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import { useAdmin } from '../../../context/AdminContext'
import './AdminUsageLogs.css'

export default function AdminUsageLogs() {
    const { activityLogs, aiLogs, logsLoading } = useAdmin()
    const [activeTab, setActiveTab] = useState('ai') // 'ai' or 'activity'

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

    const activityColumns = [
        {
            key: 'timestamp',
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
            key: 'feature',
            label: 'Feature',
            render: (val) => {
                const featureLower = val?.toLowerCase() || ''
                let featureClass = ''
                if (featureLower.includes('insight')) featureClass = 'insight'
                else if (featureLower.includes('email')) featureClass = 'email'
                else if (featureLower.includes('sale')) featureClass = 'sale'
                else if (featureLower.includes('marketing')) featureClass = 'marketing'
                else if (featureLower.includes('product')) featureClass = 'product'

                return (
                    <span className={`table-pill feature-pill ${featureClass}`}>
                        {val || 'General'}
                    </span>
                )
            }
        },
        { key: 'action', label: 'Action' },
        {
            key: 'aiTokens',
            label: 'AI Tokens',
            render: (val) => val ? val.toLocaleString() : '-'
        }
    ]

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
                            <h3>Usage & Activity Logs</h3>
                            <p>Monitor system activity and AI usage across all businesses</p>
                        </div>
                        <div className="logs-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
                                onClick={() => setActiveTab('ai')}
                            >
                                AI Usage
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
                                onClick={() => setActiveTab('activity')}
                            >
                                General Activity
                            </button>
                        </div>
                    </div>

                    <div className="logs-card__content">
                        {logsLoading ? (
                            <div className="loading-state">Loading logs...</div>
                        ) : (
                            <DataTable
                                columns={activeTab === 'ai' ? aiColumns : activityColumns}
                                data={activeTab === 'ai' ? aiLogs : activityLogs}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
