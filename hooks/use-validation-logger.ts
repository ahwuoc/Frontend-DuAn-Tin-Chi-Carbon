import { useCallback } from 'react';

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  fieldErrors: { [key: string]: string };
  validationErrors: ValidationError[];
  errorMessage: string;
}

export const useValidationLogger = () => {
  const logValidationErrors = useCallback((error: any): ValidationResult => {
    const result: ValidationResult = {
      fieldErrors: {},
      validationErrors: [],
      errorMessage: 'Có lỗi xảy ra'
    };

    console.error('Validation error:', error);
    if (error.response?.errors && Array.isArray(error.response.errors)) {
      const errors = error.response.errors;
      errors.forEach((err: ValidationError) => {
        result.fieldErrors[err.field] = err.message;
        result.validationErrors.push(err);
        console.error(`Field: ${err.field}, Message: ${err.message}, Code: ${err.code}`);
      });

      result.errorMessage = errors.map((err: ValidationError) => err.message).join(', ');
    }
    
    // Kiểm tra nếu error message chứa JSON string
    else if (error.message && error.message.includes('errors')) {
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach((err: ValidationError) => {
            result.fieldErrors[err.field] = err.message;
            result.validationErrors.push(err);
            console.error(`Field: ${err.field}, Message: ${err.message}, Code: ${err.code}`);
          });

          result.errorMessage = errorData.errors.map((err: ValidationError) => err.message).join(', ');
        }
      } catch (parseError) {
        console.error('Error parsing error message:', parseError);
      }
    }

    return result;
  }, []);

  const logFieldError = useCallback((field: string, message: string, code: string = 'VALIDATION') => {
    console.error(`Field: ${field}, Message: ${message}, Code: ${code}`);
  }, []);

  return {
    logValidationErrors,
    logFieldError
  };
};
