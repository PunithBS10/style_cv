import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user || null);
            setLoadingAuth(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user || null);
            setLoadingAuth(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password) => {
        return supabase.auth.signUp({ email, password });
    };

    const signIn = async (email, password) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    const signOut = async () => {
        return supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, loadingAuth, signUp, signIn, signOut }}>
            {!loadingAuth && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
