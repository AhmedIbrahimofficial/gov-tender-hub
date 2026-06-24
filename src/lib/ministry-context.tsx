import { createContext, useContext, useState, ReactNode } from "react";

type MinistryContextType = {
  currentMinistryId: string | null;
  setCurrentMinistry: (id: string | null) => void;
  currentDeptId: string | null;
  setCurrentDept: (id: string | null) => void;
};

const MinistryContext = createContext<MinistryContextType | null>(null);

export const MINISTRIES = [
  { id: "min-001", name: "Ministry of Health & Child Care",      shortName: "MoH",  badge: "🏥" },
  { id: "min-002", name: "Ministry of Transport & Infra",        shortName: "MoT",  badge: "🛣️" },
  { id: "min-003", name: "Ministry of Education",                shortName: "MoE",  badge: "📚" },
  { id: "min-004", name: "Ministry of Agriculture",              shortName: "MoA",  badge: "🌾" },
  { id: "min-005", name: "Ministry of Energy & Power",           shortName: "MoEP", badge: "⚡" },
  { id: "min-006", name: "Ministry of Finance",                  shortName: "MoF",  badge: "💰" },
  { id: "min-007", name: "Ministry of Water & Sanitation",       shortName: "MoW",  badge: "💧" },
  { id: "min-008", name: "Ministry of ICT & Digital Economy",    shortName: "MoICT",badge: "💻" },
  { id: "prime",   name: "Prime Entity (Super Admin)",           shortName: "PRAZ", badge: "🏛️" },
];

export function MinistryProvider({ children }: { children: ReactNode }) {
  const [currentMinistryId, setCurrentMinistryId] = useState<string | null>(null);
  const [currentDeptId, setCurrentDeptId] = useState<string | null>(null);

  const setCurrentMinistry = (id: string | null) => {
    setCurrentMinistryId(id);
    setCurrentDeptId(null);
  };
  const setCurrentDept = (id: string | null) => setCurrentDeptId(id);

  return (
    <MinistryContext.Provider value={{ currentMinistryId, setCurrentMinistry, currentDeptId, setCurrentDept }}>
      {children}
    </MinistryContext.Provider>
  );
}

export function useMinistry() {
  const ctx = useContext(MinistryContext);
  if (!ctx) throw new Error("useMinistry must be inside MinistryProvider");
  return ctx;
}
