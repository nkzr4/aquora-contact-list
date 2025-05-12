import React from 'react';
import { UserPlus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface ContactListHeaderProps {
  onAddContact: () => void;
}

const ContactListHeader: React.FC<ContactListHeaderProps> = ({ onAddContact }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div className="flex items-center mb-4 md:mb-0">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mr-3">Agenda de Contatos</h1>
        <ThemeToggle />
      </div>
      <button
        onClick={onAddContact}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <UserPlus size={18} className="mr-2" />
        Novo Contato
      </button>
    </div>
  );
};

export default ContactListHeader; 