import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell, Tooltip as PieTooltip
} from 'recharts'
import { useReports } from '../../../context/ReportsContext'

export default function BusinessOwnerReports() {
    const { salesTrend, monthlyOverview, topProducts, expensesByCategory, lowStockAlerts, loading } = useReports()

    const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#8A2BE2', '#FF69B4', '#00CED1']

    const monthlyData = [
        { name: 'Revenue', value: monthlyOverview?.revenue || 0 },
        { name: 'Expenses', value: monthlyOverview?.expenses || 0 },
        { name: 'Profit', value: monthlyOverview?.profit || 0 }
    ]

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

    if (loading) {
        return (
            <OwnerLayout breadcrumb="Reports">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 10 }}>
                    <CircularProgress sx={{ color: '#3d3229' }} />
                    <Typography sx={{ ml: 2, color: '#7a6e64' }}>Loading reports...</Typography>
                </Box>
            </OwnerLayout>
        )
    }

    const ChartCard = ({ title, children, fullWidth = false }) => (
        <Paper elevation={0} sx={{
            borderRadius: '14px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            p: 3,
            ...(fullWidth ? { gridColumn: '1 / -1' } : {}),
        }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a', fontSize: '1rem' }}>{title}</Typography>
            <Box sx={{ height: 280 }}>{children}</Box>
        </Paper>
    )

    return (
        <OwnerLayout breadcrumb="Reports">
            <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                    <ChartCard title="Sales Trend (Last 30 Days)">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false}
                                    tickFormatter={(val) => { const d = new Date(val); return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}` }}
                                    tick={{ fill: '#718096', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                                <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} labelFormatter={(label) => new Date(label).toDateString()} />
                                <Line type="monotone" dataKey="amount" stroke="#4285F4" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Monthly Overview">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                                <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: '#F7FAFC' }} />
                                <Bar dataKey="value" fill="#4285F4" radius={[4, 4, 0, 0]}>
                                    {monthlyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Expenses' ? '#EA4335' : entry.name === 'Profit' ? '#34A853' : '#4285F4'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Top Selling Products">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                                <YAxis type="category" dataKey="productName" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} width={100} />
                                <Tooltip cursor={{ fill: '#F7FAFC' }} />
                                <Bar dataKey="totalQty" fill="#10B981" radius={[0, 4, 4, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Expenses by Category">
                        {expensesByCategory.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={expensesByCategory} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={100} innerRadius={0} fill="#8884d8"
                                        label={({ cx, cy, midAngle, outerRadius, value, index }) => {
                                            const RADIAN = Math.PI / 180
                                            const radius = outerRadius * 1.35
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN)
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN)
                                            return (
                                                <text x={x} y={y} fill={COLORS[index % COLORS.length]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12" fontWeight="600">
                                                    {`${expensesByCategory[index].category} ${((value / expensesByCategory.reduce((a, b) => a + Number(b.amount), 0)) * 100).toFixed(0)}%`}
                                                </text>
                                            )
                                        }} labelLine={false}>
                                        {expensesByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <PieTooltip formatter={(value) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography sx={{ textAlign: 'center', color: '#9a8e84', py: 8 }}>No expense data available</Typography>
                        )}
                    </ChartCard>
                </Box>

                {/* Low Stock Alert */}
                <Paper elevation={0} sx={{ borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a', fontSize: '1rem' }}>Low Stock Alert</Typography>
                    {lowStockAlerts.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {lowStockAlerts.map((alert, index) => (
                                <Box key={index} sx={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    p: 2, borderRadius: '10px', backgroundColor: '#fffbeb', border: '1px solid #fef3c7',
                                }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 600, color: '#1a1a1a' }}>{alert.productName}</Typography>
                                        <Typography variant="caption" sx={{ color: '#9a8e84' }}>SKU: {alert.sku}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                        <Chip label={`${alert.stockLevel} units`} color="warning" size="small" variant="outlined" />
                                        <Typography variant="caption" sx={{ color: '#9a8e84' }}>Min: {alert.minStockLevel}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography sx={{ color: '#9a8e84' }}>All products are sufficiently stocked.</Typography>
                    )}
                </Paper>
            </Box>
        </OwnerLayout>
    )
}
