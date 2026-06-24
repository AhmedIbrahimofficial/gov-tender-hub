import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole =
  | "cpo" | "procurement_officer" | "evaluator" | "adjudication_officer"
  | "finance_officer" | "project_manager" | "contract_manager" | "audit_officer"
  | "anti_corruption_officer" | "compliance_officer" | "legal_officer" | "stores_officer"
  | "records_officer" | "executive_director" | "board_member" | "regulator"
  | "system_admin" | "ai_governance_officer" | "data_analytics_officer" | "risk_officer"
  | "ethics_officer" | "qa_officer" | "inspection_officer" | "asset_manager"
  | "budget_officer" | "treasury_officer" | "end_user" | "sme_supplier"
  | "contract_officer" | "vendor_user" | "citizen" | "public_auditor"
  | "minister" | "auditor" | "supplier"
  | "planning_officer" | "communications_officer" | "performance_officer"
  | "it_officer" | "logistics_officer" | "security_officer"
  | "health_safety_officer" | "environment_officer" | "gender_officer"
<<<<<<< HEAD
  | "permanent_secretary" | "procurement_director"
=======
  | "president"
>>>>>>> 555a288eefb036184b9305d7d9e7582741de3012
  | "public"; // public portal user (company/bidder)

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  entity: string;
  phone?: string;
  isPublic?: boolean; // supplier/company portal user
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
  loginWithDetails: (details: Partial<AuthUser> & { role: UserRole }) => void;
  loginPublic: (email: string, name: string, company: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, _password: string): boolean => {
    const found = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) { setUser(found); return true; }
    if (email && _password) { setUser(DEMO_USERS[0]); return true; }
    return false;
  };

  const loginAs = (role: UserRole) => {
    const found = DEMO_USERS.find((u) => u.role === role) ?? DEMO_USERS[0];
    setUser({ ...found, role });
  };

  const loginWithDetails = (details: Partial<AuthUser> & { role: UserRole }) => {
    const base = DEMO_USERS.find((u) => u.role === details.role) ?? DEMO_USERS[0];
    const name = details.name ?? base.name;
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    setUser({
      ...base,
      ...details,
      id: `custom-${Date.now()}`,
      avatar: initials,
    });
  };

  const loginPublic = (email: string, name: string, company: string) => {
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "CO";
    setUser({
      id: `pub-${Date.now()}`,
      name,
      email,
      role: "public",
      avatar: initials,
      department: "Procurement",
      entity: company,
      isPublic: true,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, loginAs, loginWithDetails, loginPublic, logout, isAuthenticated: !!user }}>
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

// All 44 management roles
export const ALL_ROLES: { role: UserRole; label: string; desc: string; color: string }[] = [
<<<<<<< HEAD
  { role: "permanent_secretary",   label: "Permanent Secretary",        desc: "Institutional head · Strategic oversight", color: "bg-slate-950" },
  { role: "procurement_director",  label: "Procurement Director",       desc: "Procurement division leadership",    color: "bg-slate-800" },
=======
  { role: "president",             label: "President / Head of State",  desc: "Whole-of-government super-executive",color: "bg-gradient-to-r from-blue-700 to-blue-900" },
>>>>>>> 555a288eefb036184b9305d7d9e7582741de3012
  { role: "cpo",                   label: "Chief Procurement Officer",  desc: "Full platform authority",            color: "bg-slate-900" },
  { role: "procurement_officer",   label: "Procurement Officer",        desc: "Tenders · RFQs · Lifecycle",         color: "bg-blue-700" },
  { role: "evaluator",             label: "Evaluation Officer",         desc: "Bid scoring workbench",              color: "bg-indigo-600" },
  { role: "adjudication_officer",  label: "Adjudication Officer",       desc: "Award decisions & appeals",          color: "bg-violet-600" },
  { role: "finance_officer",       label: "Finance Officer",            desc: "Invoices · Payments · Budget",       color: "bg-emerald-700" },
  { role: "project_manager",       label: "Project Manager",            desc: "Contract delivery & milestones",     color: "bg-teal-600" },
  { role: "contract_manager",      label: "Contract Manager",           desc: "Contract lifecycle management",      color: "bg-cyan-700" },
  { role: "audit_officer",         label: "Audit Officer",              desc: "Internal audit & compliance",        color: "bg-amber-700" },
  { role: "anti_corruption_officer",label: "Anti-Corruption Officer",   desc: "Fraud detection & referrals",        color: "bg-red-700" },
  { role: "compliance_officer",    label: "Compliance Officer",         desc: "PPDPA compliance monitoring",        color: "bg-orange-700" },
  { role: "legal_officer",         label: "Legal Officer",              desc: "Contract legal review",              color: "bg-rose-700" },
  { role: "stores_officer",        label: "Stores Officer",             desc: "Inventory & asset custody",          color: "bg-lime-700" },
  { role: "records_officer",       label: "Records Officer",            desc: "Document management & archiving",    color: "bg-green-700" },
  { role: "executive_director",    label: "Executive Director",         desc: "Entity-level oversight",             color: "bg-slate-700" },
  { role: "board_member",          label: "Board Member",               desc: "Governance & oversight",             color: "bg-gray-700" },
  { role: "regulator",             label: "Regulator (PRAZ)",           desc: "National procurement regulation",    color: "bg-zinc-800" },
  { role: "system_admin",          label: "System Administrator",       desc: "Platform configuration & users",     color: "bg-neutral-800" },
  { role: "ai_governance_officer", label: "AI Governance Officer",      desc: "AI model oversight & explainability",color: "bg-purple-700" },
  { role: "data_analytics_officer",label: "Data Analytics Officer",     desc: "BI dashboards & reporting",          color: "bg-fuchsia-700" },
  { role: "risk_officer",          label: "Risk Officer",               desc: "Risk register & mitigation",         color: "bg-pink-700" },
  { role: "ethics_officer",        label: "Ethics Officer",             desc: "COI declarations & ethics",          color: "bg-rose-600" },
  { role: "qa_officer",            label: "Quality Assurance Officer",  desc: "Standards & quality control",        color: "bg-sky-700" },
  { role: "inspection_officer",    label: "Inspection Officer",         desc: "Delivery inspection & GRN",          color: "bg-blue-600" },
  { role: "asset_manager",         label: "Asset Manager",              desc: "Government asset register",          color: "bg-indigo-700" },
  { role: "budget_officer",        label: "Budget Officer",             desc: "Budget commitment & control",        color: "bg-emerald-600" },
  { role: "treasury_officer",      label: "Treasury Officer",           desc: "Payment authorisation",              color: "bg-green-600" },
  { role: "end_user",              label: "End User / Requisitioner",   desc: "Raise purchase requisitions",        color: "bg-teal-700" },
  { role: "sme_supplier",          label: "SME Supplier",               desc: "Small business portal",              color: "bg-cyan-600" },
  { role: "contract_officer",      label: "Contract Officer",           desc: "Contract drafting & execution",      color: "bg-amber-600" },
  { role: "vendor_user",           label: "Vendor Portal User",         desc: "Vendor self-service portal",         color: "bg-orange-600" },
  { role: "citizen",               label: "Citizen Observer",           desc: "Transparency & feedback",            color: "bg-lime-600" },
  { role: "public_auditor",        label: "Public Auditor",             desc: "External audit access",              color: "bg-slate-600" },
  { role: "minister",              label: "Minister / Executive",       desc: "Strategic dashboards & KPIs",        color: "bg-gray-800" },
  { role: "auditor",               label: "Auditor General",            desc: "Audit trails · Compliance",          color: "bg-zinc-700" },
  { role: "supplier",              label: "Supplier / Contractor",      desc: "Bids · Contracts · Invoices",        color: "bg-neutral-700" },
  { role: "planning_officer",      label: "Planning Officer",           desc: "Demand & procurement planning",      color: "bg-violet-700" },
  { role: "communications_officer",label: "Communications Officer",     desc: "Tender publications & notices",      color: "bg-purple-600" },
  { role: "performance_officer",   label: "Performance Officer",        desc: "KPIs & supplier scorecards",         color: "bg-fuchsia-600" },
  { role: "it_officer",            label: "IT Officer",                 desc: "System integration & support",       color: "bg-pink-600" },
  { role: "logistics_officer",     label: "Logistics Officer",          desc: "Delivery, dispatch & warehousing",   color: "bg-sky-600" },
  { role: "health_safety_officer", label: "Health & Safety Officer",    desc: "HSE compliance in contracts",        color: "bg-red-600" },
  { role: "environment_officer",   label: "Environment Officer",        desc: "Environmental impact assessments",   color: "bg-green-800" },
];
