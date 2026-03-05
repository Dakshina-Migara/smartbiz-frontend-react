import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/LoginPage/LoginPage'
import RegisterPage from '../pages/RegisterPage/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage'
import BusinessOwnerDashboard from '../pages/Owner/Dashboard/BusinessOwnerDashboard'
import OwnerProductsPage from '../pages/Owner/Products/OwnerProductsPage'
import BusinessOwnerInventory from '../pages/Owner/Inventory/BusinessOwnerInventory'
import BusinessOwnerCustomers from '../pages/Owner/Customers/BusinessOwnerCustomers'
import { ProductProvider } from '../context/ProductContext'
import { AuthProvider } from '../context/AuthContext'
import { CustomerProvider } from '../context/CustomerContext'
import { SupplierProvider } from '../context/SupplierContext'
import BusinessOwnerSupplier from '../pages/Owner/Suppliers/BusinessOwnerSupplier'

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CustomerProvider>
          <SupplierProvider>
            <BrowserRouter>
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
              </Routes>
            </BrowserRouter>
          </SupplierProvider>
        </CustomerProvider>
      </ProductProvider>
    </AuthProvider>
  )
}