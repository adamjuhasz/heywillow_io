import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session, SupabaseClient, User } from "@supabase/supabase-js";

interface ContextData {
  user: undefined | null | User;
  session: undefined | null | Session;
  client: undefined | null | SupabaseClient;
}

const UserContext = createContext<ContextData>({
  user: undefined,
  session: undefined,
  client: undefined,
});

interface Props {
  supabaseClient: SupabaseClient;
}

export const UserContextProvider = ({
  supabaseClient,
  ...props
}: PropsWithChildren<Props>) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const session = supabaseClient.auth.session();

    setSession(session);
    setUser(session === null ? null : session?.user);
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        console.log("user", session?.user);
      }
    );
    console.log("user", session?.user);

    return () => {
      if (authListener !== null) {
        authListener.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: ContextData = {
    session,
    user,
    client: supabaseClient,
  };
  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};

export const useSupabase = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }

  return context.client;
};
