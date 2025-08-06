import React from 'react'
import RegisterForm from '@/features-user/auth/components/RegisterForm.tsx'
import InfoFormRegister from '@/features-user/auth/components/InfoFormRegister.tsx'

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center h-screen">
            <InfoFormRegister />
            <RegisterForm />
        </div>
    )
}