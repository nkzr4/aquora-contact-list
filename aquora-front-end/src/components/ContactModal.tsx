import React, { useState, useEffect } from 'react';
import { X, Upload, User, AlertCircle } from 'lucide-react';
import { Contact, ContactFormData } from '../types';
import { formatPhoneInput } from '../utils/formatters';
import { validateContactForm, validateImage, ValidationErrors } from '../utils/validators';

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

// Tipos de imagem aceitos
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
const ACCEPTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB em bytes

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, contact, onClose, onSave }) => {
  const [formData, setFormData] = useState<ContactFormData>(DEFAULT_FORM_DATA);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Estado para o modal de erro de imagem
  const [imageErrorModal, setImageErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: ''
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: formatPhoneInput(contact.phone),
        dateOfBirth: contact.dateOfBirth.split('T')[0],
        profilePicture: contact.profilePicture,
      });
      setImagePreview(contact.profilePicture || '');
    } else {
      setFormData(DEFAULT_FORM_DATA);
      setImagePreview('');
      setImageFile(null);
    }
    setErrors({});
    setApiError(null);
  }, [contact, isOpen]);

  // Função para validar o tipo de arquivo
  const isValidImageType = (file: File): boolean => {
    // Verificar o MIME type
    const isValidMimeType = ACCEPTED_IMAGE_TYPES.includes(file.type);
    
    // Verificar a extensão do arquivo
    const fileName = file.name.toLowerCase();
    const isValidExtension = ACCEPTED_IMAGE_EXTENSIONS.some(ext => fileName.endsWith(ext));
    
    return isValidMimeType && isValidExtension;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar a imagem usando a função de validação
    const error = validateImage(file, ACCEPTED_IMAGE_TYPES, ACCEPTED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE);
    if (error) {
      showImageError(error);
      // Limpar o input de arquivo
      e.target.value = '';
      return;
    }
    
    // Verificação adicional para garantir que é realmente uma imagem
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const img = new Image();
      
      img.onload = () => {
        // A imagem carregou corretamente
        setImagePreview(reader.result as string);
        setImageFile(file);
      };
      
      img.onerror = () => {
        // Falha ao carregar a imagem
        showImageError('O arquivo selecionado não pôde ser carregado como uma imagem válida. Por favor, escolha outra imagem.');
        // Limpar o input de arquivo
        e.target.value = '';
      };
      
      img.src = reader.result as string;
    };
    
    reader.onerror = () => {
      showImageError('Erro ao ler o arquivo. Por favor, tente novamente com outra imagem.');
      // Limpar o input de arquivo
      e.target.value = '';
    };
    
    reader.readAsDataURL(file);
  };
  
  // Função auxiliar para mostrar o erro de imagem
  const showImageError = (message: string) => {
    setImageErrorModal({
      isOpen: true,
      message
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formattedPhone = formatPhoneInput(value);
      if (value.replace(/\D/g, '').length <= 11) {
        setFormData(prev => ({ ...prev, [name]: formattedPhone }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError(null);
  };

  const validateForm = (): boolean => {
    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setApiError(null);
    
    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('email', formData.email);
    submissionData.append('phone', formData.phone.replace(/\D/g, ''));
    submissionData.append('dateOfBirth', formData.dateOfBirth);
    
    if (imageFile) {
      submissionData.append('profilePicture', imageFile);
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

  // Fechar o modal de erro de imagem
  const closeImageErrorModal = () => {
    setImageErrorModal({
      isOpen: false,
      message: ''
    });
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
                accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/jpg,image/gif,image/webp" 
                onChange={handleImageChange} 
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Enviar foto de perfil"
                disabled={isSubmitting}
              />
            </div>
            <span className="text-sm text-slate-500">Clique para enviar foto</span>
            <span className="text-xs text-slate-400 text-center mt-1">
              Formatos aceitos: JPG, JPEG, PNG, GIF, WebP.<br/>
              Tamanho máximo: 2MB
            </span>
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
                  Salvando...
                </>
              ) : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Modal de erro de imagem */}
      {imageErrorModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center mb-4">
              <AlertCircle className="text-red-500 mr-3" size={24} />
              <h3 className="text-lg font-semibold">Arquivo inválido</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-700">{imageErrorModal.message}</p>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={closeImageErrorModal}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactModal;