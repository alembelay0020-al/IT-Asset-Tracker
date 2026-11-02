
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import './index.css'

import App from './App.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Categories from './pages/Categories.jsx'
import Assets from './pages/Assets.jsx'
import MyAssets from './pages/MyAssets.jsx'

// Protect Dashboard
function ProtectedDashboard() {
  const token = localStorage.getItem('token')
  return token ? <App /> : <Navigate to="/login" replace />
}

// Protect Categories
function ProtectedCategories() {
  const token = localStorage.getItem('token')
  return token ? <Categories /> : <Navigate to="/login" replace />
}

// Protect Assets
function ProtectedAssets() {
  const token = localStorage.getItem('token')
  return token ? <Assets /> : <Navigate to="/login" replace />
}

// Protect My Assets
function ProtectedMyAssets() {
  const token = localStorage.getItem('token')
  return token ? <MyAssets /> : <Navigate to="/login" replace />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected pages */}
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/categories" element={<ProtectedCategories />} />
        <Route path="/assets" element={<ProtectedAssets />} />
        <Route path="/my-assets" element={<ProtectedMyAssets />} />

        {/* Default routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
