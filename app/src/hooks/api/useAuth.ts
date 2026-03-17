import { createContext, useContext } from "react";

export interface AuthContextValue {
  isLoggedIn: boolean;
  accessToken: string | null;
  signIn: (accessToken: string, refreshToken: string) => void;
  signOut: () => void;
  setAccessToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  accessToken: null,
  signIn: () => {},
  signOut: () => {},
  setAccessToken: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
