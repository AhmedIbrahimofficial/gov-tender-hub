import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, ALL_ROLES, type UserRole } from "@/lib/auth-context";
import { ZW_MINISTRIES } from "@/lib/zw-ministries";
import {
  ArrowRight, Shield, Eye, EyeOff, ChevronLeft, ChevronRight,
  Search, X, Crown, Landmark, Building2, Users, User, Mail, Lock,
  Phone, Briefcase, CheckCircle2, Sparkles, Star,
} from "lucide-react";
import { seedIfEmpty } from "@/lib/local-store";

/* ─── Logo ──────────────────────────────────────────────────────────────── */
function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
    </svg>
  );
}

/* ─── Full Government Hierarchy Panel (left side, no scroll, fills height) ── */
function GovHierarchyPanel({ onSelectRole }: {
  onSelectRole?: (roleTitle: string, deptName: string, ministryName: string) => void;
}) {
  const [openMin, setOpenMin] = useState<string>("mof"); // default open first
  const [openDept, setOpenDept] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (search.length < 2) return ZW_MINISTRIES;
    const q = search.toLowerCase();
    return ZW_MINISTRIES
      .map(m => ({
        ...m,
        departments: m.departments.map(d => ({
          ...d,
          roles: d.roles.filter(r =>
            r.title.toLowerCase().includes(q) ||
            d.name.toLowerCase().includes(q) ||
            m.name.toLowerCase().includes(q)
          ),
        })).filter(d => d.roles.length > 0),
      }))
      .filter(m => m.departments.length > 0);
  }, [search]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Search */}
      <div className="relative mb-3 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search ministry, department, role…"
          className="w-full h-9 pl-9 pr-7 rounded-xl bg-white/8 border border-white/10 text-[11px] text-white/80 placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Prime Minister node */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/12 border border-amber-400/20 mb-2 flex-shrink-0">
        <div className="h-5 w-5 rounded-lg bg-amber-400 grid place-items-center flex-shrink-0">
          <Crown className="h-2.5 w-2.5 text-white" />
        </div>
        <span className="text-[11px] font-semibold text-amber-300 leading-tight">Prime Minister</span>
        <span className="ml-auto text-[9px] text-amber-400/50 flex-shrink-0">Head of Govt</span>
      </div>

      {/* Scrollable ministry tree - takes remaining height */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-0.5 pr-0.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
        {filtered.map(ministry => (
          <div key={ministry.id}>
            <button
              onClick={() => setOpenMin(openMin === ministry.id ? "" : ministry.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all text-left group
                ${openMin === ministry.id ? "bg-white/10 border border-white/15" : "hover:bg-white/6 border border-transparent"}`}
            >
              <div className="h-5 w-5 rounded-md bg-blue-500/50 grid place-items-center flex-shrink-0">
                <Landmark className="h-2.5 w-2.5 text-white/80" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-white/75 block truncate leading-tight">
                  {ministry.name.replace("Ministry of ", "Min. ")}
                </span>
                <span className="text-[8px] text-white/30">{ministry.code} · {ministry.departments.length} depts</span>
              </div>
              <ChevronRight className={`h-3 w-3 text-white/20 flex-shrink-0 transition-transform ${openMin === ministry.id ? "rotate-90" : ""}`} />
            </button>

            {openMin === ministry.id && (
              <div className="ml-3.5 pl-2.5 border-l border-white/10 space-y-0.5 mt-0.5 mb-1">
                {ministry.departments.map(dept => (
                  <div key={dept.id}>
                    <button
                      onClick={() => setOpenDept(openDept === dept.id ? null : dept.id)}
                      className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all text-left
                        ${openDept === dept.id ? "bg-emerald-500/15 border border-emerald-500/20" : "hover:bg-white/5 border border-transparent"}`}
                    >
                      <div className="h-4 w-4 rounded-md bg-emerald-500/40 grid place-items-center flex-shrink-0">
                        <Building2 className="h-2 w-2 text-white/70" />
                      </div>
                      <span className="text-[9.5px] text-white/55 truncate flex-1 leading-tight">{dept.name}</span>
                      <span className="text-[8px] text-white/25 flex-shrink-0">{dept.roles.length}</span>
                      <ChevronRight className={`h-2.5 w-2.5 text-white/15 flex-shrink-0 transition-transform ${openDept === dept.id ? "rotate-90" : ""}`} />
                    </button>

                    {openDept === dept.id && (
                      <div className="ml-3 pl-2 border-l border-white/8 space-y-0.5 mt-0.5 mb-0.5">
                        {dept.roles.map(role => (
                          <button
                            key={role.title}
                            onClick={() => onSelectRole?.(role.title, dept.name, ministry.name)}
                            className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded-md hover:bg-white/12 transition-colors text-left group"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-white/15 flex-shrink-0 group-hover:bg-white/40" />
                            <span className="text-[9px] text-white/40 group-hover:text-white/70 truncate flex-1 leading-tight">{role.title}</span>
                            <span className={`text-[7px] px-1 py-0.5 rounded flex-shrink-0 leading-none
                              ${role.level === "Executive" ? "bg-amber-500/20 text-amber-300/70" :
                                role.level === "Senior" ? "bg-blue-500/20 text-blue-300/70" :
                                "bg-white/5 text-white/25"}`}>
                              {role.level.slice(0, 3)}
                            </span>
                            {onSelectRole && <ArrowRight className="h-2 w-2 text-white/10 group-hover:text-white/40 flex-shrink-0" />}
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
      </div>

      {/* Stats bar */}
      <div className="flex-shrink-0 mt-3 pt-3 border-t border-white/8 grid grid-cols-3 gap-2">
        {[
          { val: String(ZW_MINISTRIES.length), label: "Ministries", color: "text-blue-400" },
          { val: String(ZW_MINISTRIES.reduce((s, m) => s + m.departments.length, 0)), label: "Departments", color: "text-emerald-400" },
          { val: ALL_ROLES.length + "+", label: "Roles", color: "text-violet-400" },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className={`text-sm font-bold ${s.color}`}>{s.val}</div>
            <div className="text-[8px] text-white/25 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Role resolver: map any role title string → UserRole key ────────────── */
function resolveRoleKey(roleTitle: string): UserRole {
  const t = roleTitle.toLowerCase();
  const exact = ALL_ROLES.find(r => r.label.toLowerCase() === t);
  if (exact) return exact.role;
  // keyword fallback map
  const MAP: Array<[string, UserRole]> = [
    ["president",             "president"],
    ["prime minister",        "permanent_secretary"],
    ["permanent secretary",   "permanent_secretary"],
    ["chief executive",       "chief_executive"],
    ["minister",              "minister"],
    ["director",              "procurement_director"],
    ["chief procurement",     "cpo"],
    ["cpo",                   "cpo"],
    ["chief financial",       "finance_officer"],
    ["finance manager",       "finance_officer"],
    ["budget manager",        "budget_officer"],
    ["treasury manager",      "treasury_officer"],
    ["financial accountant",  "finance_officer"],
    ["management accountant", "finance_officer"],
    ["revenue accountant",    "finance_officer"],
    ["payroll officer",       "finance_officer"],
    ["accounts payable",      "finance_officer"],
    ["accounts receivable",   "finance_officer"],
    ["finance officer",       "finance_officer"],
    ["accounting officer",    "finance_officer"],
    ["finance clerk",         "finance_officer"],
    ["procurement manager",   "cpo"],
    ["procurement officer",   "procurement_officer"],
    ["tender",                "procurement_officer"],
    ["contract manag",        "contract_manager"],
    ["contract officer",      "contract_officer"],
    ["supplier manag",        "procurement_officer"],
    ["inventory manag",       "stores_officer"],
    ["stores officer",        "stores_officer"],
    ["logistics",             "logistics_officer"],
    ["warehouse",             "stores_officer"],
    ["asset disposal",        "asset_manager"],
    ["evaluator",             "evaluator"],
    ["adjudication",          "adjudication_officer"],
    ["award",                 "adjudication_officer"],
    ["project manager",       "project_manager"],
    ["planning officer",      "planning_officer"],
    ["strategic planning",    "planning_officer"],
    ["policy manager",        "planning_officer"],
    ["policy analyst",        "planning_officer"],
    ["research officer",      "planning_officer"],
    ["monitoring",            "performance_officer"],
    ["evaluation officer",    "performance_officer"],
    ["statistics officer",    "data_analytics_officer"],
    ["data analyst",          "data_analytics_officer"],
    ["performance manag",     "performance_officer"],
    ["hr manager",            "it_officer"],
    ["hr officer",            "it_officer"],
    ["recruitment",           "it_officer"],
    ["talent manag",          "it_officer"],
    ["learning",              "it_officer"],
    ["employee relations",    "ethics_officer"],
    ["compensation",          "finance_officer"],
    ["wellness officer",      "health_safety_officer"],
    ["occupational health",   "health_safety_officer"],
    ["director, ict",         "it_officer"],
    ["ict manager",           "it_officer"],
    ["systems admin",         "system_admin"],
    ["network admin",         "system_admin"],
    ["database admin",        "system_admin"],
    ["cybersecurity",         "it_officer"],
    ["software developer",    "it_officer"],
    ["ict support",           "it_officer"],
    ["service desk",          "it_officer"],
    ["business systems",      "it_officer"],
    ["data officer",          "data_analytics_officer"],
    ["digital transform",     "it_officer"],
    ["communications officer","communications_officer"],
    ["public relations",      "communications_officer"],
    ["marketing officer",     "communications_officer"],
    ["media relations",       "communications_officer"],
    ["stakeholder",           "communications_officer"],
    ["community outreach",    "communications_officer"],
    ["social media",          "communications_officer"],
    ["graphic designer",      "communications_officer"],
    ["events officer",        "communications_officer"],
    ["admin manager",         "records_officer"],
    ["office manager",        "records_officer"],
    ["executive secretary",   "records_officer"],
    ["admin officer",         "records_officer"],
    ["records manager",       "records_officer"],
    ["records officer",       "records_officer"],
    ["registry clerk",        "records_officer"],
    ["facilities manager",    "records_officer"],
    ["facilities officer",    "records_officer"],
    ["transport officer",     "logistics_officer"],
    ["security officer",      "security_officer"],
    ["receptionist",          "end_user"],
    ["legal counsel",         "legal_officer"],
    ["legal officer",         "legal_officer"],
    ["compliance manager",    "compliance_officer"],
    ["compliance officer",    "compliance_officer"],
    ["governance officer",    "compliance_officer"],
    ["regulatory",            "regulator"],
    ["ethics officer",        "ethics_officer"],
    ["risk",                  "risk_officer"],
    ["chief internal auditor","auditor"],
    ["audit manager",         "audit_officer"],
    ["internal auditor",      "audit_officer"],
    ["fraud prevention",      "anti_corruption_officer"],
    ["business continuity",   "risk_officer"],
    ["internal controls",     "audit_officer"],
    ["director, research",    "planning_officer"],
    ["research manager",      "planning_officer"],
    ["statistician",          "data_analytics_officer"],
    ["knowledge manag",       "data_analytics_officer"],
    ["survey officer",        "data_analytics_officer"],
    ["regional director",     "procurement_director"],
    ["district coordinator",  "planning_officer"],
    ["district officer",      "planning_officer"],
    ["field officer",         "inspection_officer"],
    ["community liaison",     "citizen"],
    ["customer service",      "end_user"],
    ["cashier",               "end_user"],
    ["call centre",           "end_user"],
    ["complaints officer",    "end_user"],
    ["permit officer",        "end_user"],
    ["licensing officer",     "end_user"],
    ["applications officer",  "end_user"],
    ["approval officer",      "end_user"],
    ["revenue collection",    "treasury_officer"],
    ["front office",          "end_user"],
    ["quality assurance",     "qa_officer"],
    ["inspection officer",    "inspection_officer"],
    ["fleet officer",         "logistics_officer"],
    ["operations manager",    "project_manager"],
    ["operations officer",    "planning_officer"],
    ["field supervisor",      "inspection_officer"],
    ["field inspector",       "inspection_officer"],
    ["chief of staff",        "permanent_secretary"],
    ["strategic advisor",     "permanent_secretary"],
    ["public affairs",        "communications_officer"],
    ["board affairs",         "board_member"],
    ["executive assistant",   "end_user"],
    ["secretariat",           "end_user"],
    ["protocol officer",      "end_user"],
    ["asset manager",         "asset_manager"],
    ["asset",                 "asset_manager"],
    ["audit",                 "audit_officer"],
    ["health & safety",       "health_safety_officer"],
    ["health safety",         "health_safety_officer"],
    ["environment officer",   "environment_officer"],
    ["gender",                "gender_officer"],
    ["public auditor",        "public_auditor"],
    ["board member",          "board_member"],
    ["executive director",    "executive_director"],
    ["regulator",             "regulator"],
    ["system admin",          "system_admin"],
    ["ai governance",         "ai_governance_officer"],
    ["inspector",             "inspection_officer"],
  ];
  for (const [keyword, role] of MAP) {
    if (t.includes(keyword)) return role;
  }
  return "end_user";
}

/* ─── Quick Demo Roles ──────────────────────────────────────────────────── */
const QUICK_ROLES: { label: string; role: UserRole; name: string; dept: string; entity: string; color: string }[] = [
  { label: "Prime Minister",  role: "permanent_secretary", name: "Hon. E. Mnangagwa", dept: "Office of the President",     entity: "Government of Zimbabwe", color: "bg-amber-600" },
  { label: "Minister",        role: "minister",           name: "Hon. B. Mutasa",    dept: "Cabinet Office",              entity: "Cabinet Office",         color: "bg-slate-800" },
  { label: "CPO",             role: "cpo",                name: "T. Moyo",           dept: "Procurement",                 entity: "PRAZ",                   color: "bg-gray-900" },
  { label: "Finance Officer", role: "finance_officer",    name: "R. Chikwanda",      dept: "Finance",                     entity: "Ministry of Finance",    color: "bg-emerald-700" },
  { label: "Auditor",         role: "auditor",            name: "S. Nkosi",          dept: "Audit",                       entity: "OAG",                    color: "bg-amber-700" },
  { label: "Evaluator",       role: "evaluator",          name: "P. Dube",           dept: "Procurement",                 entity: "Ministry of Health",     color: "bg-indigo-700" },
  { label: "IT Officer",      role: "it_officer",         name: "A. Mpofu",          dept: "ICT",                         entity: "PRAZ",                   color: "bg-sky-700" },
  { label: "Risk Officer",    role: "risk_officer",       name: "J. Banda",          dept: "Risk & Audit",                entity: "Treasury",               color: "bg-red-700" },
];

/* ─── Government Staff Login Form ──────────────────────────────────────── */
function StaffLoginForm({ prefilledRole, prefilledDept, prefilledEntity, onBack }: {
  prefilledRole?: string;
  prefilledDept?: string;
  prefilledEntity?: string;
  onBack: () => void;
}) {
  const { loginWithDetails } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    roleTitle: prefilledRole ?? "",
    dept: prefilledDept ?? "",
    entity: prefilledEntity ?? "Government of Zimbabwe",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const resolvedRole = resolveRoleKey(form.roleTitle || "end_user");
  const roleEntry = ALL_ROLES.find(r => r.role === resolvedRole) ?? ALL_ROLES[4];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) { setError("Full name is required."); return; }
    if (!form.email.trim()) { setError("Email is required."); return; }
    if (!form.password) { setError("Password is required."); return; }
    if (!form.roleTitle.trim()) { setError("Please select your role from the hierarchy or type your role title."); return; }
    setLoading(true);
    setTimeout(() => {
      loginWithDetails({
        role: resolvedRole,
        name: form.name,
        email: form.email,
        phone: form.phone,
        department: form.dept || form.roleTitle,
        entity: form.entity,
      });
      seedIfEmpty(form.email);
      navigate("/dashboard");
    }, 700);
  };

  return (
    <div className="w-full max-w-md">
      {/* Back */}
      <button onClick={onBack}
        className="flex items-center gap-1.5 mb-6 text-black/50 hover:text-black text-sm transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      {/* Role badge */}
      <div className={`flex items-center gap-3 mb-6 p-4 rounded-2xl ${roleEntry.color}`}>
        <div className="h-10 w-10 rounded-xl bg-white/20 grid place-items-center flex-shrink-0">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-base font-semibold text-white leading-tight">{form.roleTitle || "Government Staff"}</div>
          <div className="text-xs text-white/60 mt-0.5">{form.dept || "Select role from hierarchy"}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-[10px] text-white/40">System role</div>
          <div className="text-[11px] text-white/70 font-mono">{resolvedRole}</div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* Role title field */}
        <div>
          <label className="text-xs font-semibold text-black/50 uppercase tracking-wider block mb-1.5">
            Role / Position Title *
          </label>
          <div className="relative">
            <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input
              value={form.roleTitle}
              onChange={e => set("roleTitle", e.target.value)}
              placeholder="e.g. Finance Officer, Procurement Manager…"
              className="w-full h-11 pl-10 pr-4 rounded-2xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/15 bg-white"
            />
          </div>
          <p className="text-[10px] text-black/35 mt-1 pl-1">
            Auto-detected: <span className="font-semibold text-black/50">{roleEntry.label}</span>
          </p>
        </div>

        {/* Name + Phone row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-black/50 uppercase tracking-wider block mb-1.5">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <input value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="T. Moyo"
                className="w-full h-11 pl-10 pr-3 rounded-2xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/15 bg-white" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-black/50 uppercase tracking-wider block mb-1.5">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <input value={form.phone} onChange={e => set("phone", e.target.value)}
                placeholder="+263 77 000 0000"
                className="w-full h-11 pl-10 pr-3 rounded-2xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/15 bg-white" />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-black/50 uppercase tracking-wider block mb-1.5">Work Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
              placeholder="name@gov.zw"
              className="w-full h-11 pl-10 pr-4 rounded-2xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/15 bg-white" />
          </div>
        </div>

        {/* Entity */}
        <div>
          <label className="text-xs font-semibold text-black/50 uppercase tracking-wider block mb-1.5">Ministry / Entity</label>
          <div className="relative">
            <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input value={form.entity} onChange={e => set("entity", e.target.value)}
              placeholder="Ministry of Finance"
              className="w-full h-11 pl-10 pr-4 rounded-2xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/15 bg-white" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-semibold text-black/50 uppercase tracking-wider block mb-1.5">Password *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={e => set("password", e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 pl-10 pr-11 rounded-2xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/15 bg-white"
            />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        )}

        <button type="submit" disabled={loading}
          className="w-full h-12 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-3 mt-2">
          {loading ? "Signing in…" : (
            <>
              Enter as {roleEntry.label}
              <span className="bg-white rounded-full p-1.5">
                <ArrowRight className="h-3.5 w-3.5 text-black" />
              </span>
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-black/35 text-center mt-4">
        Demo: any credentials work. Role auto-detected from your title.
      </p>
    </div>
  );
}

/* ─── Main SignInPage ──────────────────────────────────────────────────── */
type Screen = "landing" | "login-form";

export default function SignInPage() {
  const { loginWithDetails } = useAuth();
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("landing");
  const [prefilledRole, setPrefilledRole] = useState("");
  const [prefilledDept, setPrefilledDept] = useState("");
  const [prefilledEntity, setPrefilledEntity] = useState("");

  /* Quick demo login — one click, no form */
  const quickLogin = (q: typeof QUICK_ROLES[number]) => {
    loginWithDetails({
      role: q.role,
      name: q.name,
      email: `${q.name.toLowerCase().replace(/[\s.]/g, "")}@gov.zw`,
      department: q.dept,
      entity: q.entity,
    });
    seedIfEmpty(q.name);
    navigate("/dashboard");
  };

  /* Hierarchy tree role click → pre-fill form */
  const handleHierarchySelect = (roleTitle: string, deptName: string, ministryName: string) => {
    setPrefilledRole(roleTitle);
    setPrefilledDept(deptName);
    setPrefilledEntity(ministryName);
    setScreen("login-form");
  };

  return (
    /* Outer wrapper — same #F5F5F5 background as LandingPage */
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">

      {/* ── Navbar (landing-page style) ─────────────────────────────────── */}
      <nav className="flex-shrink-0 px-6 py-5 flex items-center justify-between max-w-[88rem] mx-auto w-full">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <LogoIcon className="w-6 h-6 text-black flex-shrink-0" />
          <div className="leading-none hidden sm:block">
            <div className="text-[10px] font-bold text-black tracking-tight leading-tight uppercase">AI Powered Electronic Public</div>
            <div className="text-[10px] font-bold text-black tracking-tight leading-tight uppercase">Procurement &amp; Oversight</div>
            <div className="text-[10px] font-bold text-black/60 tracking-tight leading-tight uppercase">Intelligence System</div>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {[{label:"Tenders",to:"/tenders"},{label:"Analytics",to:"/analytics"},{label:"About",to:"/portal"}].map(l => (
            <Link key={l.label} to={l.to} className="text-base text-gray-700 hover:text-black font-medium transition-colors duration-200">{l.label}</Link>
          ))}
        </div>
        <Link to="/" className="text-sm text-black/50 hover:text-black transition-colors duration-200">
          ← Home
        </Link>
      </nav>

      {/* ── Main two-column body ─────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0 px-6 pb-6 gap-6 max-w-[88rem] mx-auto w-full">

        {/* ── LEFT: Dark hierarchy panel (large, no external scroll) ──── */}
        <div
          className="hidden lg:flex flex-col rounded-2xl overflow-hidden flex-shrink-0"
          style={{
            width: "420px",
            minHeight: "calc(100vh - 120px)",
            background: "linear-gradient(160deg,#0f0f0f 0%,#1a1a1a 100%)",
          }}
        >
          {/* Panel header */}
          <div className="px-5 pt-6 pb-4 flex-shrink-0 border-b border-white/8">
            <h2
              className="text-2xl font-medium text-white mb-1"
              style={{ letterSpacing: "-0.03em" }}
            >
              Government<br />Hierarchy
            </h2>
            <p className="text-white/40 text-xs leading-relaxed">
              Browse ministries, departments and roles.<br />Click any role to pre-fill your login.
            </p>
          </div>

          {/* Hierarchy tree — fills remaining height */}
          <div className="flex-1 px-4 py-4 min-h-0">
            <GovHierarchyPanel onSelectRole={handleHierarchySelect} />
          </div>
        </div>

        {/* ── RIGHT: Login area ────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0">

          {screen === "landing" && (
            <div className="flex flex-col h-full">

              {/* Welcome heading */}
              <div className="mb-8 mt-4">
                <h1
                  className="text-4xl md:text-5xl font-medium text-black leading-tight mb-3"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  Staff Portal
                </h1>
                <p className="text-black/60 text-base max-w-md leading-relaxed">
                  Sign in with your government credentials to access your role-specific dashboard, procurement workbench, and management tools.
                </p>
              </div>

              {/* Quick access roles — landing page card style */}
              <div className="mb-8">
                <p className="text-black/60 text-sm mb-4 font-medium">Quick Access — Demo Roles</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {QUICK_ROLES.map(q => (
                    <button
                      key={q.role}
                      onClick={() => quickLogin(q)}
                      className="flex flex-col items-start p-4 rounded-2xl bg-white border border-black/8 hover:border-black/20 hover:shadow-md transition-all text-left group"
                    >
                      <div className={`h-8 w-8 rounded-xl ${q.color} grid place-items-center mb-3`}>
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-xs font-semibold text-black leading-tight mb-0.5">{q.label}</div>
                      <div className="text-[10px] text-black/40 truncate w-full">{q.name}</div>
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-black/30 group-hover:text-black/60 transition-colors">
                        Enter <ArrowRight className="h-2.5 w-2.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-black/10" />
                <span className="text-xs text-black/40 font-medium">or sign in with your own credentials</span>
                <div className="flex-1 h-px bg-black/10" />
              </div>

              {/* Sign in with role entry */}
              <div
                className="rounded-2xl overflow-hidden border border-black/8 bg-white p-6 max-w-md"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-black grid place-items-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-medium text-black">Government Staff</div>
                    <div className="text-xs text-black/50">Sign in with any role</div>
                  </div>
                </div>

                <button
                  onClick={() => setScreen("login-form")}
                  className="w-full inline-flex items-center justify-between gap-3 bg-black text-white text-base font-medium pl-7 pr-3 py-3 rounded-full hover:bg-gray-800 transition-colors duration-200"
                >
                  Sign in as Staff
                  <span className="bg-white rounded-full p-1.5">
                    <ArrowRight className="w-4 h-4 text-black" />
                  </span>
                </button>

                <p className="text-xs text-black/35 mt-4 leading-relaxed">
                  Browse the hierarchy on the left, click your role, and proceed to sign in. Or click above to enter credentials manually.
                </p>
              </div>

              {/* Features strip (landing page style) */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Integrity", desc: "Every action is immutably logged with a full audit trail." },
                  { label: "Transparency", desc: "All procurement decisions are transparent and AI-enforced." },
                  { label: "Good Governance", desc: "Role-based access ensures the right people see the right data." },
                ].map(f => (
                  <div key={f.label} className="p-5 rounded-2xl border border-black/8 bg-white">
                    <div className="text-sm font-semibold text-black mb-1">{f.label}</div>
                    <div className="text-xs text-black/50 leading-relaxed">{f.desc}</div>
                  </div>
                ))}
              </div>

              {/* Stats (landing-page style) */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { value: "1,287", label: "Active Tenders" },
                  { value: "94.2%", label: "Compliance Score" },
                  { value: "USD 2.84B", label: "Managed Spend" },
                ].map(s => (
                  <div key={s.label} className="text-center py-4 rounded-2xl border border-black/8 bg-white">
                    <div className="text-2xl font-medium text-black" style={{ letterSpacing: "-0.03em" }}>{s.value}</div>
                    <div className="text-xs text-black/50 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {screen === "login-form" && (
            <div className="flex items-start justify-center pt-4">
              <StaffLoginForm
                prefilledRole={prefilledRole}
                prefilledDept={prefilledDept}
                prefilledEntity={prefilledEntity}
                onBack={() => {
                  setScreen("landing");
                  setPrefilledRole("");
                  setPrefilledDept("");
                  setPrefilledEntity("");
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Footer (landing-page style) ──────────────────────────────────── */}
      <footer className="flex-shrink-0 px-6 py-6 border-t border-black/10 max-w-[88rem] mx-auto w-full flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-black/30">
          © 2026 AI Powered Electronic Public Procurement and Oversight Intelligence System · Government of Zimbabwe
        </div>
        <div className="flex gap-6 text-sm text-black/40">
          <Link to="/portal" className="hover:text-black transition-colors">Privacy</Link>
          <Link to="/portal" className="hover:text-black transition-colors">Terms</Link>
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
        </div>
      </footer>
    </div>
  );
}
