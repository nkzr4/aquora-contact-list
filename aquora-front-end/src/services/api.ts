// Serviço de API para gerenciamento de contatos
const API_URL = 'http://localhost:8080/api';

// Configuração padrão para requisições fetch
const defaultOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  mode: 'cors' as RequestMode
};

export const fetchContacts = async (searchTerm?: string): Promise<any[]> => {
  const url = searchTerm 
    ? `${API_URL}/contacts?search=${encodeURIComponent(searchTerm)}` 
    : `${API_URL}/contacts`;
  
  try {
    console.log(`Buscando contatos na URL: ${url}`);
    const response = await fetch(url, {
      ...defaultOptions,
      method: 'GET'
    });
    
    console.log(`Resposta recebida: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha na conexão com o servidor' }));
      throw new Error(error.message || 'Falha ao buscar contatos');
    }
    
    const data = await response.json();
    console.log(`Dados recebidos: ${JSON.stringify(data)}`);
    return data;
  } catch (e) {
    console.error('Erro ao buscar contatos:', e);
    throw new Error(e instanceof Error ? e.message : 'Falha ao buscar contatos');
  }
};

export const getContact = async (id: number): Promise<any> => {
  try {
    console.log(`Buscando contato com ID: ${id}`);
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
    console.error('Erro ao buscar contato:', e);
    throw new Error(e instanceof Error ? e.message : 'Falha ao buscar contato');
  }
};

export const createContact = async (contactData: FormData): Promise<any> => {
  try {
    console.log('Criando novo contato');
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      body: contactData,
      mode: 'cors'
    });
    
    console.log(`Resposta recebida: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha na conexão com o servidor' }));
      throw new Error(error.message || 'Falha ao criar contato');
    }
    
    return await response.json();
  } catch (e) {
    console.error('Erro ao criar contato:', e);
    throw new Error(e instanceof Error ? e.message : 'Falha ao criar contato');
  }
};

export const updateContact = async (id: number, contactData: FormData): Promise<any> => {
  try {
    console.log(`Atualizando contato com ID: ${id}`);
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'PUT',
      body: contactData,
      mode: 'cors'
    });
    
    console.log(`Resposta recebida: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha na conexão com o servidor' }));
      throw new Error(error.message || 'Falha ao atualizar contato');
    }
    
    return await response.json();
  } catch (e) {
    console.error('Erro ao atualizar contato:', e);
    throw new Error(e instanceof Error ? e.message : 'Falha ao atualizar contato');
  }
};

export const deleteContact = async (id: number): Promise<void> => {
  try {
    console.log(`Excluindo contato com ID: ${id}`);
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      ...defaultOptions,
      method: 'DELETE'
    });
    
    console.log(`Resposta recebida: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Falha na conexão com o servidor' }));
      throw new Error(error.message || 'Falha ao excluir contato');
    }
  } catch (e) {
    console.error('Erro ao excluir contato:', e);
    throw new Error(e instanceof Error ? e.message : 'Falha ao excluir contato');
  }
};