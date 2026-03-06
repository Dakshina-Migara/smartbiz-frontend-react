import React from 'react'
import AdminLayout from '../../../common/component/AdminLayout/AdminLayout'
import StatCard from '../../../common/component/StatCard/StatCard'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    BarChart, Bar,
} from 'recharts'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import { useAdmin } from '../../../context/AdminContext'
import './AdminOverview.css'

export default function AdminOverview() {
    const { stats, charts, loading } = useAdmin()

    if (loading) {
        return (
            <AdminLayout breadcrumb="Admin-Overview">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px', color: '#666' }}>
                    Loading statistics...
                </div>
            </AdminLayout>
        )
    }

    const formatCurrency = (val) => `$${Number(val).toLocaleString()}`
    const formatNumber = (val) => Number(val).toLocaleString()

    return (
        <AdminLayout breadcrumb="Admin-Overview">
            <div className="admin-overview">
                {/* Stats Row */}
                <div className="admin-overview__stats">
                    <StatCard
                        title="Total Businesses"
                        value={stats.totalBusinesses.toString()}
                        subtitle={`${stats.activeBusinesses} active`}
                        icon={<BusinessOutlinedIcon />}
                        iconColor="#4a5568"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value={formatCurrency(stats.monthlyRevenue)}
                        subtitle={`From ${stats.subscriptionCount} subscriptions`}
                        icon={<AttachMoneyOutlinedIcon />}
                        iconColor="#48bb78"
                    />
                    <StatCard
                        title="AI Tokens Used"
                        value={formatNumber(stats.aiTokensUsed)}
                        subtitle="This month"
                        icon={<AutoAwesomeOutlinedIcon />}
                        iconColor="#4299e1"
                    />
                    <StatCard
                        title="Total Subscribers"
                        value={formatNumber(stats.totalSubscribers)}
                        subtitle="Across all plans"
                        icon={<PeopleOutlinedIcon />}
                        iconColor="#ed8936"
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="admin-overview__charts-row">
                    <div className="admin-overview__chart-container area-chart">
                        <div className="chart-header">
                            <h3>AI Token Usage</h3>
                            <p>Daily AI token consumption</p>
                        </div>
                        <div className="chart-body">
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={charts.tokenUsage}>
                                    <defs>
                                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="usage" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsage)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="admin-overview__chart-container pie-chart">
                        <div className="chart-header">
                            <h3>Revenue by Plan</h3>
                            <p>Monthly revenue distribution</p>
                        </div>
                        <div className="chart-body-pie">
                            <div className="pie-legend">
                                {charts.revenueByPlan.map((entry, index) => (
                                    <div key={index} className="legend-item">
                                        <span style={{ color: entry.color }}>{entry.name}: ${entry.value}</span>
                                    </div>
                                ))}
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={charts.revenueByPlan}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {charts.revenueByPlan.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `$${value}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="admin-overview__charts-row full-width">
                    <div className="admin-overview__chart-container bar-chart">
                        <div className="chart-header">
                            <h3>Subscribers by Plan</h3>
                            <p>Active subscriptions across all plans</p>
                        </div>
                        <div className="chart-body">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={charts.subscribersByPlan} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#666' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#666' }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#38a169" radius={[4, 4, 0, 0]} barSize={100} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}