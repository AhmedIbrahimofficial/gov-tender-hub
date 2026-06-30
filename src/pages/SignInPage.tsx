import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, ALL_ROLES } from "@/lib/auth-context";
import { ZW_MINISTRIES, type ZWRole } from "@/lib/zw-ministries";
import {
  Eye, EyeOff, ArrowRight, Shield, Building2, ChevronLeft, X,
  Phone, User, Mail, Lock, Briefcase, Landmark, Search, Users,
  ChevronDown, ChevronRight, Crown, Star, AlertTriangle,
} from "lucide-react";
import { seedIfEmpty } from "@/lib/local-store";

function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
    </svg>
  );
}

// ─── Hierarchy tree for left decorative panel ─────────────────────────────────
function GovHierarchyPanel() {
  const [openMin, setOpenMin] = useState<string | null>(null);
  const [openDept, setOpenDept] = useState<string | null>(null);

  return (
    <div className="space-y-0.5">
      {/* President node — only Head of State shown at top */}
      <div className="flex items-center gap-2 px-2 py-2.5 rounded-lg bg-amber-500/15 border border-amber-500/20 mb-2">
        <span className="h-6 w-6 rounded-md bg-amber-500 grid place-items-center flex-shrink-0">
          <Crown className="h-3 w-3 text-white" />
        </span>
        <span className="text-[12px] font-semibold text-amber-300">President</span>
        <span className="ml-auto text-[10px] text-amber-400/60">Head of State</span>
      </div>

      {ZW_MINISTRIES.slice(0, 8).map(ministry => (
        <div key={ministry.id}>
          <button
            onClick={() => setOpenMin(openMin === ministry.id ? null : ministry.id)}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/8 transition-colors text-left"
          >
            <span className="h-5 w-5 rounded bg-blue-500/70 grid place-items-center flex-shrink-0">
              <Landmark className="h-2.5 w-2.5 text-white" />
            </span>
            <span className="flex-1 text-[11px] font-medium text-white/75 truncate">{ministry.name.replace("Ministry of ", "")}</span>
            <span className="text-[9px] text-white/30 mr-1 flex-shrink-0">{ministry.code}</span>
            <ChevronRight className={`h-3 w-3 text-white/25 flex-shrink-0 transition-transform ${openMin === ministry.id ? "rotate-90" : ""}`} />
          </button>
          {openMin === ministry.id && (
            <div className="ml-4 pl-2 border-l border-white/10 space-y-0.5 mb-1">
              {/* CPO row — always visible under each ministry */}
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-violet-500/15 border border-violet-500/20 mb-0.5">
                <Shield className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                <span className="text-[10px] font-semibold text-violet-300 truncate flex-1">CPO</span>
                <span className="text-[9px] text-violet-400/60 truncate max-w-[90px]">{ministry.cpo}</span>
              </div>
              {ministry.departments.map(dept => (
                <div key={dept.id}>
                  <button
                    onClick={() => setOpenDept(openDept === dept.id ? null : dept.id)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-white/6 transition-colors text-left"
                  >
                    <span className="h-4 w-4 rounded bg-emerald-500/60 grid place-items-center flex-shrink-0">
                      <Building2 className="h-2 w-2 text-white" />
                    </span>
                    <span className="text-[10px] text-white/55 truncate flex-1">{dept.name}</span>
                    <ChevronRight className={`h-2.5 w-2.5 text-white/20 flex-shrink-0 transition-transform ${openDept === dept.id ? "rotate-90" : ""}`} />
                  </button>
                  {openDept === dept.id && (
                    <div className="ml-4 pl-2 border-l border-white/8 space-y-0.5">
                      {dept.roles.map(r => (
                        <div key={r.title} className="flex items-center gap-1.5 py-0.5 px-1.5">
                          <span className="h-1 w-1 rounded-full bg-white/15 flex-shrink-0" />
                          <span className="text-[9px] text-white/35 truncate">{r.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="px-2 pt-1 text-[9px] text-white/25">+{ZW_MINISTRIES.length - 8} more ministries…</div>
    </div>
  );
}

// Procurement workflow roles added to every department
const PROCUREMENT_WORKFLOW_ROLES: ZWRole[] = [
  { title: "Chief Procurement Officer (CPO)",    level: "Executive", count: 1 },
  { title: "Procurement Officer",                level: "Senior",    count: 4 },
  { title: "Initiator",                          level: "Officer",   count: 6 },
  { title: "Approver",                           level: "Senior",    count: 3 },
  { title: "Authorizer",                         level: "Senior",    count: 2 },
  { title: "Adjudicator / Adjudication Board",   level: "Executive", count: 1 },
  { title: "Evaluator",                          level: "Officer",   count: 5 },
  { title: "Oversight / Auditor",                level: "Senior",    count: 2 },
  { title: "Bid Committee Member",               level: "Officer",   count: 4 },
  { title: "Contract Manager",                   level: "Senior",    count: 2 },
];

// ─── Interactive hierarchy selector (Ministry → Department → Role) ────────────
type HierarchySelection = { ministryId: string; departmentId: string; roleTitle: string };

function GovHierarchySelector({
  value,
  onChange,
  onClose,
}: {
  value: HierarchySelection;
  onChange: (v: HierarchySelection) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [openMin, setOpenMin] = useState<string | null>(value.ministryId || null);
  const [openDept, setOpenDept] = useState<string | null>(value.departmentId || null);

  const filtered = search.length > 1
    ? ZW_MINISTRIES.map(m => ({
        ...m,
        departments: m.departments.map(d => ({
          ...d,
          roles: d.roles.filter(r =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            m.name.toLowerCase().includes(search.toLowerCase())
          ),
        })).filter(d => d.roles.length > 0),
      })).filter(m => m.departments.length > 0)
    : ZW_MINISTRIES;

  const selectRole = (ministryId: string, departmentId: string, roleTitle: string) => {
    onChange({ ministryId, departmentId, roleTitle });
    onClose();
  };

  return (
    <div className="bg-white rounded-2xl border border-black/10 shadow-xl p-4 w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-black">Select Role from Hierarchy</span>
        <button onClick={onClose} className="text-black/30 hover:text-black"><X className="h-4 w-4" /></button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search ministries, departments, roles…"
          className="w-full h-9 pl-9 pr-8 rounded-xl border border-black/10 text-xs focus:outline-none focus:ring-2 focus:ring-black/10 bg-white" />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* President node — selectable */}
      <button
        onClick={() => selectRole("presidency", "opc-cabinet", "President / Head of State")}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border mb-2 transition-all text-left
          ${value.ministryId === "presidency" && value.roleTitle === "President / Head of State"
            ? "bg-amber-50 border-amber-300 ring-1 ring-amber-300"
            : "bg-amber-50 border-amber-100 hover:border-amber-300 hover:bg-amber-100"}`}
      >
        <Crown className="h-4 w-4 text-amber-500 flex-shrink-0" />
        <div className="flex-1">
          <span className="text-xs font-semibold text-amber-700 block">President / Head of State</span>
          <span className="text-[9px] text-amber-500">Office of the President and Cabinet · OPC</span>
        </div>
        {value.ministryId === "presidency" && value.roleTitle === "President / Head of State" && (
          <Star className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
        )}
      </button>

      <div className="max-h-[48vh] overflow-y-auto space-y-0.5 pr-1">
        {filtered.map(ministry => (
          <div key={ministry.id}>
            <button
              onClick={() => setOpenMin(openMin === ministry.id ? null : ministry.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all text-left"
            >
              <span className="h-6 w-6 rounded-lg bg-blue-600 grid place-items-center flex-shrink-0">
                <Landmark className="h-3 w-3 text-white" />
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-black block truncate">{ministry.name}</span>
                <span className="text-[9px] text-black/40">{ministry.code} · {ministry.departments.length} depts</span>
              </div>
              <ChevronRight className={`h-3.5 w-3.5 text-black/25 flex-shrink-0 transition-transform ${openMin === ministry.id ? "rotate-90" : ""}`} />
            </button>
            {openMin === ministry.id && (
              <div className="ml-4 pl-3 border-l border-black/8 space-y-0.5 mb-1">
                {/* CPO pinned at top of each ministry — selectable */}
                <button
                  onClick={() => selectRole(ministry.id, `${ministry.id}-cpo`, "Chief Procurement Officer (CPO)")}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all text-left
                    ${value.ministryId === ministry.id && value.departmentId === `${ministry.id}-cpo`
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-violet-50 border-violet-100 hover:bg-violet-600 hover:text-white hover:border-violet-600"}`}
                >
                  <Shield className={`h-3.5 w-3.5 flex-shrink-0 ${value.ministryId === ministry.id && value.departmentId === `${ministry.id}-cpo` ? "text-white" : "text-violet-500"}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold block truncate">Chief Procurement Officer (CPO)</span>
                    <span className={`text-[9px] truncate block ${value.ministryId === ministry.id && value.departmentId === `${ministry.id}-cpo` ? "text-white/70" : "text-violet-500"}`}>
                      {ministry.cpo}
                    </span>
                  </div>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 flex-shrink-0">Executive</span>
                </button>

                {ministry.departments.map(dept => (
                  <div key={dept.id}>
                    <button
                      onClick={() => setOpenDept(openDept === dept.id ? null : dept.id)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all text-left"
                    >
                      <span className="h-5 w-5 rounded-md bg-emerald-600 grid place-items-center flex-shrink-0">
                        <Building2 className="h-2.5 w-2.5 text-white" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-medium text-black truncate block">{dept.name}</span>
                        <span className="text-[9px] text-black/40">{dept.code} · {dept.roles.length} roles</span>
                      </div>
                      <ChevronRight className={`h-3 w-3 text-black/25 flex-shrink-0 transition-transform ${openDept === dept.id ? "rotate-90" : ""}`} />
                    </button>
                    {openDept === dept.id && (
                      <div className="ml-4 pl-2.5 border-l border-black/8 space-y-0.5 mb-1">
                        {/* Departmental roles */}
                        {dept.roles.length > 0 && (
                          <div className="px-2 py-1 text-[9px] font-bold text-black/35 uppercase tracking-wider">Departmental Roles</div>
                        )}
                        {dept.roles.map(role => (
                          <button
                            key={`dept-${role.title}`}
                            onClick={() => selectRole(ministry.id, dept.id, role.title)}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left group
                              ${value.ministryId === ministry.id && value.departmentId === dept.id && value.roleTitle === role.title
                                ? "bg-black text-white"
                                : "hover:bg-black hover:text-white"}`}
                          >
                            <Users className="h-3 w-3 text-black/30 group-hover:text-white flex-shrink-0" />
                            <span className="text-[10.5px] text-black/65 group-hover:text-white truncate flex-1">{role.title}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 
                              ${role.level === "Executive" ? "bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white" :
                                role.level === "Senior" ? "bg-blue-100 text-blue-700 group-hover:bg-blue-500 group-hover:text-white" :
                                "bg-gray-100 text-gray-600 group-hover:bg-gray-600 group-hover:text-white"}`}>
                              {role.level}
                            </span>
                          </button>
                        ))}
                        {/* Procurement workflow roles */}
                        <div className="px-2 py-1 mt-1 text-[9px] font-bold text-violet-500 uppercase tracking-wider border-t border-black/8">Procurement Roles</div>
                        {PROCUREMENT_WORKFLOW_ROLES.map(role => (
                          <button
                            key={`proc-${role.title}`}
                            onClick={() => selectRole(ministry.id, dept.id, role.title)}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left group
                              ${value.ministryId === ministry.id && value.departmentId === dept.id && value.roleTitle === role.title
                                ? "bg-violet-600 text-white"
                                : "hover:bg-violet-600 hover:text-white"}`}
                          >
                            <Shield className="h-3 w-3 text-violet-400 group-hover:text-white flex-shrink-0" />
                            <span className="text-[10.5px] text-black/65 group-hover:text-white truncate flex-1">{role.title}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 
                              ${role.level === "Executive" ? "bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white" :
                                role.level === "Senior" ? "bg-blue-100 text-blue-700 group-hover:bg-blue-500 group-hover:text-white" :
                                "bg-violet-100 text-violet-700 group-hover:bg-violet-500 group-hover:text-white"}`}>
                              {role.level}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-black/40">No results for "{search}"</div>
        )}
      </div>
    </div>
  );
}

// ─── Supplier / Company Portal ────────────────────────────────────────────────
function PublicLogin({ onBack }: { onBack: () => void }) {
  const { loginPublic } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
    businessReg: "", taxId: "", password: "", confirm: "",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    if (mode === "register") {
      if (!form.name || !form.company) { setError("Full name and company name are required."); return; }
      if (!form.phone) { setError("Phone number is required."); return; }
      if (!form.businessReg) { setError("Business Registration Number is required."); return; }
      if (!form.taxId) { setError("Tax Identification Number is required."); return; }
      if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    }
    setLoading(true);
    setTimeout(() => {
      loginPublic(form.email, form.name || form.email.split("@")[0], form.company || "Company");
      seedIfEmpty(form.email);
      navigate("/supplier-portal");
    }, 600);
  };

  const Field = ({ label, icon: Icon, name, type = "text", placeholder, required = false }: {
    label: string; icon: React.ElementType; name: string; type?: string; placeholder: string; required?: boolean;
  }) => (
    <div>
      <label className="text-xs font-medium text-black/50 uppercase tracking-wider">{label}{required && " *"}</label>
      <div className="relative mt-1">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
        <input type={type} value={(form as Record<string, string>)[name]}
          onChange={e => set(name, e.target.value)} placeholder={placeholder}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-blue-600 grid place-items-center flex-shrink-0">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-lg font-semibold text-black">Supplier Portal</div>
          <div className="text-xs text-black/50">Browse tenders, bid, and track your applications</div>
        </div>
      </div>

      <div className="flex rounded-xl bg-black/5 p-1 mb-5">
        {(["login", "register"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? "bg-white text-black shadow-sm" : "text-black/50 hover:text-black"}`}>
            {m === "login" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <>
            <Field label="Full Name" icon={User} name="name" placeholder="John Banda" required />
            <Field label="Company Name" icon={Briefcase} name="company" placeholder="Highveld Engineering (Pvt) Ltd" required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" icon={Mail} name="email" type="email" placeholder="you@company.com" required />
              <Field label="Phone Number" icon={Phone} name="phone" placeholder="+263 77 000 0000" required />
            </div>
            <Field label="Business Registration Number" icon={Star} name="businessReg" placeholder="BR-2024-XXXXXX" required />
            <Field label="Tax Identification Number" icon={Shield} name="taxId" placeholder="TIN-XXXXXXXXX" required />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Password *</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                  <input type={showPwd ? "text" : "password"} value={form.password}
                    onChange={e => set("password", e.target.value)} placeholder="••••••••"
                    className="w-full h-10 pl-9 pr-9 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Confirm *</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                  <input type="password" value={form.confirm}
                    onChange={e => set("confirm", e.target.value)} placeholder="••••••••"
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
              </div>
            </div>
          </>
        )}
        {mode === "login" && (
          <>
            <Field label="Email" icon={Mail} name="email" type="email" placeholder="you@company.com" required />
            <div>
              <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Password *</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                <input type={showPwd ? "text" : "password"} value={form.password}
                  onChange={e => set("password", e.target.value)} placeholder="••••••••"
                  className="w-full h-10 pl-9 pr-10 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </>
        )}
        {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full h-11 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 mt-1">
          {loading ? "Please wait…" : <><Building2 className="h-4 w-4" /> {mode === "login" ? "Sign In" : "Create Account"}</>}
        </button>
      </form>
    </div>
  );
}

// ─── Government Staff Registration Form ──────────────────────────────────────
// ─── Simple Role Selector (screenshot style) ─────────────────────────────────
function RoleSelectForm({ onBack }: { onBack: () => void }) {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = ALL_ROLES.filter(r =>
    r.label.toLowerCase().includes(search.toLowerCase()) ||
    r.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (role: typeof ALL_ROLES[0]) => {
    loginAs(role.role);
    navigate("/dashboard");
  };

  return (
    <div className="w-full max-w-2xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-black mb-1" style={{ letterSpacing: "-0.02em" }}>
        Select Your Role
      </h1>
      <p className="text-sm text-black/50 mb-6">
        Choose your government role to access the appropriate dashboard
      </p>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search roles..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/10 shadow-sm"
        />
      </div>

      {/* Role grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
        {filtered.map(role => (
          <button
            key={role.role}
            onClick={() => handleSelect(role)}
            className="flex items-center gap-3 p-4 rounded-xl border border-black/8 bg-white hover:border-primary/40 hover:shadow-md transition-all text-left group"
          >
            <div className={`h-10 w-10 rounded-xl ${role.color} grid place-items-center flex-shrink-0`}>
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-black group-hover:text-primary transition-colors truncate">
                {role.label}
              </div>
              <div className="text-xs text-black/45 truncate">{role.desc}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-black/20 group-hover:text-primary flex-shrink-0 transition-colors" />
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 py-10 text-center text-black/35 text-sm">
            No roles match "{search}"
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Government Staff Form (full login with credentials) ──────────────────────
function GovStaffForm({ onBack }: { onBack: () => void }) {
  const { loginWithDetails, login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPwd, setShowPwd] = useState(false);
  const [showHierarchy, setShowHierarchy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "",
  });
  const [hier, setHier] = useState<HierarchySelection>({ ministryId: "", departmentId: "", roleTitle: "" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const selectedMinistry = ZW_MINISTRIES.find(m => m.id === hier.ministryId);
  const selectedDept = selectedMinistry?.departments.find(d => d.id === hier.departmentId);

  // Deterministic role title → UserRole mapping
  const resolveRole = (roleTitle: string, ministryId: string) => {
    const lower = roleTitle.toLowerCase().trim();

    // ── Exact string → role map (covers all PROCUREMENT_WORKFLOW_ROLES + common titles) ──
    const EXACT_MAP: Record<string, string> = {
      // Head of State / Govt
      "president / head of state":       "president",
      "president":                        "president",
      "prime minister":                   "prime_minister",
      // Procurement leadership
      "chief procurement officer (cpo)":  "cpo",
      "chief procurement officer":        "cpo",
      "cpo":                              "cpo",
      "procurement director":             "procurement_director",
      "procurement officer":              "procurement_officer",
      // Procurement workflow roles (from PROCUREMENT_WORKFLOW_ROLES list)
      "initiator":                        "end_user",
      "approver":                         "procurement_officer",
      "authorizer":                       "adjudication_officer",
      "adjudicator / adjudication board": "adjudication_officer",
      "adjudicator":                      "adjudication_officer",
      "evaluator":                        "evaluator",
      "oversight / auditor":              "audit_officer",
      "bid committee member":             "evaluator",
      "contract manager":                 "contract_manager",
      // Finance
      "finance officer":                  "finance_officer",
      "finance manager":                  "finance_manager",
      "budget officer":                   "budget_officer",
      "budget manager":                   "budget_manager",
      "treasury officer":                 "treasury_officer",
      "treasury manager":                 "treasury_manager",
      // Audit / compliance
      "audit officer":                    "audit_officer",
      "auditor":                          "auditor",
      "auditor general":                  "auditor",
      "public auditor":                   "public_auditor",
      "anti-corruption officer":          "anti_corruption_officer",
      "compliance officer":               "compliance_officer",
      "ethics officer":                   "ethics_officer",
      "risk officer":                     "risk_officer",
      // Legal / governance
      "legal officer":                    "legal_officer",
      "legal counsel":                    "legal_counsel",
      "governance officer":               "governance_officer",
      "records officer":                  "records_officer",
      // HR
      "hr manager":                       "hr_manager",
      "hr officer":                       "hr_officer",
      "welfare officer":                  "welfare_officer",
      // Operations
      "stores officer":                   "stores_officer",
      "logistics officer":                "logistics_officer",
      "transport officer":                "transport_officer",
      "facilities manager":               "facilities_manager",
      "operations manager":               "operations_manager",
      "asset manager":                    "asset_manager",
      // IT / systems
      "it officer":                       "it_officer",
      "ict manager":                      "ict_manager",
      "cybersecurity officer":            "cybersecurity_officer",
      "systems admin":                    "systems_admin",
      "system administrator":             "system_admin",
      // Executive / leadership
      "permanent secretary":              "permanent_secretary",
      "executive director":               "executive_director",
      "board member":                     "board_member",
      "minister":                         "minister",
      "minister / executive":             "minister",
      "chief executive officer":          "chief_executive",
      "chief executive":                  "chief_executive",
      // Other
      "project manager":                  "project_manager",
      "contract officer":                 "contract_officer",
      "planning officer":                 "planning_officer",
      "communications officer":           "communications_officer",
      "performance officer":              "performance_officer",
      "qa officer":                       "qa_officer",
      "quality assurance officer":        "qa_officer",
      "inspection officer":               "inspection_officer",
      "regulator (praz)":                 "regulator",
      "regulator":                        "regulator",
      "ai governance officer":            "ai_governance_officer",
      "data analytics officer":           "data_analytics_officer",
      "health & safety officer":          "health_safety_officer",
      "health and safety officer":        "health_safety_officer",
      "environment officer":              "environment_officer",
      "gender officer":                   "gender_officer",
      "research officer":                 "research_officer",
      "end user / requisitioner":         "end_user",
      "end user":                         "end_user",
      "citizen observer":                 "citizen",
    };

    // 1. Exact match
    if (EXACT_MAP[lower]) {
      return ALL_ROLES.find(r => r.role === EXACT_MAP[lower]) ?? ALL_ROLES[4];
    }

    // 2. Presidency override — anything from OPC that didn't match above → president
    if (ministryId === "presidency") {
      if (lower.includes("prime minister")) return ALL_ROLES.find(r => r.role === "prime_minister") ?? ALL_ROLES[1];
      return ALL_ROLES.find(r => r.role === "president") ?? ALL_ROLES[0];
    }

    // 3. Substring scan through EXACT_MAP keys
    for (const [key, roleVal] of Object.entries(EXACT_MAP)) {
      if (lower.includes(key) || key.includes(lower)) {
        return ALL_ROLES.find(r => r.role === roleVal) ?? ALL_ROLES[4];
      }
    }

    // 4. ALL_ROLES label match (exact then partial)
    const labelExact = ALL_ROLES.find(r => r.label.toLowerCase() === lower);
    if (labelExact) return labelExact;
    const labelPartial = ALL_ROLES.find(r => r.label.toLowerCase().includes(lower) || lower.includes(r.label.toLowerCase()));
    if (labelPartial) return labelPartial;

    // 5. Safe fallback → procurement_officer (not CPO)
    return ALL_ROLES.find(r => r.role === "procurement_officer") ?? ALL_ROLES[5];
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (mode === "register") {
      const errors: string[] = [];
      if (!form.name) errors.push("Full name is required.");
      if (!form.phone) errors.push("Phone number is required.");
      if (!form.email) errors.push("Work email is required.");
      if (!form.password) errors.push("Password is required.");
      if (!hier.ministryId || (!hier.departmentId && hier.ministryId !== "presidency") || !hier.roleTitle) errors.push("Please select your ministry, department and role.");
      if (form.password && form.password !== form.confirm) errors.push("Passwords do not match.");
      if (errors.length > 0) { setError(errors.join(" ")); return; }
    } else {
      const errors: string[] = [];
      if (!form.email) errors.push("Email is required.");
      if (!form.password) errors.push("Password is required.");
      if (errors.length > 0) { setError(errors.join(" ")); return; }
    }
    setLoading(true);
    setTimeout(() => {
      if (mode === "login" && !hier.roleTitle) {
        // No role selected — use email-based demo login only
        const success = login(form.email, form.password);
        if (!success) {
          setLoading(false);
          setError("No account found with that email. Please select your Ministry / Department / Role to continue.");
          return;
        }
      } else {
        // Role explicitly selected OR register mode — use loginWithDetails
        const resolvedRole = hier.roleTitle
          ? resolveRole(hier.roleTitle, hier.ministryId)
          : (ALL_ROLES.find(r => r.role === "procurement_officer") ?? ALL_ROLES[5]);
        loginWithDetails({
          role: resolvedRole.role,
          name: form.name || form.email.split("@")[0],
          email: form.email,
          phone: form.phone,
          department: hier.ministryId === "presidency"
            ? "Office of the President and Cabinet"
            : selectedDept?.name ?? hier.roleTitle ?? resolvedRole.label,
          entity: hier.ministryId === "presidency"
            ? "Office of the President and Cabinet"
            : selectedMinistry?.name ?? "Government of Zimbabwe",
        });
      }
      seedIfEmpty(form.email);
      setLoading(false);
      navigate("/dashboard");
    }, 600);
  };

  return (
    <div className="w-full max-w-lg">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-gray-950 grid place-items-center flex-shrink-0">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-lg font-semibold text-black">Government Staff Portal</div>
          <div className="text-xs text-black/50">Sign in with your government credentials</div>
        </div>
      </div>

      <div className="flex rounded-xl bg-black/5 p-1 mb-5">
        {(["login", "register"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? "bg-white text-black shadow-sm" : "text-black/50 hover:text-black"}`}>
            {m === "login" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Full Name *</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30" />
                <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="T. Moyo"
                  className="w-full h-9 pl-8 pr-2 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Phone Number *</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30" />
                <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+263 77 000 0000"
                  className="w-full h-9 pl-8 pr-2 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Work Email *</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30" />
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="name@gov.zw"
              className="w-full h-9 pl-8 pr-2 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
        </div>

        {/* Hierarchy selector — shown for both register AND login */}
        <div>
          <label className="text-xs font-medium text-black/50 uppercase tracking-wider">
            Ministry / Department / Role {mode === "register" ? "*" : "(optional — routes to correct dashboard)"}
          </label>
          <button type="button" onClick={() => setShowHierarchy(!showHierarchy)}
            className="w-full mt-1 h-10 px-3 rounded-xl border border-black/10 text-sm text-left flex items-center gap-2 hover:border-black/25 transition-colors bg-white">
            {hier.roleTitle ? (
              <div className="flex-1 min-w-0">
                <span className="block text-xs text-black truncate">{hier.roleTitle}</span>
                <span className="block text-[10px] text-black/40 truncate">
                  {hier.ministryId === "presidency"
                    ? "Office of the President and Cabinet · OPC"
                    : `${selectedMinistry?.name} · ${selectedDept?.name ?? "CPO"}`}
                </span>
              </div>
            ) : (
              <span className="flex-1 text-black/35 text-xs">Click to select from government hierarchy…</span>
            )}
            <ChevronDown className={`h-4 w-4 text-black/30 flex-shrink-0 transition-transform ${showHierarchy ? "rotate-180" : ""}`} />
          </button>
          {showHierarchy && (
            <div className="mt-2">
              <GovHierarchySelector value={hier} onChange={setHier} onClose={() => setShowHierarchy(false)} />
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Password *</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30" />
            <input type={showPwd ? "text" : "password"} value={form.password}
              onChange={e => set("password", e.target.value)} placeholder="••••••••"
              className="w-full h-9 pl-8 pr-10 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
              {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {mode === "register" && (
          <div>
            <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Confirm Password *</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30" />
              <input type="password" value={form.confirm}
                onChange={e => set("confirm", e.target.value)} placeholder="••••••••"
                className="w-full h-9 pl-8 pr-2 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-3 font-medium shadow-sm">
            <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full h-10 rounded-xl bg-gray-950 text-white text-sm font-semibold hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? "Please wait…" : <><Shield className="h-4 w-4" /> {mode === "login" ? "Sign In" : "Create Account"}</>}
        </button>
      </form>
    </div>
  );
}

// ─── Entry Choice ─────────────────────────────────────────────────────────────
function EntryChoice({ onPublic, onStaff, onRoleSelect }: { onPublic: () => void; onStaff: () => void; onRoleSelect: () => void }) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-black" style={{ letterSpacing: "-0.02em" }}>
          APPOIS — AI-Powered Public Procurement &amp; Oversight Intelligence System
        </h1>
        <p className="text-sm text-black/50 mt-2">Integrity · Public Trust · Transparency · Good Governance · Clean Procurement</p>
      </div>

      <div className="space-y-3">
        <button onClick={onPublic}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-colors text-left group">
          <div className="h-12 w-12 rounded-xl bg-white/20 grid place-items-center flex-shrink-0">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-white">Supplier Portal</div>
            <div className="text-sm text-blue-200">Browse tenders · Bid · Submit applications</div>
            <div className="text-xs text-blue-300 mt-0.5">Sign in or register with company details</div>
          </div>
          <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white flex-shrink-0" />
        </button>

        <button onClick={onRoleSelect}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-gray-950 hover:bg-gray-900 transition-colors text-left group border border-white/5">
          <div className="h-12 w-12 rounded-xl bg-white/10 grid place-items-center flex-shrink-0">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-white">Government Staff Portal</div>
            <div className="text-sm text-white/55">Ministry · Department · Role access</div>
            <div className="text-xs text-white/35 mt-0.5">
              {ALL_ROLES.length} roles · {ZW_MINISTRIES.length} ministries
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-white flex-shrink-0" />
        </button>

        {/* Full credentials login */}
        <button onClick={onStaff}
          className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white hover:bg-gray-50 transition-colors text-left group border border-black/10">
          <div className="h-9 w-9 rounded-lg bg-gray-100 grid place-items-center flex-shrink-0">
            <Users className="h-4 w-4 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-black">Sign in with credentials</div>
            <div className="text-xs text-black/40">Use email &amp; password</div>
          </div>
          <ArrowRight className="h-4 w-4 text-black/20 group-hover:text-primary flex-shrink-0" />
        </button>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="text-sm text-black/40 hover:text-black transition-colors">← Back to home</Link>
      </div>
    </div>
  );
}

// ─── Main SignInPage ───────────────────────────────────────────────────────────
type Screen = "choice" | "public" | "staff" | "role-select";

export default function SignInPage() {
  const location = useLocation();
  const locationState = location.state as { screen?: Screen; mode?: "login" | "register" } | null;
  const [screen, setScreen] = useState<Screen>(locationState?.screen ?? "choice");

  return (
    <div className="min-h-screen flex bg-[#F5F5F5]">

      {/* ── Left dark panel (desktop only) ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[50%] flex-col bg-gray-950 border-r border-white/5">

        {/* Header — full-width title, no logo icon */}
        <div className="px-8 py-5 border-b border-white/8 flex-shrink-0">
          <Link to="/" className="block w-full">
            <div className="text-[13px] font-extrabold text-white tracking-widest leading-snug uppercase w-full">
              AI POWERED ELECTRONIC PUBLIC PROCUREMENT &amp; OVERSIGHT INTELLIGENCE SYSTEM
            </div>
          </Link>
        </div>

        {/* Tag line — smaller */}
        <div className="px-8 py-5 flex-shrink-0 border-b border-white/8">
          <h2 className="text-lg font-semibold text-white leading-snug mb-2" style={{ letterSpacing: "-0.02em" }}>
            Integrity.<br />Public Trust.<br />Transparency.<br />Good Governance.<br />Clean Procurement.
          </h2>
          <p className="text-xs text-white/45 leading-relaxed">
            AI-Powered Electronic Public Procurement &amp; Oversight Intelligence System (APPOIS).
          </p>
        </div>

        {/* Government hierarchy panel — larger window */}
        <div className="flex-1 px-4 py-4 overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3 px-2 flex-shrink-0">
            <div>
              <div className="text-sm font-semibold text-white/80">Government Hierarchy</div>
              <div className="text-[11px] text-white/40 mt-0.5">
                President · {ZW_MINISTRIES.length} Ministries · {ZW_MINISTRIES.reduce((acc, m) => acc + m.departments.length, 0)} Departments · {ALL_ROLES.length} Roles
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-white/30">Live</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-none">
            <GovHierarchyPanel />
          </div>
        </div>

        {/* Stats bar */}
        <div className="px-6 py-4 border-t border-white/8 flex-shrink-0 grid grid-cols-3 gap-3">
          {[
            { label: "Ministries", val: String(ZW_MINISTRIES.length), color: "text-blue-400" },
            { label: "Departments", val: String(ZW_MINISTRIES.reduce((acc, m) => acc + m.departments.length, 0)), color: "text-emerald-400" },
            { label: "Roles", val: String(ALL_ROLES.length + 10), color: "text-violet-400" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`text-base font-bold ${s.color}`}>{s.val}</div>
              <div className="text-[9px] text-white/30 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-white/8 flex-shrink-0">
          <p className="text-[10px] text-white/20">© 2026 APPOIS — AI-Powered Electronic Public Procurement &amp; Oversight Intelligence System</p>
        </div>
      </div>

      {/* ── Right content panel ───────────────────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center p-6 lg:p-12 overflow-y-auto">
        {screen === "choice" && (
          <EntryChoice
            onPublic={() => setScreen("public")}
            onStaff={() => setScreen("staff")}
            onRoleSelect={() => setScreen("role-select")}
          />
        )}
        {screen === "public" && (
          <PublicLogin onBack={() => setScreen("choice")} initialMode={locationState?.mode ?? "login"} />
        )}
        {screen === "staff" && (
          <GovStaffForm onBack={() => setScreen("choice")} />
        )}
        {screen === "role-select" && (
          <RoleSelectForm onBack={() => setScreen("choice")} />
        )}
      </div>
    </div>
  );
}
