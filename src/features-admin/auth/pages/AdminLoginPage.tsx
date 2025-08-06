import React from 'react';
import AdminLoginForm from '../components/AdminLoginForm.tsx';

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-indigo-500 rounded-full opacity-10 animate-pulse delay-700"></div>
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400 rounded-full opacity-20 animate-bounce delay-300"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-400 rounded-full opacity-20 animate-bounce delay-500"></div>
            </div>
            
            {/* Grid pattern overlay */}
            <div 
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            ></div>
            
            <div className="w-full max-w-md relative z-10">
                <AdminLoginForm />
            </div>
        </div>
    );
}
