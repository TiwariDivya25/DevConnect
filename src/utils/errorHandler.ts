import { AuthError } from '@supabase/supabase-js';

export interface AppError {
  message: string;
  type: 'network' | 'auth' | 'validation' | 'demo';
  code?: string;
}

export const handleAuthError = (error: AuthError | null): AppError | null => {
  if (!error) return null;

  // Map common Supabase auth errors to user-friendly messages
  const errorMap: Record<string, string> = {
    'invalid_credentials': 'Invalid email or password',
    'email_not_confirmed': 'Please check your email and confirm your account',
    'signup_disabled': 'New registrations are currently disabled',
    'email_address_invalid': 'Please enter a valid email address',
    'password_too_short': 'Password must be at least 6 characters',
    'user_not_found': 'No account found with this email',
    'email_address_not_authorized': 'This email is not authorized to sign up',
  };

  return {
    message: errorMap[error.message] || error.message || 'Authentication failed',
    type: 'auth',
    code: error.message
  };
};

export const handleNetworkError = (error: any): AppError => {
  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return {
      message: 'Network connection failed. Please check your internet connection.',
      type: 'network'
    };
  }

  if (error.code === 'TIMEOUT') {
    return {
      message: 'Request timed out. Please try again.',
      type: 'network'
    };
  }

  return {
    message: error.message || 'An unexpected error occurred',
    type: 'network'
  };
};

export const isDemoModeError = (error: any): boolean => {
  return error?.name === 'DemoModeError' || 
         error?.message?.includes('demo mode');
};