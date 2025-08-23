import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { Profile } from '../services/api'; // Importujemy typ Profile

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  profile: Profile | null; // <-- Dodajemy profil użytkownika
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null); // <-- Stan dla profilu

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Błąd pobierania sesji:", sessionError.message);
        setLoading(false);
        return;
      }
      
      setSession(session);

      if (session) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (error) {
            throw error;
          }
          setProfile(data);
        } catch (error: any) {
          console.error("Błąd pobierania profilu:", error.message);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Pobieramy profil ponownie przy zmianie stanu autentykacji
      if (session) {
        fetchSessionAndProfile();
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = { session, loading, profile }; // <-- Upubliczniamy profil

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 