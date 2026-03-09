import React from 'react'
import AdminLayout from '../../../common/component/AdminLayout/AdminLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import { useAdmin } from '../../../context/AdminContext'
import './AdminUsageLogs.css'

export default function AdminUsageLogs() {
    const { activityLogs, logsLoading } = useAdmin()

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

    const columns = [
        {
            key: 'timestamp',
            label: 'Timestamp',
            render: (val) => formatDateTime(val)
        },
        { key: 'businessName', label: 'Business' },
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

    return (
        <AdminLayout breadcrumb="Admin-Usage Logs">
            <div className="admin-usage-logs">

                <div className="logs-card">
                    <div className="logs-card__header">
                        <div className="header-text">
                            <h3>Usage & Activity Logs</h3>
                            <p>Monitor system activity and AI usage across all businesses</p>
                        </div>
                    </div>

                    <div className="logs-card__content">
                        {logsLoading ? (
                            <div className="loading-state">Loading activity logs...</div>
                        ) : (
                            <DataTable columns={columns} data={activityLogs} />
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
