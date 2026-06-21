import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole =
  | "cpo"
  | "procurement_officer"
  | "evaluator"
  | "finance_officer"
  | "auditor"
  | "minister"
  | "supplier"
  | "public";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  entity: string;
};

const DEMO_USERS: AuthUser[] = [
  { id: "u1", name: "T. Moyo", email: "tmoyo@praz.gov.zw", role: "cpo", avatar: "TM", department: "Procurement", entity: "PRAZ" },
  { id: "u2", name: "R. Chikwanda", email: "rchikwanda@mof.gov.zw", role: "finance_officer", avatar: "RC", department: "Finance", entity: "Ministry of Finance" },
  { id: "u3", name: "S. Nkosi", email: "snkosi@oag.gov.zw", role: "auditor", avatar: "SN", department: "Audit", entity: "Office of Auditor-General" },
  { id: "u4", name: "Hon. B. Mutasa", email: "bmutasa@cabinet.gov.zw", role: "minister", avatar: "BM", department: "Cabinet", entity: "Cabinet Office" },
  { id: "u5", name: "J. Banda", email: "jbanda@highveld.co.zw", role: "supplier", avatar: "JB", department: "Sales", entity: "Highveld Engineering (Pvt) Ltd" },
  { id: "u6", name: "P. Dube", email: "pdube@moh.gov.zw", role: "evaluator", avatar: "PD", department: "Procurement", entity: "Ministry of Health" },
  { id: "u7", name: "A. Mpofu", email: "ampofu@praz.gov.zw", role: "procurement_officer", avatar: "AM", department: "Procurement", entity: "PRAZ" },
];

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, _password: string): boolean => {
    const found = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) { setUser(found); return true; }
    // Demo: any password works for any user
    if (email && _password) { setUser(DEMO_USERS[0]); return true; }
    return false;
  };

  const loginAs = (role: UserRole) => {
    const found = DEMO_USERS.find((u) => u.role === role) ?? DEMO_USERS[0];
    setUser(found);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, loginAs, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

export const DEMO_USERS_LIST = DEMO_USERS;
