
import { Company } from '../types/types';
import { saveToLocalStorage, getFromLocalStorage, generateId } from '../utils/storageUtils';

const getCompanies = (): Company[] => {
  return getFromLocalStorage<Company[]>('companies') || [];
};

const getCompanyByCNPJ = (cnpj: string): Company | null => {
  const companies = getCompanies();
  return companies.find(company => company.cnpj === cnpj) || null;
};

const getCompanyById = (id: string): Company | null => {
  const companies = getCompanies();
  return companies.find(company => company.id === id) || null;
};


const registerCompany = (companyData: { name: string; cnpj: string }): string => {
  try {
    const companies = getCompanies();
    
    const existingCompany = companies.find(c => c.cnpj === companyData.cnpj);
    if (existingCompany) {
      return existingCompany.id;
    }
    
    const newCompany: Company = {
      id: generateId(),
      name: companyData.name,
      cnpj: companyData.cnpj,
      createdAt: new Date(),
      employees: []
    };

    
    
    companies.push(newCompany);
    saveToLocalStorage('companies', companies);
    
    return newCompany.id;
  } catch (error) {
    console.error('Erro ao registrar empresa:', error);
    return "";
  }
};

export const companyService = {
  getCompanies,
  getCompanyByCNPJ,
  getCompanyById, // <- adiciona aqui
  registerCompany,
};


