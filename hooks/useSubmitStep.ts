import { useState } from 'react';
import { InputField, Step } from '@/lib/app-types';

interface ValidationError {
  fieldId: string;
  message: string;
}

export function useSubmitStep() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  /**
   * Valida risposta contro i vincoli del campo
   */
  const validateResponse = (
    response: Record<string, unknown>,
    fields: InputField[]
  ): ValidationError[] => {
    const errors: ValidationError[] = [];

    fields.forEach((field) => {
      const value = response[field.id];

      // Controllo required
      if (field.required && (value === undefined || value === null || value === '')) {
        errors.push({
          fieldId: field.id,
          message: `${field.label} è obbligatorio`,
        });
        return;
      }

      // Controllo per tipo
      if (field.type === 'scale') {
        const numValue = Number(value);
        if (field.min !== undefined && numValue < field.min) {
          errors.push({
            fieldId: field.id,
            message: `Il valore minimo è ${field.min}`,
          });
        }
        if (field.max !== undefined && numValue > field.max) {
          errors.push({
            fieldId: field.id,
            message: `Il valore massimo è ${field.max}`,
          });
        }
      }
    });

    return errors;
  };

  /**
   * Sottomette lo step con validazione
   */
  const submit = async (
    response: Record<string, unknown>,
    fields: InputField[],
    onSubmit: (response: Record<string, unknown>) => Promise<void>
  ): Promise<boolean> => {
    const errors = validateResponse(response, fields);

    if (errors.length > 0) {
      setValidationErrors(errors);
      return false;
    }

    try {
      setIsSubmitting(true);
      setValidationErrors([]);
      await onSubmit(response);
      return true;
    } catch (error) {
      setValidationErrors([
        {
          fieldId: 'general',
          message: error instanceof Error ? error.message : 'Errore durante la sottomissione',
        },
      ]);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    validationErrors,
    validateResponse,
    submit,
  };
}
