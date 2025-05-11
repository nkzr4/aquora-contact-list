// API service for contact management
const API_URL = 'http://localhost:8080/api';

export const fetchContacts = async (): Promise<any[]> => {
  const response = await fetch(`${API_URL}/contacts`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch contacts');
  }
  return await response.json();
};

export const getContact = async (id: number): Promise<any> => {
  const response = await fetch(`${API_URL}/contacts/${id}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch contact');
  }
  return await response.json();
};

export const createContact = async (contactData: FormData): Promise<any> => {
  const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    body: contactData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create contact');
  }
  return await response.json();
};

export const updateContact = async (id: number, contactData: FormData): Promise<any> => {
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'PUT',
    body: contactData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update contact');
  }
  return await response.json();
};

export const deleteContact = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete contact');
  }
}