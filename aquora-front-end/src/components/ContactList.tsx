import React, { useState, useEffect } from 'react';
import { UserPlus, Search, AlertTriangle, Loader2, CheckCircle2, AlertCircle, X, HelpCircle } from 'lucide-react';
import ContactCard from './ContactCard';
import ContactModal from './ContactModal';
import { Contact } from '../types';
import { fetchContacts, createContact, updateContact, deleteContact } from '../services/api';

// Tipos para gerenciar os diferentes tipos de modais
type ModalType = 'none' | 'success' | 'error' | 'confirmDelete' | 'confirmUpdate';

interface NotificationModalProps {
  type: ModalType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  contactToDelete?: { id: number; name: string };
  contactToUpdate?: { 
    id: number; 
    formData: FormData;
    oldData?: Contact;
  };
}

const NotificationModal: React.FC<NotificationModalProps> = ({ 
  type, 
  title, 
  message, 
  onClose, 
  onConfirm, 
  contactToDelete,
  contactToUpdate
}) => {
  if (type === 'none') return null;

  const isConfirmation = type === 'confirmDelete' || type === 'confirmUpdate';
  
  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Formatar telefone para exibição
  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
    return phone;
  };
  
  // Extrair dados do FormData para comparação
  const getUpdateDetails = () => {
    if (!contactToUpdate?.formData || !contactToUpdate?.oldData) return null;
    
    const formData = contactToUpdate.formData;
    const oldData = contactToUpdate.oldData;
    
    const newName = formData.get('name') as string;
    const newEmail = formData.get('email') as string;
    const newPhone = formData.get('phone') as string;
    const newDateOfBirth = formData.get('dateOfBirth') as string;
    const hasNewProfilePicture = formData.has('profilePicture');
    
    const isNameChanged = newName !== oldData.name;
    const isEmailChanged = newEmail !== oldData.email;
    const isPhoneChanged = newPhone !== oldData.phone.replace(/\D/g, '');
    const isDateChanged = newDateOfBirth !== oldData.dateOfBirth.split('T')[0];
    
    return (
      <div className="space-y-3 my-4 text-sm">
        <p className="text-slate-500 italic mb-2">Resumo das alterações:</p>
        
        {isNameChanged && (
          <div className="bg-blue-50 p-2 rounded">
            <p className="font-medium">Nome:</p>
            <p className="line-through text-slate-500">{oldData.name}</p>
            <p className="text-blue-600">{newName}</p>
          </div>
        )}
        
        {isEmailChanged && (
          <div className="bg-blue-50 p-2 rounded">
            <p className="font-medium">E-mail:</p>
            <p className="line-through text-slate-500">{oldData.email}</p>
            <p className="text-blue-600">{newEmail}</p>
          </div>
        )}
        
        {isPhoneChanged && (
          <div className="bg-blue-50 p-2 rounded">
            <p className="font-medium">Telefone:</p>
            <p className="line-through text-slate-500">{formatPhone(oldData.phone)}</p>
            <p className="text-blue-600">{formatPhone(newPhone)}</p>
          </div>
        )}
        
        {isDateChanged && (
          <div className="bg-blue-50 p-2 rounded">
            <p className="font-medium">Data de Nascimento:</p>
            <p className="line-through text-slate-500">{formatDate(oldData.dateOfBirth)}</p>
            <p className="text-blue-600">{formatDate(newDateOfBirth)}</p>
          </div>
        )}
        
        {hasNewProfilePicture && (
          <div className="bg-blue-50 p-2 rounded">
            <p className="font-medium">Foto de Perfil:</p>
            <p className="text-blue-600">Nova imagem selecionada</p>
          </div>
        )}
        
        {!isNameChanged && !isEmailChanged && !isPhoneChanged && !isDateChanged && !hasNewProfilePicture && (
          <p className="italic text-slate-500">Nenhuma alteração identificada.</p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center mb-4">
          {type === 'success' && <CheckCircle2 className="text-green-500 mr-3" size={24} />}
          {type === 'error' && <AlertCircle className="text-red-500 mr-3" size={24} />}
          {type === 'confirmDelete' && <AlertCircle className="text-red-500 mr-3" size={24} />}
          {type === 'confirmUpdate' && <HelpCircle className="text-amber-500 mr-3" size={24} />}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-slate-700">{message}</p>
          
          {type === 'confirmUpdate' && getUpdateDetails()}
        </div>
        
        <div className={`flex ${isConfirmation ? 'justify-end' : 'justify-center'} space-x-3`}>
          {isConfirmation && (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={isConfirmation ? onConfirm : onClose}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              type === 'confirmDelete' 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : type === 'confirmUpdate'
                  ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            {isConfirmation ? 'Confirmar' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

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
                index={contactIndices.get(contact.id) || 0}
                onEdit={handleEditContact}
                onDelete={handleConfirmDelete}
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