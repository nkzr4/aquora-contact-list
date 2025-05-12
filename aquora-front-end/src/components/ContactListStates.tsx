import React from 'react';
import { Loader2, AlertTriangle, UserPlus } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Carregando contatos...' 
}) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
    <p className="text-slate-600 dark:text-slate-300">{message}</p>
  </div>
);

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertTriangle size={48} className="text-amber-500 mb-4" />
    <p className="text-slate-800 dark:text-white font-medium">{message}</p>
    <button
      onClick={onRetry}
      className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Tentar Novamente
    </button>
  </div>
);

interface EmptyStateProps {
  searchTerm?: string;
  onClearSearch?: () => void;
  onAddContact: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  searchTerm, 
  onClearSearch, 
  onAddContact 
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 text-center">
    {searchTerm ? (
      <>
        <p className="text-slate-600 dark:text-slate-300 mb-2">Nenhum contato encontrado para sua busca.</p>
        <button
          onClick={onClearSearch}
          className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300"
        >
          Limpar busca
        </button>
      </>
    ) : (
      <>
        <p className="text-slate-600 dark:text-slate-300 mb-4">Nenhum contato encontrado. Comece adicionando um novo contato.</p>
        <button
          onClick={onAddContact}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <UserPlus size={18} className="mr-2" />
          Novo Contato
        </button>
      </>
    )}
  </div>
); 