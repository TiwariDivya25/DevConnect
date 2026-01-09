import { createContext, useContext, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { supabase } from "../supabase-client";

/* ===================== TYPES ===================== */

interface ApiError {
  success: false;
  message: string;
}

interface AuthContextType {
  user: User | null;
  authError: ApiError | null;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ===================== HELPERS ===================== */

/**
 * Centralized error formatter
 * Ensures consistent, user-friendly error responses
 */
const formatAuthError = (error: unknown, fallbackMessage: string): ApiError => {
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
  const [authError, setAuthError] = useState<ApiError | null>(null);

  /* ---------- Session Sync ---------- */
  useEffect(() => {
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(data.session?.user ?? null);
      } catch (err) {
        setAuthError(
          formatAuthError(err, "Failed to restore authentication session")
        );
      }
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ---------- Actions ---------- */

  const signInWithGithub = async () => {
    try {
      setAuthError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });

      if (error) throw error;
    } catch (err) {
      setAuthError(
        formatAuthError(err, "GitHub sign-in failed. Please try again.")
      );
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

  return (
    <AuthContext.Provider
      value={{
        user,
        authError,
        signInWithGithub,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ===================== HOOK ===================== */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
