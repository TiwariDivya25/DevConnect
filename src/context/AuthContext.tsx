/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { type User, AuthError } from "@supabase/supabase-js";
import { supabase, isBackendAvailable } from "../supabase-client";

/* ===================== TYPES ===================== */

interface ApiError {
  success: false;
  message: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
 feature/centralized-api-error-handling-83
  authError: ApiError | null;

  signInWithGithub: () => Promise<void>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ===================== HELPERS ===================== */

/**
 * Centralized error formatter
 * Ensures consistent, user-friendly error responses
 */
const formatAuthError = (
  error: unknown,
  fallbackMessage: string
): ApiError => {
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

/* ===================== PROVIDER ===================== */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<ApiError | null>(null);

  /* ---------- Session Sync ---------- */
  useEffect(() => {
 feature/centralized-api-error-handling-83
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(data.session?.user ?? null);
      } catch (err) {
        setAuthError(
          formatAuthError(err, "Failed to restore authentication session")
        );
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // ✅ DEMO MODE / NO BACKEND
    if (!isBackendAvailable || !supabase) {
      setUser(null);
      setLoading(false);
      return;
    }

    // ✅ Normal Supabase flow
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });


    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ===================== ACTIONS ===================== */

  const signInWithGithub = async () => {
 feature/centralized-api-error-handling-83
    try {
      setAuthError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (err) {
      setAuthError(
        formatAuthError(err, "GitHub sign-in failed. Please try again.")
      );
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err) {
      setAuthError(
        formatAuthError(err, "Email sign-in failed. Please try again.")
      );
      return { error: err as AuthError };
    }

    if (!isBackendAvailable || !supabase) {
      throw new Error("Authentication is disabled in demo mode");
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isBackendAvailable || !supabase) {
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };

  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => {
feature/centralized-api-error-handling-83
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      return { error };
    } catch (err) {
      setAuthError(
        formatAuthError(err, "Account creation failed. Please try again.")
      );
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      setAuthError(
        formatAuthError(err, "Failed to sign out. Please try again.")
      );
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (err) {
      setAuthError(
        formatAuthError(err, "Failed to reset password. Please try again.")
      );
      return { error: err as AuthError };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (err) {
      setAuthError(
        formatAuthError(err, "Failed to update password. Please try again.")
      );
      return { error: err as AuthError };
    }

    if (!isBackendAvailable || !supabase) {
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    if (!isBackendAvailable || !supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    if (!isBackendAvailable || !supabase) {
      return { error: null };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    if (!isBackendAvailable || !supabase) {
      return { error: null };
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });
    return { error };

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
feature/centralized-api-error-handling-83
        authError,

        signInWithGithub,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
 feature/centralized-api-error-handling-83

/* ===================== HOOK ===================== */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

