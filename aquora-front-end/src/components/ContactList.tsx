import React, { useState, useEffect } from 'react';
import { UserPlus, Search, AlertTriangle, Loader2, CheckCircle2, AlertCircle, X, HelpCircle } from 'lucide-react';
import ContactCard from './ContactCard';
import ContactModal from './ContactModal';
import NotificationModal, { ModalType } from './NotificationModal';
import SearchBar from './SearchBar';
import ContactListHeader from './ContactListHeader';
import { LoadingState, ErrorState, EmptyState } from './ContactListStates';
import { Contact } from '../types';
import { fetchContacts, createContact, updateContact, deleteContact } from '../services/api';

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [contactIndices, setContactIndices] = useState<Map<number, number>>(new Map());
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para modais de notificação
  const [notificationModal, setNotificationModal] = useState<{
    type: ModalType;
    title: string;
    message: string;
    contactToDelete?: { id: number; name: string };
    contactToUpdate?: { 
      id: number; 
      formData: FormData;
      oldData?: Contact;
    };
  }>({
    type: 'none',
    title: '',
    message: ''
  });

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      loadContacts();
    } else {
      const timeoutId = setTimeout(() => {
        handleSearch(searchTerm);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchContacts();
      setContacts(data);
      setFilteredContacts(data);
      
      // Criar mapa de índices para os contatos
      const indices = new Map<number, number>();
      data.forEach((contact, index) => {
        indices.set(contact.id, index + 1);
      });
      setContactIndices(indices);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Falha ao carregar contatos: ${err.message}`);
      } else {
        setError('Falha ao carregar contatos. Por favor, tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchContacts(term);
      setFilteredContacts(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Falha ao buscar contatos: ${err.message}`);
      } else {
        setError('Falha ao buscar contatos. Por favor, tente novamente.');
      }
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

  const handleConfirmDelete = (id: number, name: string) => {
    setNotificationModal({
      type: 'confirmDelete',
      title: 'Confirmar exclusão',
      message: `Tem certeza que deseja excluir o contato "${name}"? Esta ação não pode ser desfeita.`,
      contactToDelete: { id, name }
    });
  };

  const handleDeleteContact = async () => {
    if (!notificationModal.contactToDelete) return;
    
    const { id, name } = notificationModal.contactToDelete;
    
    try {
      await deleteContact(id);
      
      // Atualizar contatos e mapa de índices
      const updatedContacts = contacts.filter(contact => contact.id !== id);
      setContacts(updatedContacts);
      setFilteredContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
      
      // Recalcular os índices após a exclusão
      const newIndices = new Map<number, number>();
      updatedContacts.forEach((contact, index) => {
        newIndices.set(contact.id, index + 1);
      });
      setContactIndices(newIndices);
      
      // Mostrar notificação de sucesso após excluir
      setNotificationModal({
        type: 'success',
        title: 'Contato excluído',
        message: `O contato "${name}" foi excluído com sucesso.`
      });
      
    } catch (err) {
      // Mostrar notificação de erro
      setNotificationModal({
        type: 'error',
        title: 'Erro ao excluir',
        message: err instanceof Error 
          ? `Erro: ${err.message}` 
          : 'Falha ao excluir contato. Por favor, tente novamente.'
      });
    }
  };

  const handleSaveContact = async (formData: FormData): Promise<void> => {
    try {
      if (selectedContact) {
        // Para edição, mostrar modal de confirmação antes de salvar
        setNotificationModal({
          type: 'confirmUpdate',
          title: 'Confirmar alterações',
          message: `Deseja salvar as alterações no contato "${selectedContact.name}"?`,
          contactToUpdate: {
            id: selectedContact.id,
            formData: formData,
            oldData: selectedContact
          }
        });
      } else {
        // Para criação, salvar diretamente
        const newContact = await createContact(formData);
        
        // Atualizar contatos e adicionar novo índice
        const updatedContacts = [...contacts, newContact];
        setContacts(updatedContacts);
        setFilteredContacts(prevContacts => [...prevContacts, newContact]);
        
        // Adicionar o novo contato ao mapa de índices
        const newIndices = new Map(contactIndices);
        newIndices.set(newContact.id, updatedContacts.length);
        setContactIndices(newIndices);
        
        setIsModalOpen(false);
        
        // Mostrar notificação de sucesso após criar
        setNotificationModal({
          type: 'success',
          title: 'Contato adicionado',
          message: `O contato "${newContact.name}" foi adicionado com sucesso.`
        });
      }
    } catch (err) {
      throw err; // Deixar o componente ContactModal lidar com este erro
    }
  };

  const handleConfirmUpdate = async () => {
    if (!notificationModal.contactToUpdate) return;
    
    const { id, formData } = notificationModal.contactToUpdate;
    
    try {
      const updatedContact = await updateContact(id, formData);
      
      // Atualizar a lista de contatos mantendo os índices
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === id ? updatedContact : contact
        )
      );
      
      setFilteredContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === id ? updatedContact : contact
        )
      );
      
      setIsModalOpen(false);
      
      // Mostrar notificação de sucesso após atualizar
      setNotificationModal({
        type: 'success',
        title: 'Contato atualizado',
        message: `O contato "${updatedContact.name}" foi atualizado com sucesso.`
      });
      
    } catch (err) {
      // Mostrar notificação de erro
      setNotificationModal({
        type: 'error',
        title: 'Erro ao atualizar',
        message: err instanceof Error 
          ? `Erro: ${err.message}` 
          : 'Falha ao atualizar contato. Por favor, tente novamente.'
      });
    }
  };

  const closeNotificationModal = () => {
    setNotificationModal({
      type: 'none',
      title: '',
      message: ''
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState message={error} onRetry={loadContacts} />;
    }
    
    if (filteredContacts.length === 0) {
      return (
        <EmptyState 
          searchTerm={searchTerm} 
          onClearSearch={clearSearch} 
          onAddContact={handleAddContact} 
        />
      );
    }
    
    return (
      <div className="grid grid-cols-1 gap-6">
        {filteredContacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            index={contactIndices.get(contact.id) || 0}
            onEdit={handleEditContact}
            onDelete={handleConfirmDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContactListHeader onAddContact={handleAddContact} />
        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        {renderContent()}
      </div>
      
      <ContactModal
        isOpen={isModalOpen}
        contact={selectedContact}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
      />
      
      <NotificationModal
        type={notificationModal.type}
        title={notificationModal.title}
        message={notificationModal.message}
        contactToDelete={notificationModal.contactToDelete}
        contactToUpdate={notificationModal.contactToUpdate}
        onClose={closeNotificationModal}
        onConfirm={
          notificationModal.type === 'confirmDelete' 
            ? handleDeleteContact 
            : notificationModal.type === 'confirmUpdate'
              ? handleConfirmUpdate
              : undefined
        }
      />
    </div>
  );
};

export default ContactList;