import { Contact, PagedResponse } from '../types';

// Serviço de API para gerenciamento de contatos
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Configuração padrão para requisições fetch
const defaultOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  mode: 'cors' as RequestMode
};

export const fetchContacts = async (
  searchTerm?: string, 
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<Contact>> => {
  let url = `${API_URL}/contacts?page=${page}&size=${size}`;
  
  if (searchTerm) {
    url += `&search=${encodeURIComponent(searchTerm)}`;
  }
  
  try {
    const response = await fetch(url, {
      ...defaultOptions,
      method: 'GET'
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha na conexão com o servidor' }));
      throw new Error(error.message || 'Falha ao buscar contatos');
    }
    
    const data = await response.json();
    return data;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Falha ao buscar contatos');
  }
};

export const getContact = async (id: number): Promise<Contact> => {
  try {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      ...defaultOptions,
      method: 'GET'
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha na conexão com o servidor' }));
      throw new Error(error.message || 'Falha ao buscar contato');
    }
    
    return await response.json();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Falha ao buscar contato');
  }
};

export const createContact = async (contactData: FormData): Promise<Contact> => {
  try {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      body: contactData,
      mode: 'cors'
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha na conexão com o servidor' }));
      throw new Error(error.message || 'Falha ao criar contato');
    }
    
    return await response.json();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Falha ao criar contato');
  }
};

export const updateContact = async (id: number, contactData: FormData): Promise<Contact> => {
  try {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'PUT',
      body: contactData,
      mode: 'cors'
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha na conexão com o servidor' }));
      throw new Error(error.message || 'Falha ao atualizar contato');
    }
    
    return await response.json();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Falha ao atualizar contato');
  }
};

export const deleteContact = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      ...defaultOptions,
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha na conexão com o servidor' }));
      throw new Error(error.message || 'Falha ao excluir contato');
    }
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Falha ao excluir contato');
  }
};