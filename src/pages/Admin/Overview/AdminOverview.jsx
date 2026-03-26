import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
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
import CircularProgress from '@mui/material/CircularProgress'
import { useAdmin } from '../../../context/AdminContext'

const DASHBOARD_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

export default function AdminOverview() {
    const { stats, charts, loading } = useAdmin()

    if (loading) {
        return (
            <AdminLayout breadcrumb="Admin-Overview">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 10 }}>
                    <CircularProgress sx={{ color: '#3d3229' }} />
                    <Typography sx={{ ml: 2, color: '#7a6e64' }}>Loading statistics...</Typography>
                </Box>
            </AdminLayout>
        )
    }

    const formatCurrency = (val) => `$${Number(val).toLocaleString()}`
    const formatNumber = (val) => Number(val).toLocaleString()

    return (
        <AdminLayout breadcrumb="Overview">
            <Box>
                {/* Stats Row */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
                    <StatCard
                        title="Total Businesses"
                        value={stats.totalBusinesses.toString()}
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
                </Box>

                {/* Charts Row 1 */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mb: 3 }}>
                    <Paper elevation={0} sx={{ borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>AI Token Usage</Typography>
                        <Typography variant="body2" sx={{ color: '#7a6e64', mb: 2 }}>Daily AI token consumption</Typography>
                        <Box sx={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={charts.tokenUsage}>
                                    <defs>
                                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                                            <stop offset="50%" stopColor="#a855f7" stopOpacity={0.5} />
                                            <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="usage" stroke="#6366f1" strokeWidth={3}
                                        fillOpacity={1} fill="url(#colorUsage)"
                                        dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>

                    <Paper elevation={0} sx={{ borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>Revenue by Plan</Typography>
                        <Typography variant="body2" sx={{ color: '#7a6e64', mb: 2 }}>Monthly revenue distribution</Typography>
                        <Box sx={{ mb: 2 }}>
                            {charts.revenueByPlan.map((entry, index) => (
                                <Typography key={index} variant="body2" sx={{ color: entry.color, fontWeight: 500 }}>
                                    {entry.name}: ${entry.value}
                                </Typography>
                            ))}
                        </Box>
                        <Box sx={{ height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={charts.revenueByPlan} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {charts.revenueByPlan.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `$${value}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Box>

                {/* Charts Row 2 */}
                <Paper elevation={0} sx={{ borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>Subscribers by Plan</Typography>
                    <Typography variant="body2" sx={{ color: '#7a6e64', mb: 2 }}>Active subscriptions across all plans</Typography>
                    <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.subscribersByPlan} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#666' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#666' }} />
                                <Tooltip cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={80}>
                                    {charts.subscribersByPlan.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={DASHBOARD_COLORS[index % DASHBOARD_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Box>
        </AdminLayout>
    )
}