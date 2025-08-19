import { useState, useCallback } from "react"

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface FormErrors {
  [key: string]: string
}

/**
 * Custom hook to handle form validation
 * This hook provides validation logic for forms
 * 
 * @param validationRules - Rules for form validation
 * @returns Object with errors, validateField, validateForm, and clearErrors functions
 */
export function useFormValidation(validationRules: ValidationRules) {
  const [errors, setErrors] = useState<FormErrors>({})

  const validateField = useCallback((name: string, value: string): string | null => {
    const rule = validationRules[name]
    if (!rule) return null

    // Required validation
    if (rule.required && (!value || value.trim() === "")) {
      return "Trường này là bắt buộc"
    }

    // Skip other validations if value is empty and not required
    if (!value || value.trim() === "") return null

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return `Tối thiểu ${rule.minLength} ký tự`
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return `Tối đa ${rule.maxLength} ký tự`
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return "Giá trị không hợp lệ"
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value)
    }

    return null
  }, [validationRules])

  const validateForm = useCallback((formData: Record<string, string>): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName] || "")
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [validationRules, validateField])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }))
  }, [])

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }, [])

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    setFieldError,
    clearFieldError,
  }
}

/**
 * Common validation rules for forms
 */
export const commonValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    required: true,
    pattern: /^[0-9+\-\s()]+$/,
    minLength: 10,
  },
  password: {
    required: true,
    minLength: 6,
  },
  confirmPassword: {
    required: true,
    custom: (value: string, password?: string) => {
      if (password && value !== password) {
        return "Mật khẩu không khớp"
      }
      return null
    },
  },
} as const
