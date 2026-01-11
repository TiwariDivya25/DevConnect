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
