import React from 'react'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell, Tooltip as PieTooltip
} from 'recharts'
import { useReports } from '../../../context/ReportsContext'
import './BusinessOwnerReports.css'

export default function BusinessOwnerReports() {
    const {
        salesTrend,
        monthlyOverview,
        topProducts,
        expensesByCategory,
        lowStockAlerts,
        loading
    } = useReports()

    const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#8A2BE2', '#FF69B4', '#00CED1']

    // Format Monthly Overview data for BarChart
    const monthlyData = [
        { name: 'Revenue', value: monthlyOverview?.revenue || 0 },
        { name: 'Expenses', value: monthlyOverview?.expenses || 0 },
        { name: 'Profit', value: monthlyOverview?.profit || 0 }
    ]

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    }

    if (loading) {
        return (
            <OwnerLayout breadcrumb="Reports">
                <div className="reports-page loading-state">
                    Loading reports...
                </div>
            </OwnerLayout>
        )
    }

    return (
        <OwnerLayout breadcrumb="Reports">
            <div className="reports-page">
                <div className="reports-grid">

                    {/* Sales Trend */}
                    <div className="report-card">
                        <h3 className="report-title">Sales Trend (Last 30 Days)</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => {
                                            const d = new Date(val)
                                            return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`
                                        }}
                                        tick={{ fill: '#718096', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#718096', fontSize: 12 }}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip
                                        formatter={(value) => [formatCurrency(value), 'Amount']}
                                        labelFormatter={(label) => new Date(label).toDateString()}
                                    />
                                    <Line type="monotone" dataKey="amount" stroke="#4285F4" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Monthly Overview */}
                    <div className="report-card">
                        <h3 className="report-title">Monthly Overview</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: '#F7FAFC' }} />
                                    <Bar dataKey="value" fill="#4285F4" radius={[4, 4, 0, 0]}>
                                        {monthlyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'Experiences' ? '#EA4335' : entry.name === 'Profit' ? '#34A853' : '#4285F4'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div className="report-card">
                        <h3 className="report-title">Top Selling Products</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                                    <YAxis type="category" dataKey="productName" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} width={100} />
                                    <Tooltip cursor={{ fill: '#F7FAFC' }} />
                                    <Bar dataKey="totalQty" fill="#10B981" radius={[0, 4, 4, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Expenses by Category */}
                    <div className="report-card">
                        <h3 className="report-title">Expenses by Category</h3>
                        <div className="chart-container flex-center">
                            {expensesByCategory.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={expensesByCategory}
                                            dataKey="amount"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            innerRadius={0}
                                            fill="#8884d8"
                                            label={({ cx, cy, midAngle, outerRadius, value, index }) => {
                                                const RADIAN = Math.PI / 180;
                                                const radius = outerRadius * 1.35;
                                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                                return (
                                                    <text x={x} y={y} fill={COLORS[index % COLORS.length]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12" fontWeight="600">
                                                        {`${expensesByCategory[index].category} ${((value / expensesByCategory.reduce((a, b) => a + Number(b.amount), 0)) * 100).toFixed(0)}%`}
                                                    </text>
                                                )
                                            }}
                                            labelLine={false}
                                        >
                                            {expensesByCategory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <PieTooltip formatter={(value) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="no-data">No expense data available</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Low Stock Alert */}
                <div className="report-card full-width mt-6">
                    <h3 className="report-title">Low Stock Alert</h3>
                    <div className="alerts-container">
                        {lowStockAlerts.length > 0 ? (
                            lowStockAlerts.map((alert, index) => (
                                <div className="alert-item" key={index}>
                                    <div className="alert-details">
                                        <h4>{alert.productName}</h4>
                                        <p>SKU: {alert.sku}</p>
                                    </div>
                                    <div className="alert-stats">
                                        <span className="stock-level">{alert.stockLevel} units</span>
                                        <span className="min-level">Min: {alert.minStockLevel}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-data">All products are sufficiently stocked.</p>
                        )}
                    </div>
                </div>

            </div>
        </OwnerLayout>
    )
}
