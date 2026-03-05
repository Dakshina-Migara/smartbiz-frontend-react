import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/LoginPage/LoginPage'
import RegisterPage from '../pages/RegisterPage/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage'
import BusinessOwnerDashboard from '../pages/Owner/Dashboard/BusinessOwnerDashboard'
import OwnerProductsPage from '../pages/Owner/Products/OwnerProductsPage'
import { ProductProvider } from '../context/ProductContext'
import { AuthProvider } from '../context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/owner/dashboard" element={<BusinessOwnerDashboard />} />
            <Route path="/owner/products" element={<OwnerProductsPage />} />
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </AuthProvider>
  )
}