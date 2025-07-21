import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/features/auth/pages/LoginPage.tsx'
import DashboardPage from '@/features/dashboard/pages/DashboardPage.tsx'
import UserLayout from '@/layouts/UserLayout.tsx'
import ProtectedRoute from '@/routes/ProtectedRoute.tsx'
import '@/assets/styles/root.css'
import RegisterPage from '@/features/auth/pages/RegisterPage.tsx'
import PublicRoute from '@/routes/PublicRoute.tsx'
import NotFoundPage from '@/routes/NotFoundRoute.tsx'
import ProcedurePage from '@/features/procedure/pages/ProcedurePage.tsx'
import MessagePage from '@/features/message/pages/MessagePage.tsx'
import SettingPage from '@/features/setting/pages/SettingPage.tsx'
import ProcedureDetailPage from '@/features/procedure/pages/ProcedureDetailPage.tsx';
import AllProceduresPage from '@/features/procedure/pages/AllProceduresPage.tsx';

function App() {
  return (
    
    <Router>
      <Routes>

        {/* Public routes: Login, Register */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />

        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />


        {/* Protected routes: Dashboard */}
        <Route path="/" element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="procedures" element={<ProcedurePage />} />
          <Route path="procedures/:id" element={<ProcedureDetailPage />} />
          <Route path="procedures/all/:type" element={<AllProceduresPage />} />
          <Route path="messages" element={<MessagePage />} />
          <Route path="settings" element={<SettingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>


        {/* Redirect to login if routes are not exist */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  )
}

export default App

