
import { User } from '../types/types';
import { saveToLocalStorage, getFromLocalStorage, generateId } from '../utils/storageUtils';
import { companyService } from './companyService';

const getUsers = (): User[] => {
  return getFromLocalStorage<User[]>('users') || [];
};

const setCurrentUser = (user: User): void => {
  saveToLocalStorage('currentUser', user);
};

const getCurrentUser = (): User | null => {
  return getFromLocalStorage<User>('currentUser');
};

const registerUser = (user: Omit<User, 'id' | 'createdAt'>): boolean => {
  try {
    const users = getUsers();
    if (users.find(u => u.email === user.email)) {
      console.log('Email já cadastrado');
      return false;
    }

    let companyId = user.companyId || "";
    if (user.companyName && user.cnpj && !companyId) {
      const existingCompany = companyService.getCompanyByCNPJ(user.cnpj);
      
      if (existingCompany) {
        companyId = existingCompany.id;
      } else {
        companyId = companyService.registerCompany({
          name: user.companyName,
          cnpj: user.cnpj
        });
        
        if (!companyId) return false;
      }
    }

    const newUser: User = {
      id: generateId(),
      ...user,
      companyId: companyId,
      password: user.password || 'padrao123',
      createdAt: new Date(),
      temporaryPassword: false,
      role: user.role || 'funcionario'
    };
    
    users.push(newUser);
    saveToLocalStorage('users', users);
    
    if (users.length === 1) {
      setCurrentUser(newUser);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return false;
  }
};

const updateUser = (userId: string, userData: Partial<User>): boolean => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) return false;
    
    users[userIndex] = { ...users[userIndex], ...userData };
    saveToLocalStorage('users', users);
    
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(users[userIndex]);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return false;
  }
};

const deleteUser = (userId: string): boolean => {
  try {
    let users = getUsers();
    users = users.filter(user => user.id !== userId);
    saveToLocalStorage('users', users);
    return true;
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return false;
  }
};

const getUsersByCompany = (companyId: string): User[] => {
  const users = getUsers();
  return users.filter(user => user.companyId === companyId);
};

export const userService = {
  getUsers,
  getCurrentUser,
  setCurrentUser,
  registerUser,
  updateUser,
  deleteUser,
  getUsersByCompany,
};

