import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  message: string;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: '',
  });

  const handleError = useCallback((error: any, defaultMessage = 'An error occurred') => {
    const message = error?.message || error?.data?.message || defaultMessage;
    setError({ hasError: true, message });
  }, []);

  const clearError = useCallback(() => {
    setError({ hasError: false, message: '' });
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
};
