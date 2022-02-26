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
  client: undefined | SupabaseClient;
  usingDefaultValue: boolean;
}

const UserContext = createContext<ContextData>({
  user: undefined,
  session: undefined,
  client: undefined,
  usingDefaultValue: true,
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
    const supabaseSession = supabaseClient.auth.session();

    setSession(supabaseSession);
    setUser(supabaseSession === null ? null : supabaseSession?.user);
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (_event, stateChangeSession) => {
        setSession(stateChangeSession);
        setUser(stateChangeSession?.user ?? null);
        console.log("user", stateChangeSession?.user);
      }
    );
    console.log("user", supabaseSession?.user);

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
    usingDefaultValue: false,
  };
  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context.usingDefaultValue === true) {
    const error = `useUser must be used within a UserContextProvider.`;
    console.error(error);
    throw new Error(error);
  }
  return context;
};

export const useSupabase = () => {
  const context = useContext(UserContext);
  if (context.usingDefaultValue === true) {
    const error = `useUser must be used within a UserContextProvider.`;
    console.error(error);
    throw new Error(error);
  }

  return context.client;
};
