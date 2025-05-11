import React, { useState, useEffect } from 'react';
import { X, Upload, User } from 'lucide-react';
import { Contact, ContactFormData } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  contact: Contact | null;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
}

const DEFAULT_FORM_DATA: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  profilePicture: '',
};

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, contact, onClose, onSave }) => {
  const [formData, setFormData] = useState<ContactFormData>(DEFAULT_FORM_DATA);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        dateOfBirth: contact.dateOfBirth.split('T')[0],
        profilePicture: contact.profilePicture,
      });
      setImagePreview(contact.profilePicture);
    } else {
      setFormData(DEFAULT_FORM_DATA);
      setImagePreview('');
      setImageFile(null);
    }
    setErrors({});
    setApiError(null);
  }, [contact, isOpen]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 3) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      if (value.replace(/\D/g, '').length <= 11) {
        setFormData(prev => ({ ...prev, [name]: formattedPhone }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);
    
    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('email', formData.email);
    submissionData.append('phone', formData.phone.replace(/\D/g, ''));
    submissionData.append('dateOfBirth', formData.dateOfBirth);
    
    if (imageFile) {
      submissionData.append('profilePicture', imageFile);
    } else if (formData.profilePicture) {
      submissionData.append('profilePictureUrl', formData.profilePicture);
    }
    
    try {
      await onSave(submissionData);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Ocorreu um erro inesperado. Por favor, tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="animate-modal-in relative bg-white rounded-xl shadow-xl max-w-md w-full mx-auto">
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {contact ? 'Editar Contato' : 'Novo Contato'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Fechar modal"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          )}
          
          <div className="mb-6 flex flex-col items-center">
            <div className="relative mb-2 group cursor-pointer">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Prévia do perfil" 
                    className="h-full w-full object-cover"
                    onError={() => setImagePreview('')}
                  />
                ) : (
                  <User size={40} className="text-slate-400" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all rounded-full">
                  <Upload size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Enviar foto de perfil"
                disabled={isSubmitting}
              />
            </div>
            <span className="text-sm text-slate-500">Clique para enviar foto</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Nome*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                E-mail*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Telefone*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 0 0000-0000"
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
            
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">
                Data de Nascimento*
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border ${errors.dateOfBirth ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500`}
              />
              {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </>
              ) : contact ? 'Salvar Alterações' : 'Adicionar Contato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;