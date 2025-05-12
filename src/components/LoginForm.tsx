
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '@/services/apiService';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      return;
    }
    
    setLoading(true);
    try {
      const user = await ApiService.loginUser({ email, senha });
      if (user) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-blue-50/30"
          placeholder="seuemail@exemplo.com"
          required
          disabled={loading}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <a href="#" className="text-sm text-vigia-link hover:underline">
            Esqueceu sua senha?
          </a>
        </div>
        <div className="relative">
          <input
            id="senha"
            type={showPassword ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-blue-50/30"
            placeholder="••••"
            required
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={toggleShowPassword}
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-500" />
            ) : (
              <Eye size={18} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-vigia-green text-white rounded transition-colors hover:bg-green-800 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};

export default LoginForm;
