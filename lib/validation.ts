// Form validation utilities for AgroMoz

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password: string): {
  isStrong: boolean;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Mínimo 8 caracteres');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Incluir letras maiúsculas');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Incluir números');

  if (/[!@#$%^&*]/.test(password)) score++;
  else feedback.push('Incluir caracteres especiais');

  return {
    isStrong: score >= 3,
    feedback,
  };
};

// Validate product form
export const validateProductForm = (data: {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  location?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Título deve ter pelo menos 3 caracteres';
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Descrição deve ter pelo menos 10 caracteres';
  }

  if (!data.price || data.price <= 0) {
    errors.price = 'Preço deve ser maior que 0';
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.category = 'Categoria é obrigatória';
  }

  if (!data.location || data.location.trim().length < 2) {
    errors.location = 'Localização é obrigatória';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate contact form
export const validateContactForm = (data: {
  name?: string;
  email?: string;
  message?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres';
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Email inválido';
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Mensagem deve ter pelo menos 10 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Sanitize text input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 500); // Limit length
};

// Format price as currency
export const formatPrice = (price: number, currency: string = 'MZN'): string => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
  }).format(price);
};

// Format date in Portuguese
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-MZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

// Check if form is valid
export const isFormValid = (validation: ValidationResult): boolean => {
  return validation.isValid && Object.keys(validation.errors).length === 0;
};
