import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, ALL_ROLES, type UserRole } from "@/lib/auth-context";
import { ZW_MINISTRIES } from "@/lib/zw-ministries";
import {
  Eye, EyeOff, ArrowRight, Shield, Building2, ChevronLeft, X,
  Phone, User, Mail, Lock, Briefcase, Landmark, GitBranch,
  ChevronRight, Building, Search, Users, ChevronDown,
} from "lucide-react";
import { seedIfEmpty } from "@/lib/local-store";

function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
    </svg>
  );
}

// ─── Full Org Hierarchy data with all 14 departments & roles ─────────────────
const ORG_DEPARTMENTS = [
  { id: "ps-office",      label: "Office of the Permanent Secretary", code: "PS",   color: "bg-violet-600",
    roles: ["Permanent Secretary","Deputy Permanent Secretary","Chief of Staff","Executive Assistant","Protocol Officer","Secretariat Officer","Board Affairs Officer","Strategic Advisor","Public Affairs Advisor"] },
  { id: "strategy",       label: "Strategy, Policy & Planning",       code: "SPP",  color: "bg-blue-600",
    roles: ["Director, Strategy and Planning","Policy Manager","Senior Policy Analyst","Policy Analyst","Strategic Planning Officer","Research Officer","Monitoring and Evaluation Manager","Monitoring and Evaluation Officer","Statistics Officer","Data Analyst","Performance Management Officer"] },
  { id: "finance",        label: "Finance & Accounting",              code: "FIN",  color: "bg-emerald-600",
    roles: ["Director, Finance","Chief Financial Officer","Finance Manager","Budget Manager","Treasury Manager","Financial Accountant","Management Accountant","Revenue Accountant","Payroll Officer","Accounts Payable Officer","Accounts Receivable Officer","Finance Officer","Accounting Officer","Finance Clerk"] },
  { id: "procurement",    label: "Procurement & Supply Chain",        code: "PSC",  color: "bg-amber-600",
    roles: ["Director, Procurement","Procurement Manager","Senior Procurement Officer","Procurement Officer","Tender and Contracts Officer","Contract Management Officer","Supplier Management Officer","Inventory Manager","Stores Officer","Logistics Officer","Warehouse Officer","Asset Disposal Officer"] },
  { id: "service",        label: "Service Delivery & Client Services",code: "SVC",  color: "bg-cyan-600",
    roles: ["Director, Service Delivery","Service Centre Manager","Customer Service Manager","Front Office Supervisor","Applications Processing Manager","Applications Officer","Licensing Officer","Permit Officer","Approval Officer","Revenue Collection Officer","Cashier","Customer Service Officer","Call Centre Officer","Complaints Officer","Communications Officer"] },
  { id: "operations",     label: "Operations",                        code: "OPS",  color: "bg-orange-600",
    roles: ["Director, Operations","Operations Manager","Regional Operations Manager","District Operations Manager","Operations Officer","Field Supervisor","Field Inspector","Quality Assurance Officer","Risk Officer","Facilities Operations Officer","Fleet Officer","Logistics Coordinator"] },
  { id: "hr",             label: "Human Resources",                   code: "HR",   color: "bg-pink-600",
    roles: ["Director, Human Resources","HR Manager","Recruitment Officer","Talent Management Officer","Learning and Development Officer","Employee Relations Officer","Performance Management Officer","Compensation and Benefits Officer","HR Officer","HR Assistant","Wellness Officer","Occupational Health and Safety Officer"] },
  { id: "ict",            label: "ICT & Digital Transformation",      code: "ICT",  color: "bg-blue-700",
    roles: ["Director, ICT","ICT Manager","Systems Administrator","Network Administrator","Database Administrator","Cybersecurity Officer","Software Developer","ICT Support Officer","Service Desk Officer","Business Systems Analyst","Data Officer","Digital Transformation Officer"] },
  { id: "comms",          label: "Communications & Public Relations", code: "CPR",  color: "bg-indigo-600",
    roles: ["Director, Communications","Public Relations Manager","Corporate Communications Officer","Marketing Officer","Media Relations Officer","Stakeholder Engagement Officer","Community Outreach Officer","Digital Communications Officer","Social Media Officer","Graphic Designer","Events Officer"] },
  { id: "admin",          label: "Administration & Facilities",       code: "ADM",  color: "bg-gray-600",
    roles: ["Director, Administration","Administration Manager","Office Manager","Executive Secretary","Administrative Officer","Administrative Assistant","Records Manager","Records Officer","Registry Clerk","Facilities Manager","Facilities Officer","Transport Officer","Security Officer","Receptionist"] },
  { id: "legal",          label: "Legal & Compliance",                code: "LGL",  color: "bg-red-600",
    roles: ["Director, Legal Services","Legal Counsel","Senior Legal Officer","Legal Officer","Compliance Manager","Compliance Officer","Governance Officer","Regulatory Affairs Officer","Ethics Officer","Risk and Compliance Analyst"] },
  { id: "audit",          label: "Internal Audit & Risk Management",  code: "IAR",  color: "bg-rose-700",
    roles: ["Chief Internal Auditor","Internal Audit Manager","Senior Internal Auditor","Internal Auditor","Risk Manager","Risk Officer","Internal Controls Officer","Fraud Prevention Officer","Business Continuity Officer"] },
  { id: "research",       label: "Research, Monitoring & Evaluation", code: "RME",  color: "bg-teal-600",
    roles: ["Director, Research and M&E","Research Manager","Research Officer","Statistician","Monitoring and Evaluation Manager","Monitoring and Evaluation Officer","Data Analyst","Survey Officer","Knowledge Management Officer"] },
  { id: "regional",       label: "Regional & District Offices",       code: "RDO",  color: "bg-lime-600",
    roles: ["Regional Director","Regional Operations Manager","District Coordinator","District Officer","Field Officer","Community Liaison Officer","Administrative Officer","Finance Officer","Customer Service Officer"] },
];

