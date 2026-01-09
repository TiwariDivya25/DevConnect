
import { SupabaseClient } from '@supabase/supabase-js';

const logMockWarning = (method: string) => {
  console.warn(`[Supabase Mock] ${method} called. Backend is not verified/connected. See README.md`);
};

// Create a proxy that logs warnings for any property verification
const createMockSupabase = (): SupabaseClient => {
  console.error("SUPABASE CLIENT IS MISSING ENV VARS: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Falling back to Mock Client.");
  
  // Minimal mock implementation to prevent crashes
  const mockClient: any = {
    auth: {
      getSession: async () => {
        logMockWarning("auth.getSession");
        return { data: { session: null }, error: null };
      },
      onAuthStateChange: (_callback: any) => {
        logMockWarning("auth.onAuthStateChange");
        // Immediately return a subscription object
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithOAuth: async () => {
        logMockWarning("auth.signInWithOAuth");
        alert("Authentication is disabled in mock mode. Please set up your .env file.");
        return { error: { message: "Mock Sign In Error" } };
      },
      signInWithPassword: async () => {
        logMockWarning("auth.signInWithPassword");
        alert("Authentication is disabled in mock mode. Please set up your .env file.");
        return { error: { message: "Mock Sign In Error" } };
      },
      signUp: async () => {
        logMockWarning("auth.signUp");
        return { error: { message: "Mock Sign Up Error" } };
      },
      signOut: async () => {
         logMockWarning("auth.signOut");
         return { error: null };
      },
      resetPasswordForEmail: async () => {
         return { error: { message: "Mock Reset Password Error" } };
      },
      updateUser: async () => {
         return { error: { message: "Mock Update User Error" } };
      },
    },
    // We can use a Proxy for 'from' to return a chainable mock object
    from: (table: string) => {
      logMockWarning(`from('${table}')`);
      return {
        select: (columns: string = '*') => {
          return {
             order: (column: string, options?: any) => {
                return Promise.resolve({ data: [], error: null });
             },
             eq: (column: string, value: any) => {
                return Promise.resolve({ data: [], error: null });
             },
             single: () => {
                return Promise.resolve({ data: null, error: {message: "Mock Data Not Found"} });
             },
             insert: () => {
                 return Promise.resolve({data: null, error: {message: "Mock Insert Failed"}});
             },
             update: () => {
                 return Promise.resolve({data: null, error: {message: "Mock Update Failed"}});
             },
              delete: () => {
                 return Promise.resolve({data: null, error: {message: "Mock Delete Failed"}});
             }
          }
        },
        insert: () => Promise.resolve({ data: null, error: { message: "Mock Insert Failed" } }),
        update: () => Promise.resolve({ data: null, error: { message: "Mock Update Failed" } }),
        delete: () => Promise.resolve({ data: null, error: { message: "Mock Delete Failed" } }),
      };
    },
    channel: (name: string) => {
        logMockWarning(`channel('${name}')`);
        return {
            on: () => ({ subscribe: () => {} }),
            subscribe: () => {}
        }
    },
    storage: {
        from: (bucket: string) => ({
             upload: () => Promise.resolve({data: null, error: {message: "Mock Upload Failed"}}),
             getPublicUrl: (path: string) => ({data: { publicUrl: "" }})
        })
    }
  };

  return mockClient as SupabaseClient;
};

export default createMockSupabase;
