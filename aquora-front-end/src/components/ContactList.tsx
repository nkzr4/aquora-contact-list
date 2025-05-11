import React, { useState, useEffect } from 'react';
import { UserPlus, Search, AlertTriangle, Loader2 } from 'lucide-react';
import ContactCard from './ContactCard';
import ContactModal from './ContactModal';
import { Contact } from '../types';
import { fetchContacts, createContact, updateContact, deleteContact } from '../services/api';

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = contacts.filter(contact => 
        contact.name.toLowerCase().includes(lowercasedTerm) ||
        contact.email.toLowerCase().includes(lowercasedTerm) ||
        contact.phone.includes(searchTerm)
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchContacts();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError('Falha ao carregar contatos. Por favor, tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        await deleteContact(id);
        setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
      } catch (err) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert('Falha ao excluir contato. Por favor, tente novamente.');
        }
      }
    }
  };

  const handleSaveContact = async (formData: FormData): Promise<void> => {
    try {
      if (selectedContact) {
        const updatedContact = await updateContact(selectedContact.id, formData);
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.id === selectedContact.id ? updatedContact : contact
          )
        );
      } else {
        const newContact = await createContact(formData);
        setContacts(prevContacts => [...prevContacts, newContact]);
      }
      setIsModalOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error('Falha ao salvar contato. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4 md:mb-0">Agenda de Contatos</h1>
          <button
            onClick={handleAddContact}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <UserPlus size={18} className="mr-2" />
            Novo Contato
          </button>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar contatos por nome, e-mail ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
          />
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <p className="text-slate-600">Carregando contatos...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle size={48} className="text-amber-500 mb-4" />
            <p className="text-slate-800 font-medium">{error}</p>
            <button
              onClick={loadContacts}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            {searchTerm ? (
              <>
                <p className="text-slate-600 mb-2">Nenhum contato encontrado para sua busca.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 font-medium hover:text-blue-800"
                >
                  Limpar busca
                </button>
              </>
            ) : (
              <>
                <p className="text-slate-600 mb-4">Nenhum contato encontrado. Comece adicionando um novo contato.</p>
                <button
                  onClick={handleAddContact}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <UserPlus size={18} className="mr-2" />
                  Novo Contato
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        )}
      </div>
      
      <ContactModal
        isOpen={isModalOpen}
        contact={selectedContact}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
      />
    </div>
  );
};

export default ContactList;