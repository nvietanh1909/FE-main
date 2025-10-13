import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminProcedurePage from './AdminProcedurePage.tsx';
import AdminProcedureNavigationPage from './AdminProcedureNavigationPage.tsx';

export default function AdminProcedureWrapper() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  
  // If has type parameter, show navigation page, otherwise show upload page
  if (type) {
    return <AdminProcedureNavigationPage />;
  }
  
  return <AdminProcedurePage />;
}