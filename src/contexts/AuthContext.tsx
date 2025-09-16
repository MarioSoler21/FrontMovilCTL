import React, { createContext, useContext, useMemo, useState } from "react";

type Plan = "basic" | "pro" | "premium";

type User = {
  email?: string | null;
} | null;

type AuthContextType = {
  user: User;
  isAllowed: boolean;
  plan: Plan;
  setPlan: (p: Plan) => void;

  // si luego quieres login real, dejas estas firmas listas
  login: (email: string) => void;
  logout: () => void;

  // helpers de gating
  isBasic: boolean;
  isPro: boolean;
  isPremium: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Para desarrollo, puedes dejar un usuario falso:
  const [user, setUser] = useState<User>({ email: "demo@ctl.hn" });
  const [isAllowed, setIsAllowed] = useState<boolean>(true);

  // Plan por defecto: "basic"
  const [plan, setPlan] = useState<Plan>("basic");

  const login = (email: string) => {
    setUser({ email });
    setIsAllowed(true);
  };

  const logout = () => {
    setUser(null);
    setIsAllowed(false);
    setPlan("basic");
  };

  const isBasic = plan === "basic";
  const isPro = plan === "pro";
  const isPremium = plan === "premium";

  const value = useMemo(
    () => ({
      user,
      isAllowed,
      plan,
      setPlan,
      login,
      logout,
      isBasic,
      isPro,
      isPremium,
    }),
    [user, isAllowed, plan, isBasic, isPro, isPremium]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
