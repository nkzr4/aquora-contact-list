/**
 * Interface para representar erros de validação
 */
export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Valida um nome completo
 * Regras:
 * - Deve conter pelo menos nome e sobrenome
 * - Nomes próprios devem começar com letra maiúscula
 * - Preposições devem estar em minúsculo
 */
export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'O nome é obrigatório';
  }

  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length < 2) {
    return 'Informe nome e sobrenome';
  }

  // Verifica se cada parte do nome (exceto preposições) começa com letra maiúscula
  const prepositions = ['de', 'da', 'do', 'e'];
  for (let i = 0; i < nameParts.length; i++) {
    const part = nameParts[i];
    if (prepositions.includes(part.toLowerCase())) {
      if (part !== part.toLowerCase()) {
        return 'Preposições como "de", "da", "do" e "e" devem ser escritas em minúsculo';
      }
    } else if (part.charAt(0) !== part.charAt(0).toUpperCase()) {
      return 'O nome e sobrenome devem começar com letra maiúscula';
    }
  }

  return null;
};

/**
 * Valida um endereço de email
 */
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'O email é obrigatório';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Informe um email válido';
  }

  return null;
};

/**
 * Valida um número de telefone
 */
export const validatePhone = (phone: string): string | null => {
  const phoneDigits = phone.replace(/\D/g, '');
  
  if (!phoneDigits) {
    return 'O telefone é obrigatório';
  }
  
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    return 'O telefone deve ter 10 ou 11 dígitos';
  }
  
  return null;
};

/**
 * Valida uma data de nascimento
 */
export const validateDateOfBirth = (date: string): string | null => {
  if (!date) {
    return 'A data de nascimento é obrigatória';
  }
  
  const selectedDate = new Date(date);
  const today = new Date();
  
  // Remove a parte de horas, minutos e segundos para comparação justa
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate > today) {
    return 'A data de nascimento não pode ser no futuro';
  }
  
  return null;
};

/**
 * Valida um arquivo de imagem
 * @param file O arquivo a ser validado
 * @param acceptedTypes Array de tipos MIME aceitos
 * @param acceptedExtensions Array de extensões aceitas
 * @param maxSize Tamanho máximo em bytes
 */
export const validateImage = (
  file: File, 
  acceptedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'],
  acceptedExtensions: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  maxSize: number = 2 * 1024 * 1024 // 2MB
): string | null => {
  // Verificar tamanho
  if (file.size > maxSize) {
    return `O arquivo é muito grande (${(file.size / (1024 * 1024)).toFixed(2)}MB). O tamanho máximo permitido é ${(maxSize / (1024 * 1024))}MB.`;
  }
  
  // Verificar tipo MIME
  if (!acceptedTypes.includes(file.type)) {
    return 'O tipo de arquivo não é suportado. Por favor, selecione uma imagem válida.';
  }
  
  // Verificar extensão
  const fileName = file.name.toLowerCase();
  const hasValidExtension = acceptedExtensions.some(ext => fileName.endsWith(ext));
  if (!hasValidExtension) {
    return 'A extensão do arquivo não é suportada. Formatos aceitos: ' + acceptedExtensions.join(', ');
  }
  
  return null;
};

/**
 * Valida um formulário de contato completo
 */
export const validateContactForm = (formData: {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;
  
  const dateError = validateDateOfBirth(formData.dateOfBirth);
  if (dateError) errors.dateOfBirth = dateError;
  
  return errors;
}; 