const ORG_MINISTRIES = [
  { id: "pm",    label: "Prime Minister's Office",      color: "bg-slate-800",
    ministries: ["Ministry of Finance & Economic Development","Ministry of Justice, Legal & Parliamentary Affairs","Ministry of Foreign Affairs & International Trade"] },
  { id: "m1",    label: "Ministry of Finance & IP",     color: "bg-blue-700" },
  { id: "m2",    label: "Ministry of Health & CC",      color: "bg-emerald-700" },
  { id: "m3",    label: "Ministry of Transport",        color: "bg-violet-700" },
  { id: "m4",    label: "Ministry of Education",        color: "bg-amber-700" },
  { id: "m5",    label: "Ministry of Agriculture",      color: "bg-lime-700" },
  { id: "m6",    label: "Ministry of Energy",           color: "bg-orange-700" },
  { id: "m7",    label: "Ministry of Home Affairs",     color: "bg-red-700" },
];

// ─── Org Hierarchy Tree (left panel) ─────────────────────────────────────────
function OrgHierarchyTree({ onSelectRole }: { onSelectRole?: (role: string, dept: string) => void }) {
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(["ps-office"]));
  const [search, setSearch] = useState("");

  const toggle = (id: string) => setExpandedDepts(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const filteredDepts = search.length > 1
    ? ORG_DEPARTMENTS.map(d => ({
        ...d,
        roles: d.roles.filter(r => r.toLowerCase().includes(search.toLowerCase()) || d.label.toLowerCase().includes(search.toLowerCase())),
      })).filter(d => d.roles.length > 0)
    : ORG_DEPARTMENTS;

  return (
    <div className="space-y-1">
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search roles & departments…"
          className="w-full h-8 pl-8 pr-3 rounded-lg bg-white/8 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/20" />
        {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"><X className="h-3 w-3" /></button>}
      </div>

      {filteredDepts.map(dept => (
        <div key={dept.id}>
          <button onClick={() => toggle(dept.id)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/8 transition-colors group text-left">
            <div className={`h-6 w-6 rounded-lg ${dept.color} grid place-items-center flex-shrink-0`}>
              <Building2 className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-white/90 truncate">{dept.label}</div>
              <div className="text-[9px] text-white/35">{dept.code} · {dept.roles.length} roles</div>
            </div>
            <ChevronRight className={`h-3 w-3 text-white/25 transition-transform flex-shrink-0 ${expandedDepts.has(dept.id) ? "rotate-90" : ""}`} />
          </button>
          {expandedDepts.has(dept.id) && (
            <div className="ml-4 pl-2.5 border-l border-white/10 space-y-0.5 mb-1">
              {dept.roles.map(role => (
                <button key={role}
                  onClick={() => onSelectRole?.(role, dept.label)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-left group">
                  <Users className="h-3 w-3 text-white/25 flex-shrink-0 group-hover:text-white/60" />
                  <span className="text-[10px] text-white/55 group-hover:text-white/90 truncate">{role}</span>
                  {onSelectRole && <ArrowRight className="h-2.5 w-2.5 text-white/20 group-hover:text-white/60 ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Public / Company Portal Login ──────────────────────────────────────── */
function PublicLogin({ onBack }: { onBack: () => void }) {
  const { loginPublic } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", company: "", email: "", password: "", confirm: "" });
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    if (mode === "register") {
      if (!form.name || !form.company) { setError("Name and company are required."); return; }
      if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    }
    setLoading(true);
    setTimeout(() => {
      const name = form.name || form.email.split("@")[0];
      loginPublic(form.email, name, form.company || "Company");
      seedIfEmpty(form.email);
      navigate("/supplier-portal");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-md">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-blue-600 grid place-items-center">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-lg font-semibold text-black">Company / Supplier Portal</div>
          <div className="text-xs text-black/50">Browse tenders, bid, and track your applications</div>
        </div>
      </div>
      <div className="flex rounded-xl bg-black/5 p-1 mb-6">
        {(["login", "register"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? "bg-white text-black shadow-sm" : "text-black/50 hover:text-black"}`}>
            {m === "login" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "register" && (
          <>
            <div>
              <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Full Name *</label>
              <div className="relative mt-1.5"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="John Banda"
                  className="w-full h-11 pl-9 pr-4 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" /></div>
            </div>
            <div>
              <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Company / Organisation *</label>
              <div className="relative mt-1.5"><Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                <input value={form.company} onChange={e => set("company", e.target.value)} placeholder="Highveld Engineering (Pvt) Ltd"
                  className="w-full h-11 pl-9 pr-4 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" /></div>
            </div>
          </>
        )}
        <div>
          <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Email *</label>
          <div className="relative mt-1.5"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@company.com"
              className="w-full h-11 pl-9 pr-4 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" /></div>
        </div>
        <div>
          <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Password *</label>
          <div className="relative mt-1.5"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input type={showPwd ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••"
              className="w-full h-11 pl-9 pr-11 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button></div>
        </div>
        {error && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}
        <button type="submit" disabled={loading}
          className="w-full h-11 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
          {loading ? "Please wait…" : <><Shield className="h-4 w-4" /> {mode === "login" ? "Sign In to Portal" : "Create Account"}</>}
        </button>
      </form>
    </div>
  );
}

/* ─── Staff Role Detail Form ─────────────────────────────────────────────── */
function StaffLoginForm({ role, onBack }: { role: typeof ALL_ROLES[number]; onBack: () => void }) {
  const { loginWithDetails } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", ministryId: "", department: "", entity: "" });
  const selectedMinistry = ZW_MINISTRIES.find(m => m.id === form.ministryId);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!form.name || !form.email || !form.password) { setError("Name, email and password are required."); return; }
    setLoading(true);
    setTimeout(() => {
      loginWithDetails({
        role: role.role, name: form.name, email: form.email, phone: form.phone,
        department: form.department || role.label, entity: form.entity || "Government of Zimbabwe",
      });
      seedIfEmpty(form.email);
      navigate("/dashboard");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-md">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black mb-5 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to roles
      </button>
      <div className="flex items-center gap-3 mb-6">
        <div className={`h-10 w-10 rounded-xl ${role.color} grid place-items-center flex-shrink-0`}>
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-base font-semibold text-black">{role.label}</div>
          <div className="text-xs text-black/50">{role.desc}</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Full Name *</label>
            <div className="relative mt-1.5"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="T. Moyo"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/20" /></div>
          </div>
          <div>
            <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Phone</label>
            <div className="relative mt-1.5"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+263 77 000 0000"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/20" /></div>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Work Email *</label>
          <div className="relative mt-1.5"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="name@gov.zw"
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/20" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Ministry *</label>
            <div className="relative mt-1.5"><Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30 z-10" />
              <select value={form.ministryId}
                onChange={e => { const id = e.target.value; setForm(f => ({ ...f, ministryId: id, department: "", entity: ZW_MINISTRIES.find(m => m.id === id)?.name ?? "" })); }}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 text-sm focus:outline-none appearance-none">
                <option value="">Select ministry…</option>
                {ZW_MINISTRIES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select></div>
          </div>
          <div>
            <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Department</label>
            <div className="relative mt-1.5"><Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30 z-10" />
              <select value={form.department} disabled={!selectedMinistry}
                onChange={e => set("department", e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 text-sm focus:outline-none appearance-none disabled:bg-gray-50 disabled:text-black/30">
                <option value="">{selectedMinistry ? "Select dept / SOE…" : "Select ministry first"}</option>
                {selectedMinistry && (
                  <>
                    <optgroup label="Departments">{selectedMinistry.departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</optgroup>
                    {selectedMinistry.stateEntities.length > 0 && (
                      <optgroup label="State Entities">{selectedMinistry.stateEntities.map(s => <option key={s.id} value={s.name}>{s.name} ({s.code})</option>)}</optgroup>
                    )}
                  </>
                )}
              </select></div>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Password *</label>
          <div className="relative mt-1.5"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input type={showPwd ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••"
              className="w-full h-10 pl-9 pr-11 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button></div>
        </div>
        {error && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}
        <button type="submit" disabled={loading}
          className={`w-full h-11 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-1 ${role.color} hover:opacity-90`}>
          {loading ? "Signing in…" : <><Shield className="h-4 w-4" /> Enter as {role.label}</>}
        </button>
      </form>
    </div>
  );
}

/* ─── Staff Role Picker with org tree integration ──────────────────────── */
function StaffRolePicker({ onSelect, onBack }: {
  onSelect: (r: typeof ALL_ROLES[number]) => void;
  onBack: () => void;
}) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"roles" | "hierarchy">("hierarchy");

  const filtered = ALL_ROLES.filter(r =>
    r.label.toLowerCase().includes(search.toLowerCase()) ||
    r.desc.toLowerCase().includes(search.toLowerCase())
  );

  // Map org tree role names to ALL_ROLES
  const handleOrgRoleSelect = (roleName: string) => {
    const match = ALL_ROLES.find(r => r.label.toLowerCase().includes(roleName.toLowerCase().split(",")[0].toLowerCase()));
    if (match) { onSelect(match); return; }
    // Try partial match
    const words = roleName.toLowerCase().split(" ");
    const partial = ALL_ROLES.find(r => words.some(w => w.length > 4 && r.label.toLowerCase().includes(w)));
    if (partial) { onSelect(partial); return; }
    // Default to first officer-level role
    onSelect(ALL_ROLES[4]);
  };

  return (
    <div className="w-full max-w-2xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black mb-5 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-black mb-1">Select Your Work Station</h2>
        <p className="text-sm text-black/50">Browse the organisational hierarchy or search directly for your role</p>
      </div>

      {/* Toggle view */}
      <div className="flex rounded-xl bg-black/5 p-1 mb-4">
        {(["hierarchy", "roles"] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${view === v ? "bg-white text-black shadow-sm" : "text-black/50 hover:text-black"}`}>
            {v === "hierarchy" ? "🏛️ Org Hierarchy" : "⚡ Quick Role Search"}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles, departments…"
          className="w-full h-10 pl-9 pr-8 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black"><X className="h-4 w-4" /></button>}
      </div>

      {view === "hierarchy" && !search ? (
        <div className="bg-gray-950 rounded-2xl p-4 max-h-[55vh] overflow-y-auto">
          <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
            <Building2 className="h-3 w-3" /> Click any role to select it as your work station
          </div>
          <OrgHierarchyTree onSelectRole={handleOrgRoleSelect} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto pr-1">
          {(search ? filtered : ALL_ROLES).map(r => (
            <button key={r.role} onClick={() => onSelect(r)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-black/10 hover:border-black/30 hover:shadow-sm transition-all text-left group">
              <div className={`h-9 w-9 rounded-lg ${r.color} grid place-items-center flex-shrink-0`}>
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-black truncate">{r.label}</div>
                <div className="text-[11px] text-black/40 truncate">{r.desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-black/20 group-hover:text-black transition-colors flex-shrink-0" />
            </button>
          ))}
          {search && filtered.length === 0 && (
            <div className="col-span-2 py-8 text-center text-sm text-black/40">No roles match "{search}"</div>
          )}
        </div>
      )}
      <div className="mt-3 text-xs text-black/30 text-center">{ALL_ROLES.length} roles available · 14 departments</div>
    </div>
  );
}

/* ─── Entry Choice ───────────────────────────────────────────────────────── */
function EntryChoice({ onPublic, onStaff }: { onPublic: () => void; onStaff: () => void }) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <LogoIcon className="h-10 w-10 text-black" />
        </div>
        <h1 className="text-2xl font-semibold text-black" style={{ letterSpacing: "-0.02em" }}>Welcome to APPIIOMS</h1>
        <p className="text-sm text-black/50 mt-1">AI-Powered Enterprise Operations & Intelligence Management System</p>
      </div>
      <div className="space-y-3">
        <button onClick={onPublic}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-colors text-left group">
          <div className="h-12 w-12 rounded-xl bg-white/20 grid place-items-center flex-shrink-0">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-white">Company / Supplier Portal</div>
            <div className="text-sm text-blue-200">Browse tenders · Bid · Submit applications</div>
            <div className="text-xs text-blue-300 mt-1">Sign in with Gmail or company email</div>
          </div>
          <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white flex-shrink-0" />
        </button>
        <button onClick={onStaff}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-black hover:bg-gray-900 transition-colors text-left group">
          <div className="h-12 w-12 rounded-xl bg-white/10 grid place-items-center flex-shrink-0">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-white">Government Staff Portal</div>
            <div className="text-sm text-white/60">Full management system access</div>
            <div className="text-xs text-white/40 mt-1">44 roles · 14 departments · All workstations</div>
          </div>
          <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-white flex-shrink-0" />
        </button>
      </div>
      <div className="mt-8 text-center">
        <Link to="/" className="text-sm text-black/40 hover:text-black transition-colors">← Back to home</Link>
      </div>
    </div>
  );
}

/* ─── Main SignInPage ─────────────────────────────────────────────────────── */
type Screen = "choice" | "public" | "staff-roles" | "staff-form";

export default function SignInPage() {
  const [screen, setScreen] = useState<Screen>("choice");
  const [selectedRole, setSelectedRole] = useState<typeof ALL_ROLES[number] | null>(null);

  return (
    <div className="min-h-screen flex bg-[#F5F5F5]">
      {/* Left dark panel — desktop only */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-[42%] flex-col justify-between p-10" style={{ background: "#0f0f0f" }}>
        <Link to="/" className="flex items-center gap-2.5">
          <LogoIcon className="w-7 h-7 text-white" />
          <span className="text-lg font-semibold tracking-tight text-white">APPIIOMS</span>
        </Link>

        <div>
          <h2 className="text-3xl font-semibold text-white mb-3" style={{ letterSpacing: "-0.03em" }}>
            Integrity.<br />Public Trust.<br />Smart Government.
          </h2>
          <p className="text-white/45 text-sm mb-5">
            AI-Powered Enterprise Operations & Intelligence Management System — Government Platform.
          </p>

          {/* Org Hierarchy Panel */}
          <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "#1a1a1a" }}>
            <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white/80">Organisational Structure</div>
                <div className="text-[10px] text-white/35 mt-0.5">14 Departments · Work Station Roles</div>
              </div>
              <div className="flex gap-1.5 items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-white/35">Live</span>
              </div>
            </div>
            <div className="p-3 max-h-[300px] overflow-y-auto scrollbar-none">
              <OrgHierarchyTree />
            </div>
            <div className="px-4 py-2.5 border-t border-white/8 grid grid-cols-3 gap-2">
              {[
                { label: "Departments",   val: "14",  color: "text-blue-400"    },
                { label: "Work Stations", val: "150+",color: "text-emerald-400" },
                { label: "Roles",         val: "44",  color: "text-violet-400"  },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className={`text-base font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-[10px] text-white/30">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-white/8">
            <div className="text-[10px] text-white/35 mb-2 uppercase tracking-wider font-semibold">Platform Access</div>
            {[
              { icon: Building2, label: "Companies & Suppliers", desc: "Tender portal — browse, bid, track", color: "bg-blue-600" },
              { icon: Shield,    label: "Government Staff",       desc: "Full management system — 44 roles", color: "bg-slate-700" },
            ].map(a => (
              <div key={a.label} className="flex items-center gap-2.5 mb-2 last:mb-0">
                <div className={`h-7 w-7 rounded-lg ${a.color} grid place-items-center flex-shrink-0`}><a.icon className="h-3.5 w-3.5 text-white" /></div>
                <div><div className="text-xs text-white/80 font-medium">{a.label}</div><div className="text-[10px] text-white/35">{a.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-white/20">© 2026 APPIIOMS · Government Enterprise Platform</div>
      </div>

      {/* Right content */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        {screen === "choice" && <EntryChoice onPublic={() => setScreen("public")} onStaff={() => setScreen("staff-roles")} />}
        {screen === "public" && <PublicLogin onBack={() => setScreen("choice")} />}
        {screen === "staff-roles" && (
          <StaffRolePicker
            onSelect={r => { setSelectedRole(r); setScreen("staff-form"); }}
            onBack={() => setScreen("choice")}
          />
        )}
        {screen === "staff-form" && selectedRole && (
          <StaffLoginForm role={selectedRole} onBack={() => setScreen("staff-roles")} />
        )}
      </div>
    </div>
  );
}
