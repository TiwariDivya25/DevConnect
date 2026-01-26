/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { type User, AuthError } from "@supabase/supabase-js";
import { supabase, isBackendAvailable } from "../supabase-client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
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
  updateProfile: (metadata: { full_name?: string; avatar_url?: string; bio?: string; location?: string; website?: string; github?: string; twitter?: string }) => Promise<{ error: AuthError | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const signInWithGithub = async () => {
    if (!isBackendAvailable || !supabase) {
      throw new Error("GitHub authentication is disabled in demo mode");
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (networkError: any) {
      throw new Error(`GitHub login failed: ${networkError.message || 'Connection failed'}`);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isBackendAvailable || !supabase) {
      return { 
        error: { 
          message: "Authentication is disabled in demo mode",
          name: "DemoModeError"
        } as AuthError 
      };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (networkError: any) {
      return { 
        error: {
          message: `Network error: ${networkError.message || 'Connection failed'}`,
          name: "NetworkError"
        } as AuthError
      };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => {
    if (!isBackendAvailable || !supabase) {
      return { 
        error: { 
          message: "Registration is disabled in demo mode",
          name: "DemoModeError"
        } as AuthError 
      };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      return { error };
    } catch (networkError: any) {
      return { 
        error: {
          message: `Registration failed: ${networkError.message || 'Connection failed'}`,
          name: "NetworkError"
        } as AuthError
      };
    }
  };

  const signOut = async () => {
    if (!isBackendAvailable || !supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    if (!isBackendAvailable || !supabase) {
      return { 
        error: { 
          message: "Password reset is disabled in demo mode",
          name: "DemoModeError"
        } as AuthError 
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (networkError: any) {
      return { 
        error: {
          message: `Password reset failed: ${networkError.message || 'Connection failed'}`,
          name: "NetworkError"
        } as AuthError
      };
    }
  };

  const updatePassword = async (password: string) => {
    if (!isBackendAvailable || !supabase) {
      return { 
        error: { 
          message: "Password update is disabled in demo mode",
          name: "DemoModeError"
        } as AuthError 
      };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      return { error };
    } catch (networkError: any) {
      return { 
        error: {
          message: `Password update failed: ${networkError.message || 'Connection failed'}`,
          name: "NetworkError"
        } as AuthError
      };
    }
  };

  const updateProfile = async (metadata: { full_name?: string; avatar_url?: string; bio?: string; location?: string; website?: string; github?: string; twitter?: string }) => {
    if (!isBackendAvailable || !supabase) {
      // In demo mode, update the local user state
      if (user) {
        const updatedUser = {
          ...user,
          user_metadata: {
            ...user.user_metadata,
            ...metadata
          }
        };
        setUser(updatedUser);
      }
      return { error: null };
    }

    const { error } = await supabase.auth.updateUser({
      data: metadata
    });
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGithub,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
