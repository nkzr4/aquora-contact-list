import React from 'react';
import { Edit, Trash2, User } from 'lucide-react';
import { Contact } from '../types';
import { formatDate, formatPhone } from '../utils/formatters';

interface ContactCardProps {
  contact: Contact;
  index: number;
  onEdit: (contact: Contact) => void;
  onDelete: (id: number, name: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, index, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 bg-slate-100 dark:bg-slate-700 flex items-center justify-center p-4">
          {contact.profilePicture ? (
            <img 
              src={contact.profilePicture} 
              alt={`Foto de perfil de ${contact.name}`} 
              className="h-32 w-32 object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Sem+Foto';
              }}
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
              <User size={48} className="text-slate-500 dark:text-slate-400" />
            </div>
          )}
        </div>
        
        <div className="p-6 md:p-4 w-full md:w-3/4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">#{index}</span>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-1">{contact.name}</h2>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => onEdit(contact)} 
                className="p-2 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors duration-200"
                aria-label="Editar contato"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={() => onDelete(contact.id, contact.name)} 
                className="p-2 text-red-600 dark:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-slate-700 transition-colors duration-200"
                aria-label="Excluir contato"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="flex items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 w-32">E-mail:</span>
              <span className="text-sm text-slate-800 dark:text-slate-200">{contact.email}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 w-32">Telefone:</span>
              <span className="text-sm text-slate-800 dark:text-slate-200">{formatPhone(contact.phone)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 w-32">Data de Nasc.:</span>
              <span className="text-sm text-slate-800 dark:text-slate-200">{formatDate(contact.dateOfBirth)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;