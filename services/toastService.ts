// Toast Notification Service
'use client';

import React from 'react';
import { toast } from 'react-hot-toast';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export function showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
  const options = {
    duration,
    position: 'top-right' as const,
  };

  switch (type) {
    case 'success':
      return toast.success(message, options);
    case 'error':
      return toast.error(message, options);
    case 'warning':
      return toast('⚠️ ' + message, options);
    default:
      return toast('ℹ️ ' + message, options);
  }
}

export function showSuccessToast(message: string, duration?: number) {
  return showToast(message, 'success', duration);
}

export function showErrorToast(message: string, duration?: number) {
  return showToast(message, 'error', duration);
}

export function showWarningToast(message: string, duration?: number) {
  return showToast(message, 'warning', duration);
}

export function showInfoToast(message: string, duration?: number) {
  return showToast(message, 'info', duration);
}
