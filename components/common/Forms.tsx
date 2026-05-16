'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle } from 'lucide-react';

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Palavra-passe deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Palavra-passe deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['farmer', 'buyer', 'admin']),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Palavras-passe não coincidem',
  path: ['confirmPassword'],
});

export const productSchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres'),
  description: z.string().min(20, 'Descrição deve ter no mínimo 20 caracteres'),
  price: z.number().positive('Preço deve ser positivo'),
  category: z.string().min(1, 'Selecione uma categoria'),
  location: z.string().min(1, 'Selecione uma localização'),
  quantity: z.number().positive('Quantidade deve ser positiva'),
  unit: z.string().min(1, 'Selecione uma unidade'),
  imageUrl: z.string().url('URL de imagem inválida').optional().or(z.literal('')),
  type: z.enum(['sell', 'buy']),
});

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-stone-900">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, ...props }, ref) => (
    <FormField label={label} error={error} required={props.required}>
      <input
        ref={ref}
        {...props}
        className={`w-full px-4 py-2.5 bg-white border rounded-lg font-medium outline-none transition-all ${
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-stone-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
        }`}
      />
    </FormField>
  )
);

FormInput.displayName = 'FormInput';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, ...props }, ref) => (
    <FormField label={label} error={error} required={props.required}>
      <select
        ref={ref}
        {...props}
        className={`w-full px-4 py-2.5 bg-white border rounded-lg font-medium outline-none transition-all appearance-none ${
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-stone-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
        }`}
      >
        <option value="">Selecione uma opção</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FormField>
  )
);

FormSelect.displayName = 'FormSelect';

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ label, error, ...props }, ref) => (
    <FormField label={label} error={error} required={props.required}>
      <textarea
        ref={ref}
        {...props}
        className={`w-full px-4 py-2.5 bg-white border rounded-lg font-medium outline-none transition-all resize-none ${
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-stone-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
        }`}
        rows={4}
      />
    </FormField>
  )
);

FormTextArea.displayName = 'FormTextArea';

export function FormMessage({ type, message }: { type: 'error' | 'success'; message: string }) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${
      type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function FormButton({
  loading,
  disabled,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`w-full px-6 py-3 rounded-lg font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${
        disabled || loading
          ? 'bg-stone-300 text-stone-600 cursor-not-allowed'
          : 'bg-emerald-600 text-white hover:bg-emerald-700'
      }`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
