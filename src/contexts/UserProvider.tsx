import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApi } from './ApiProvider';
import { UserSchema } from '../Schemas';

type UserContextType = {
  user: UserSchema | null | undefined;
  setUser: (user: UserSchema | null | undefined) => void;
  login: (username: string, password: string) => Promise<'ok' | 'fail' | 'error'>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children }: React.PropsWithChildren<{}>) {
  const [user, setUser] = useState<UserSchema | null | undefined>();
  const api = useApi();

  useEffect(() => {
    (async () => {
      if (api.isAuthenticated()) {
        const response = await api.get<UserSchema>('/me');
        setUser(response.ok ? response.body : null);
      }
      else {
        setUser(null);
      }
    })();
  }, [api]);

  const login = useCallback(async (username: string, password: string) => {
    const result = await api.login(username, password);
    if (result === 'ok') {
      const response = await api.get<UserSchema>('/me');
      setUser(response.ok ? response.body : null);
    }
    return result;
  }, [api]);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, [api]);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext) as UserContextType;
}