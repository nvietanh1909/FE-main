import LoginForm from "@/features-user/auth/components/LoginForm.tsx";
import React from "react";
import InfoFormLogin from "@/features-user/auth/components/InfoFormLogin.tsx";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center h-screen">
            <InfoFormLogin />
            <LoginForm />
        </div>
    )
}