import React from 'react'
import AdminLayout from '../../../common/component/AdminLayout/AdminLayout'
import StatCard from '../../../common/component/StatCard/StatCard'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie,
    BarChart, Bar
} from 'recharts'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import './AdminOverview.css'

// Mock Data for Charts
const tokenUsageData = [
    { name: 'Feb 1', usage: 45000 },
    { name: 'Feb 2', usage: 52000 },
    { name: 'Feb 3', usage: 48000 },
    { name: 'Feb 4', usage: 61000 },
    { name: 'Feb 5', usage: 59000 },
    { name: 'Feb 6', usage: 72000 },
    { name: 'Feb 7', usage: 75000 },
    { name: 'Feb 8', usage: 70000 },
]

const revenueByPlanData = [
    { name: 'Professional', value: 26611, color: '#f6ad55' },
    { name: 'Starter', value: 7644, color: '#319795' },
    { name: 'Free', value: 0, color: '#4fd1c5' },
    { name: 'Enterprise', value: 22977, color: '#805ad5' },
]

const subscribersByPlanData = [
    { name: 'Free', count: 240 },
    { name: 'Starter', count: 156 },
    { name: 'Professional', count: 90 },
    { name: 'Enterprise', count: 25 },
]

export default function AdminOverview() {
    return (
        <AdminLayout breadcrumb="Admin-Overview">
            <div className="admin-overview">
                {/* Stats Row */}
                <div className="admin-overview__stats">
                    <StatCard
                        title="Total Businesses"
                        value="5"
                        subtitle="3 active"
                        icon={<BusinessOutlinedIcon />}
                        iconColor="#4a5568"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value="$1,646"
                        subtitle="From 3 subscriptions"
                        icon={<AttachMoneyOutlinedIcon />}
                        iconColor="#48bb78"
                    />
                    <StatCard
                        title="AI Tokens Used"
                        value="217K"
                        subtitle="This month"
                        icon={<AutoAwesomeOutlinedIcon />}
                        iconColor="#4299e1"
                    />
                    <StatCard
                        title="Total Subscribers"
                        value="502"
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
                                <AreaChart data={tokenUsageData}>
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
                                {revenueByPlanData.map((entry, index) => (
                                    <div key={index} className="legend-item">
                                        <span style={{ color: entry.color }}>{entry.name}: ${entry.value}</span>
                                    </div>
                                ))}
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={revenueByPlanData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {revenueByPlanData.map((entry, index) => (
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
                                <BarChart data={subscribersByPlanData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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