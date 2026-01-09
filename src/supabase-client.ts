import { createClient } from "@supabase/supabase-js";

/* ===================== CONFIG ===================== */

const supabaseUrl = "https://vrgulaasdvhujkxnaxgr.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/* ===================== CLIENT ===================== */

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ===================== ERROR HANDLING ===================== */

/**
 * Standard API error response format
 * Used across the application for consistent error handling
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
}

/**
 * Normalizes Supabase or unknown errors into
 * a user-friendly, consistent format
 */
export const normalizeApiError = (
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again."
): ApiErrorResponse => {
  if (!error) {
    return { success: false, message: fallbackMessage };
  }

  // Supabase errors usually contain a message field
  if (typeof error === "object" && "message" in error) {
    return {
      success: false,
      message: String((error as any).message),
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message || fallbackMessage,
    };
  }

  return {
    success: false,
    message: fallbackMessage,
  };
};
