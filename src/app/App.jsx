import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
import BusinessOwnerSupplier from '../pages/Owner/Suppliers/BusinessOwnerSupplier'
import BusinessOwnerSales from '../pages/Owner/Sales/BusinessOwnerSales'
import BusinessOwnerTransaction from '../pages/Owner/Transaction/BusinessOwnerTransaction'
import BusinessOwnerReports from '../pages/Owner/Reports/BusinessOwnerReports'
import BusinessOwnerAiInsight from '../pages/Owner/AiInsight/BusinessOwnerAiInsight'
import AdminOverview from '../pages/Admin/Overview/AdminOverview'

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
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: 'sans-serif',
        color: '#64748b'
      }}>
        Loading SmartBiz...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <TitleManager />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/owner/dashboard" element={<BusinessOwnerDashboard />} />
        <Route path="/owner/products" element={<OwnerProductsPage />} />
        <Route path="/owner/inventory" element={<BusinessOwnerInventory />} />
        <Route path="/owner/customers" element={<BusinessOwnerCustomers />} />
        <Route path="/owner/suppliers" element={<BusinessOwnerSupplier />} />
        <Route path="/owner/sales" element={<BusinessOwnerSales />} />
        <Route path="/owner/transactions" element={<BusinessOwnerTransaction />} />
        <Route path="/owner/reports" element={<BusinessOwnerReports />} />
        <Route path="/owner/ai-insight" element={<BusinessOwnerAiInsight />} />
        <Route path="/admin/overview" element={<AdminOverview />} />
        <Route path="/admin/dashboard" element={<AdminOverview />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CustomerProvider>
          <SupplierProvider>
            <SalesProvider>
              <TransactionProvider>
                <ReportsProvider>
                  <AiInsightProvider>
                    <AppContent />
                  </AiInsightProvider>
                </ReportsProvider>
              </TransactionProvider>
            </SalesProvider>
          </SupplierProvider>
        </CustomerProvider>
      </ProductProvider>
    </AuthProvider>
  )
}