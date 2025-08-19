import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFieldLogger } from './use-field-logger';

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export const useAutoToast = () => {
  const { toast } = useToast();
  const { logMultipleFields } = useFieldLogger();

  const showErrorToast = useCallback((
    error: any, 
    title: string = 'Có lỗi xảy ra',
    defaultMessage: string = 'Vui lòng thử lại'
  ) => {
    let errorMessage = defaultMessage;
    if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
      logMultipleFields(error.response.errors);
      errorMessage = error.response.errors.map((err: ValidationError) => err.message).join(', ');
    }
    else if (error.message && error.message.includes('errors')) {
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.errors && Array.isArray(errorData.errors)) {
          logMultipleFields(errorData.errors);
          errorMessage = errorData.errors.map((err: ValidationError) => err.message).join(', ');
        }
      } catch (parseError) {
        console.error('Error parsing error message:', parseError);
      }
    }
    toast({
      title,
      description: errorMessage,
      variant: "destructive",
    });

    return errorMessage;
  }, [toast, logMultipleFields]);

  return {
    showErrorToast
  };
};
