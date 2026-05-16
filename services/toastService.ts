// Toast Notification Service
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
      return toast((t) => (
        <div className="flex items-center gap-2">
          <span>⚠️</span>
          <span>{message}</span>
        </div>
      ), options);
    default:
      return toast((t) => (
        <div className="flex items-center gap-2">
          <span>ℹ️</span>
          <span>{message}</span>
        </div>
      ), options);
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
