import { useCallback } from 'react';

export const useFieldLogger = () => {
  const logField = useCallback((field: string, message: string, code: string = 'VALIDATION') => {
    console.error(`Field: ${field}, Message: ${message}, Code: ${code}`);
  }, []);

  const logMultipleFields = useCallback((errors: Array<{ field: string; message: string; code?: string }>) => {
    errors.forEach(error => {
      logField(error.field, error.message, error.code || 'VALIDATION');
    });
  }, [logField]);

  return {
    logField,
    logMultipleFields
  };
};
