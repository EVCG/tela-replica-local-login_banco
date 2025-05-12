// src/components/ui/ResetPasswordModal.tsx
import React, { useState } from 'react';
import { ApiService } from '@/services/apiService';

interface Props {
  onClose: () => void;
}

const ResetPasswordModal: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    setStatus('');
    try {
      await ApiService.requestPasswordReset(email);
      setStatus('✅ Um link de recuperação foi enviado para seu e-mail.');
    } catch (err) {
      setStatus('❌ Erro ao tentar enviar o e-mail. Verifique o endereço.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-center">Recuperar Senha</h2>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border mb-4 rounded"
          disabled={loading}
        />
        <button
          onClick={handleReset}
          className="w-full bg-vigia-green text-white py-2 rounded mb-2 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
        </button>
        {status && <p className="text-sm text-center text-gray-600">{status}</p>}
        <button
          onClick={onClose}
          className="w-full text-sm text-gray-500 mt-2 hover:underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
