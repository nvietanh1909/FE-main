import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/features-user/auth/pages/LoginPage.tsx'
import DashboardPage from '@/features-user/dashboard/pages/DashboardPage.tsx'
import UserLayout from '@/layouts/UserLayout.tsx'
import ProtectedRoute from '@/routes/ProtectedRoute.tsx'
import '@/assets/styles/root.css'
import RegisterPage from '@/features-user/auth/pages/RegisterPage.tsx'
import PublicRoute from '@/routes/PublicRoute.tsx'
import NotFoundPage from '@/routes/NotFoundRoute.tsx'
import ProcedurePage from '@/features-user/procedure/pages/ProcedurePage.tsx'
import MessagePage from '@/features-user/message/pages/MessagePage.tsx'
import SettingPage from '@/features-user/setting/pages/SettingPage.tsx'
import ProcedureDetailPage from '@/features-user/procedure/pages/ProcedureDetailPage.tsx';
import AllProceduresPage from '@/features-user/procedure/pages/AllProceduresPage.tsx';
import AdminLoginPage from '@/features-admin/auth/pages/AdminLoginPage.tsx';
import AdminDashboardPage from '@/features-admin/dashboard/pages/AdminDashboardPage.tsx';
import AdminProtectedRoute from '@/routes/AdminProtectedRoute.tsx';
import AdminPublicRoute from '@/routes/AdminPublicRoute.tsx';
import AdminLayout from '@/layouts/AdminLayout.tsx';
import UsersPage from '@/features-admin/users/pages/UsersPage.tsx';
import AdminSettingsPage from '@/features-admin/settings/pages/AdminSettingsPage.tsx';
import AdminMessagePage from '@/features-admin/messages/pages/AdminMessagePage.tsx';
import AdminProcedurePage from './features-admin/procedure/pages/AdminProcedurePage.tsx'
import AdminDocumentPage from './features-admin/document/pages/AdminDocumentPage.tsx';

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

        {/* Admin routes */}
        <Route path="/admin/login" element={
          <AdminPublicRoute>
            <AdminLoginPage />
          </AdminPublicRoute>
        } />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="procedures" element={<AdminProcedurePage />} />
          <Route path="documents" element={<AdminDocumentPage />} />
          <Route path="messages" element={<AdminMessagePage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>


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

