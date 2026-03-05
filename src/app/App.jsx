import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/LoginPage/LoginPage'
import RegisterPage from '../pages/RegisterPage/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage'
import BusinessOwnerDashboard from '../pages/Owner/Dashboard/BusinessOwnerDashboard'

import OwnerProductsPage from '../pages/Owner/Products/OwnerProductsPage'

function App() {
  return (
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
  )
}

export default App
