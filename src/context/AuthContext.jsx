import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [recoveryMode, setRecoveryMode] = useState(false);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user || null);
            setLoadingAuth(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setRecoveryMode(true);
            }
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

    const updatePassword = async (newPassword) => {
        return supabase.auth.updateUser({ password: newPassword });
    };

    const resetPassword = async (email) => {
        return supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/profile`,
        });
    };

    const deleteAccount = async () => {
        // Note: Supabase requires a Postgres RPC function or Server/Service-Role key 
        // to actually delete a user from auth.users. 
        // For a frontend-only app, this usually requires calling a custom Edge Function.
        // We will mock the frontend response for now.
        console.warn("Account deletion requires an Edge Function or RPC in Supabase. Logging out instead.");
        return signOut();
    };

    const unlockPremium = async (code) => {
        if (code === 'STYLECV_PRO' || code === 'UNLIMITED2026') {
            const { data, error } = await supabase.auth.updateUser({
                data: { isPremium: true }
            });
            if (error) throw error;
            setUser(data.user);
            return true;
        }
        return false;
    };

    const isPremium = user?.user_metadata?.isPremium === true;

    return (
        <AuthContext.Provider value={{
            user, session, loadingAuth, isPremium,
            recoveryMode, setRecoveryMode,
            signUp, signIn, signOut,
            updatePassword, deleteAccount, unlockPremium, resetPassword
        }}>
            {!loadingAuth && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
