
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '@/services/apiService';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const RegisterForm: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (senha !== confirmarSenha) {
      toast.error('As senhas não conferem');
      return;
    }
    
    setLoading(true);
    try {
      const userData = {
        nome,
        email,
        whatsapp,
        empresa,
        cnpj,
        senha
      };
      
      const user = await ApiService.registerUser(userData);
      if (user) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatWhatsApp = (input: string) => {
    // Remove caracteres não numéricos
    const numericValue = input.replace(/\D/g, '');
    
    // Formata o número (xx) xxxxx-xxxx
    if (numericValue.length <= 2) {
      return `(${numericValue}`;
    } else if (numericValue.length <= 7) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
    } else if (numericValue.length <= 11) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
    } else {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
    }
  };

  const formatCNPJ = (input: string) => {
    // Remove caracteres não numéricos
    const numericValue = input.replace(/\D/g, '');
    
    // Formata o CNPJ xx.xxx.xxx/xxxx-xx
    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length <= 5) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2)}`;
    } else if (numericValue.length <= 8) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5)}`;
    } else if (numericValue.length <= 12) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5, 8)}/${numericValue.slice(8)}`;
    } else {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5, 8)}/${numericValue.slice(8, 12)}-${numericValue.slice(12, 14)}`;
    }
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatWhatsApp(e.target.value);
    setWhatsapp(formattedValue);
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCNPJ(e.target.value);
    setCnpj(formattedValue);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo
        </label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-blue-50/30"
          placeholder="Seu nome completo"
          required
          disabled={loading}
        />
      </div>

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
        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
          WhatsApp
        </label>
        <input
          id="whatsapp"
          type="text"
          value={whatsapp}
          onChange={handleWhatsAppChange}
          className="w-full p-2 border border-gray-300 rounded bg-blue-50/30"
          placeholder="(xx) xxxxx-xxxx"
          maxLength={16}
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-1">
          Nome da Empresa
        </label>
        <input
          id="empresa"
          type="text"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-blue-50/30"
          placeholder="Nome da sua empresa"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
          CNPJ
        </label>
        <input
          id="cnpj"
          type="text"
          value={cnpj}
          onChange={handleCNPJChange}
          className="w-full p-2 border border-gray-300 rounded bg-blue-50/30"
          placeholder="xx.xxx.xxx/xxxx-xx"
          maxLength={18}
          required
          disabled={loading}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
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
            onClick={() => setShowPassword(!showPassword)}
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

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
            Confirmar Senha
          </label>
        </div>
        <div className="relative">
          <input
            id="confirmarSenha"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-blue-50/30"
            placeholder="••••"
            required
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
          >
            {showConfirmPassword ? (
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
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
};

export default RegisterForm;
