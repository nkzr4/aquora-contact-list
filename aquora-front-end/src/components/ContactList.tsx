import React, { useState, useEffect } from 'react';
import ContactCard from './ContactCard';
import ContactModal from './ContactModal';
import NotificationModal, { ModalType } from './NotificationModal';
import SearchBar from './SearchBar';
import ContactListHeader from './ContactListHeader';
import { LoadingState, ErrorState, EmptyState } from './ContactListStates';
import Pagination from './Pagination';
import { Contact, PagedResponse } from '../types';
import { fetchContacts, createContact, updateContact, deleteContact } from '../services/api';

const ContactList: React.FC = () => {
  const [contactsResponse, setContactsResponse] = useState<PagedResponse<Contact>>({
    content: [],
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: true
  });
  const [contactIndices, setContactIndices] = useState<Map<number, number>>(new Map());
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
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
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      if (searchTerm.trim() === '') {
        loadContacts();
      } else {
        const timeoutId = setTimeout(() => {
          handleSearch(searchTerm);
        }, 500);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [searchTerm]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchContacts(searchTerm, currentPage, 10);
      setContactsResponse(response);
      
      const indices = new Map<number, number>();
      const startIndex = currentPage * 10;
      
      response.content.forEach((contact, index) => {
        indices.set(contact.id, startIndex + index + 1);
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
      const response = await fetchContacts(term, currentPage, 10);
      setContactsResponse(response);
      
      const indices = new Map<number, number>();
      const startIndex = currentPage * 10;
      
      response.content.forEach((contact, index) => {
        indices.set(contact.id, startIndex + index + 1);
      });
      
      setContactIndices(indices);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      
      setNotificationModal({
        type: 'success',
        title: 'Contato excluído',
        message: `O contato "${name}" foi excluído com sucesso.`
      });
      
      loadContacts();
    } catch (err) {
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
        const newContact = await createContact(formData);
        
        setIsModalOpen(false);
        
        setNotificationModal({
          type: 'success',
          title: 'Contato adicionado',
          message: `O contato "${newContact.name}" foi adicionado com sucesso.`
        });
        
        loadContacts();
      }
    } catch (err) {
      throw err;
    }
  };

  const handleConfirmUpdate = async () => {
    if (!notificationModal.contactToUpdate) return;
    
    const { id, formData } = notificationModal.contactToUpdate;
    
    try {
      await updateContact(id, formData);
      
      setIsModalOpen(false);
      
      setNotificationModal({
        type: 'success',
        title: 'Contato atualizado',
        message: 'O contato foi atualizado com sucesso.'
      });
      
      loadContacts();
      
    } catch (err) {
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
    setCurrentPage(0);
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState message={error} onRetry={loadContacts} />;
    }
    
    if (contactsResponse.content.length === 0) {
      return (
        <EmptyState 
          searchTerm={searchTerm} 
          onClearSearch={clearSearch} 
          onAddContact={handleAddContact} 
        />
      );
    }
    
    return (
      <>
        <div className="grid grid-cols-1 gap-6">
          {contactsResponse.content.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              index={contactIndices.get(contact.id) || 0}
              onEdit={handleEditContact}
              onDelete={handleConfirmDelete}
            />
          ))}
        </div>
        <Pagination 
          currentPage={contactsResponse.pageNumber} 
          totalPages={contactsResponse.totalPages} 
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
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