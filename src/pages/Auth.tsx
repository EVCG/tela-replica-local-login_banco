
import React, { useState } from 'react';
import AuthTabs from '@/components/AuthTabs';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-sm w-full max-w-md">
        <h1 className="text-xl font-bold mb-6 text-center">Bem-vindo ao VIGIA</h1>
        
        <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default Auth;
