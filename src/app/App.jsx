import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import ProtectedRoute from '../common/component/ProtectedRoute/ProtectedRoute'
import PublicRoute from '../common/component/ProtectedRoute/PublicRoute'
import LoginPage from '../pages/LoginPage/LoginPage'
import RegisterPage from '../pages/RegisterPage/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage'
import BusinessOwnerDashboard from '../pages/Owner/Dashboard/BusinessOwnerDashboard'
import OwnerProductsPage from '../pages/Owner/Products/OwnerProductsPage'
import BusinessOwnerInventory from '../pages/Owner/Inventory/BusinessOwnerInventory'
import BusinessOwnerCustomers from '../pages/Owner/Customers/BusinessOwnerCustomers'
import { ProductProvider } from '../context/ProductContext'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { CustomerProvider } from '../context/CustomerContext'
import { SupplierProvider } from '../context/SupplierContext'
import { SalesProvider } from '../context/SalesContext'
import { TransactionProvider } from '../context/TransactionContext'
import { ReportsProvider } from '../context/ReportsContext'
import { AiInsightProvider } from '../context/AiInsightContext'
import BusinessOwnerSuppliers from '../pages/Owner/Suppliers/BusinessOwnerSuppliers'
import BusinessOwnerSales from '../pages/Owner/Sales/BusinessOwnerSales'
import BusinessOwnerTransaction from '../pages/Owner/Transaction/BusinessOwnerTransaction'
import BusinessOwnerReports from '../pages/Owner/Reports/BusinessOwnerReports'
import BusinessOwnerAiInsight from '../pages/Owner/AiInsight/BusinessOwnerAiInsight'
import SubscriptionPlans from '../pages/Owner/Subscription/SubscriptionPlans'
import AdminOverview from '../pages/Admin/Overview/AdminOverview'
import AdminBusinesses from '../pages/Admin/Businesses/AdminBusinesses'
import AdminUsageLogs from '../pages/Admin/UsageLogs/AdminUsageLogs'
import AdminPlans from '../pages/Admin/Plans/AdminPlans'
import { AdminProvider } from '../context/AdminContext'
import { NotificationProvider } from '../context/NotificationContext'

function TitleManager() {
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const path = location.pathname
    if (path.startsWith('/owner')) {
      document.title = 'SmartBiz-Owner'
    } else if (path.startsWith('/admin')) {
      document.title = 'SmartBiz-Admin'
    } else {
      document.title = 'SmartBiz'
    }
  }, [location, user])

  return null
}

function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: 'background.default',
      }}>
        <CircularProgress sx={{ color: '#3d3229' }} />
        <Typography sx={{ color: '#7a6e64', fontWeight: 500 }}>
          Loading SmartBiz...
        </Typography>
      </Box>
    )
  }

  return (
    <BrowserRouter>
      <TitleManager />
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['OWNER']}><BusinessOwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/products" element={<ProtectedRoute allowedRoles={['OWNER']}><OwnerProductsPage /></ProtectedRoute>} />
        <Route path="/owner/inventory" element={<ProtectedRoute allowedRoles={['OWNER']}><BusinessOwnerInventory /></ProtectedRoute>} />
        <Route path="/owner/customers" element={<ProtectedRoute allowedRoles={['OWNER']}><BusinessOwnerCustomers /></ProtectedRoute>} />
        <Route path="/owner/suppliers" element={<ProtectedRoute allowedRoles={['OWNER']}><BusinessOwnerSuppliers /></ProtectedRoute>} />
        <Route path="/owner/sales" element={<ProtectedRoute allowedRoles={['OWNER']}><BusinessOwnerSales /></ProtectedRoute>} />
        <Route path="/owner/transactions" element={<ProtectedRoute allowedRoles={['OWNER']}><BusinessOwnerTransaction /></ProtectedRoute>} />
        <Route path="/owner/reports" element={<ProtectedRoute allowedRoles={['OWNER']}><BusinessOwnerReports /></ProtectedRoute>} />
        <Route path="/owner/ai-insight" element={<ProtectedRoute allowedRoles={['OWNER']}><BusinessOwnerAiInsight /></ProtectedRoute>} />
        <Route path="/owner/subscription" element={<ProtectedRoute allowedRoles={['OWNER']}><SubscriptionPlans /></ProtectedRoute>} />
        <Route path="/admin/overview" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminOverview /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminOverview /></ProtectedRoute>} />
        <Route path="/admin/businesses" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminBusinesses /></ProtectedRoute>} />
        <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsageLogs /></ProtectedRoute>} />
        <Route path="/admin/usage-logs" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsageLogs /></ProtectedRoute>} />
        <Route path="/admin/plans" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPlans /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProductProvider>
          <CustomerProvider>
            <SupplierProvider>
              <SalesProvider>
                <TransactionProvider>
                  <ReportsProvider>
                    <AiInsightProvider>
                      <AdminProvider>
                        <AppContent />
                      </AdminProvider>
                    </AiInsightProvider>
                  </ReportsProvider>
                </TransactionProvider>
              </SalesProvider>
            </SupplierProvider>
          </CustomerProvider>
        </ProductProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}