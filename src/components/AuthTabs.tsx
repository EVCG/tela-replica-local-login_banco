
import React from 'react';
import { cn } from '@/lib/utils';

interface AuthTabsProps {
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex w-full border-b mb-6">
      <button
        onClick={() => onTabChange('login')}
        className={cn(
          "flex-1 py-2 text-center transition-colors",
          activeTab === 'login' 
            ? 'border-b-2 border-vigia-green font-medium' 
            : 'bg-gray-100 text-gray-600'
        )}
      >
        Login
      </button>
      <button
        onClick={() => onTabChange('register')}
        className={cn(
          "flex-1 py-2 text-center transition-colors",
          activeTab === 'register' 
            ? 'border-b-2 border-vigia-green font-medium' 
            : 'bg-gray-100 text-gray-600'
        )}
      >
        Cadastrar
      </button>
    </div>
  );
};

export default AuthTabs;
