import { z } from 'zod';

/**
 * Password Security Requirements
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */

export const PASSWORD_MIN_LENGTH = 12;

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Parola trebuie să aibă cel puțin ${PASSWORD_MIN_LENGTH} caractere`)
  .regex(/[A-Z]/, 'Parola trebuie să conțină cel puțin o literă mare')
  .regex(/[a-z]/, 'Parola trebuie să conțină cel puțin o literă mică')
  .regex(/[0-9]/, 'Parola trebuie să conțină cel puțin o cifră')
  .regex(/[^A-Za-z0-9]/, 'Parola trebuie să conțină cel puțin un caracter special (!@#$%^&*)');

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

/**
 * Validates password and returns detailed feedback
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Cel puțin ${PASSWORD_MIN_LENGTH} caractere`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('O literă mare (A-Z)');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('O literă mică (a-z)');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('O cifră (0-9)');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Un caracter special (!@#$%^&*)');
  }

  // Calculate strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (errors.length === 0) {
    strength = password.length >= 16 ? 'strong' : 'medium';
  } else if (errors.length <= 2) {
    strength = 'medium';
  }

  return {
    valid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Check if password is in common passwords list
 */
const COMMON_PASSWORDS = [
  'password123',
  '123456789012',
  'qwertyuiopas',
  'password1234',
  'iloveyou1234',
];

export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.includes(password.toLowerCase());
}
