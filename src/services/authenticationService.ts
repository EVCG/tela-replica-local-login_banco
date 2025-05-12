
import { User } from '../types/types';
import { userService } from './userService';

// Função para gerar código de verificação
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Armazenar códigos temporariamente (em produção, isso seria no banco de dados)
const verificationCodes: { [key: string]: { code: string; timestamp: number } } = {};

const login = (email: string, password: string): User | null => {
  const users = userService.getUsers();
  const user = users.find(user => user.email === email && user.password === password);
  
  if (user) {
    userService.setCurrentUser(user);
  }
  
  return user;
};

const logout = (): void => {
  localStorage.removeItem('currentUser');
};

const updatePassword = (userId: string, newPassword: string): {success: boolean; message?: string} => {
  try {
    const users = userService.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return {success: false, message: "Usuário não encontrado"};
    
    users[userIndex].password = newPassword;
    users[userIndex].temporaryPassword = false;
    
    localStorage.setItem('users', JSON.stringify(users));
    
    const currentUser = userService.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      userService.setCurrentUser(users[userIndex]);
    }
    
    return {success: true};
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return {success: false, message: "Erro ao atualizar senha"};
  }
};

const sendResetCode = async (email: string): Promise<{ success: boolean }> => {
  try {
    const users = userService.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { success: false };
    }
    
    const code = generateVerificationCode();
    verificationCodes[email] = {
      code,
      timestamp: Date.now()
    };
    
    console.log(`Código de verificação para ${email}: ${code}`);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar código:', error);
    return { success: false };
  }
};

const verifyResetCode = async (email: string, code: string): Promise<{ success: boolean }> => {
  try {
    const storedData = verificationCodes[email];
    
    if (!storedData) {
      return { success: false };
    }
    
    if (Date.now() - storedData.timestamp > 30 * 60 * 1000) {
      delete verificationCodes[email];
      return { success: false };
    }
    
    if (storedData.code === code) {
      return { success: true };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    return { success: false };
  }
};

const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean }> => {
  try {
    const users = userService.getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return { success: false };
    }
    
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    delete verificationCodes[email];
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return { success: false };
  }
};

export const authenticationService = {
  login,
  logout,
  updatePassword,
  sendResetCode,
  verifyResetCode,
  resetPassword,
};

