
import localforage from 'localforage';
import { toast } from 'sonner';

// Inicializar o banco de dados local
localforage.config({
  name: 'vigiaApp',
  storeName: 'user_data'
});

// Interface para dados do usuário
export interface User {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  empresa: string;
  cnpj: string;
  senha: string;
}

// Classe para gerenciar o banco de dados local
export class LocalDatabase {
  // Cadastrar novo usuário
  static async registerUser(userData: Omit<User, 'id'>): Promise<User | null> {
    try {
      // Verificar se já existe usuário com este email
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        toast.error('Este email já está registrado!');
        return null;
      }

      // Criar novo usuário com ID único
      const newUser: User = {
        ...userData,
        id: Date.now().toString()
      };

      // Obter lista atual de usuários
      const users = await this.getAllUsers();
      
      // Adicionar novo usuário
      users.push(newUser);
      
      // Salvar lista atualizada
      await localforage.setItem('users', users);
      
      toast.success('Cadastro realizado com sucesso!');
      return newUser;
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      toast.error('Erro ao cadastrar usuário');
      return null;
    }
  }

  // Autenticar usuário
  static async loginUser(email: string, senha: string): Promise<User | null> {
    try {
      // Buscar usuário pelo email
      const user = await this.getUserByEmail(email);
      
      // Verificar se o usuário existe e se a senha está correta
      if (user && user.senha === senha) {
        await localforage.setItem('currentUser', user);
        toast.success('Login realizado com sucesso!');
        return user;
      }
      
      toast.error('Email ou senha incorretos');
      return null;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro ao fazer login');
      return null;
    }
  }

  // Buscar usuário pelo email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.email === email) || null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  // Obter todos os usuários
  static async getAllUsers(): Promise<User[]> {
    try {
      const users = await localforage.getItem<User[]>('users');
      return users || [];
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      return [];
    }
  }

  // Obter usuário atual (logado)
  static async getCurrentUser(): Promise<User | null> {
    try {
      return await localforage.getItem<User>('currentUser');
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  // Logout de usuário
  static async logout(): Promise<void> {
    try {
      await localforage.removeItem('currentUser');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
}
