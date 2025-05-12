import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Contact } from '../types';
import { formatDate, formatPhone } from '../utils/formatters';

// Tipos para gerenciar os diferentes tipos de modais
export type ModalType = 'none' | 'success' | 'error' | 'confirmDelete' | 'confirmUpdate';

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

export default NotificationModal; 