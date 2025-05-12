import axios from 'axios';
import { toast } from 'sonner';
import { User } from './localDatabase';

const API_BASE_URL = 'http://localhost:3000/api/admin';

export interface LoginData {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  whatsapp: string;
  empresa: string;
  cnpj: string;
  senha: string;
}

export class ApiService {
  static async registerUser(userData: RegisterData): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Erro ao cadastrar usuário');
        return null;
      }

      const data = await response.json();
      toast.success('Cadastro realizado com sucesso!');
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      toast.error('Erro ao conectar ao servidor');
      return null;
    }
  }

 static async requestPasswordReset(email: string) {
  return await axios.post('http://localhost:3000/api/admin/auth/reset-password', { email });
}


  static async loginUser(credentials: LoginData): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'E-mail ou senha incorretos');
        return null;
      }

      const data = await response.json();
      toast.success('Login realizado com sucesso!');
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro ao conectar ao servidor');
      return null;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = localStorage.getItem('currentUser');
      if (!userJson) return null;
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('currentUser');
  }
}
