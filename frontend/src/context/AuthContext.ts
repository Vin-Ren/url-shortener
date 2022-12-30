import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

export interface AuthData {
  authenticated: boolean,
  email?: string,
  accessToken?: string
}

export const AuthContext = createContext<{ auth: AuthData, setAuth: Function }>(null as any);
