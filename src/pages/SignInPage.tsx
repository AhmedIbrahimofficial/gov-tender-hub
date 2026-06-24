import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, ALL_ROLES, type UserRole } from "@/lib/auth-context";
import { Eye, EyeOff, ArrowRight, Shield, Building2, ChevronLeft, X, Phone, User, Mail, Lock, Briefcase, Landmark, GitBranch, ChevronRight, Building } from "lucide-react";
import { seedIfEmpty } from "@/lib/local-store";

function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
    </svg>
  );
}

/* ─── Organisation Hierarchy Display ────────────────────────────────────── */
const ORG_HIERARCHY = [
  {
    id: "m1", label: "Ministry of Finance & IP", code: "MOF", color: "bg-blue-600",
    children: [
      { id: "d1", label: "Budget & Finance Dept", type: "dept", branches: ["Bulawayo Regional Office", "Mutare Office"] },
      { id: "s1", label: "ZIMRA", type: "soe",  branches: ["Masvingo Branch", "Beitbridge Branch"] },
    ],
  },
  {
    id: "m2", label: "Ministry of Health & CC", code: "MOH", color: "bg-emerald-600",
    children: [
      { id: "d2", label: "Procurement & Supply Dept", type: "dept", branches: ["Masvingo Store", "Bulawayo Store"] },
    ],
  },
  {
    id: "m3", label: "Ministry of Transport", code: "MOT", color: "bg-violet-600",
    children: [
      { id: "d3", label: "Roads & Bridges Dept", type: "dept", branches: ["Beitbridge Site"] },
      { id: "s2", label: "ZINARA", type: "soe", branches: ["Harare Weigh Station"] },
    ],
  },
];

function OrgHierarchyTree() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["m1"]));
  const toggle = (id: string) => setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-2">
      {ORG_HIERARCHY.map(ministry => (
        <div key={ministry.id}>
          {/* Level 1 — Ministry */}
          <button onClick={() => toggle(ministry.id)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/8 transition-colors group text-left">
            <div className={`h-7 w-7 rounded-lg ${ministry.color} grid place-items-center flex-shrink-0`}>
              <Landmark className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white/90 truncate">{ministry.label}</div>
              <div className="text-[10px] text-white/40">{ministry.code} · Ministry</div>
            </div>
            <ChevronRight className={`h-3.5 w-3.5 text-white/30 transition-transform flex-shrink-0 ${expanded.has(ministry.id) ? "rotate-90" : ""}`} />
          </button>

          {/* Level 2 — Departments & SOEs */}
          {expanded.has(ministry.id) && (
            <div className="ml-4 pl-3 border-l border-white/10 space-y-1 mb-1">
              {ministry.children.map(child => (
                <div key={child.id}>
                  <button onClick={() => toggle(child.id)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/8 transition-colors text-left">
                    <div className={`h-5 w-5 rounded-md grid place-items-center flex-shrink-0 ${child.type === "dept" ? "bg-emerald-600/40" : "bg-amber-600/40"}`}>
                      {child.type === "dept" ? <Building2 className="h-3 w-3 text-white/80" /> : <Building className="h-3 w-3 text-white/80" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-white/80 truncate">{child.label}</div>
                      <div className="text-[10px] text-white/35">{child.type === "dept" ? "Department" : "State Entity"}</div>
                    </div>
                    <ChevronRight className={`h-3 w-3 text-white/20 transition-transform flex-shrink-0 ${expanded.has(child.id) ? "rotate-90" : ""}`} />
                  </button>

                  {/* Level 3 — Branches */}
                  {expanded.has(child.id) && (
                    <div className="ml-3 pl-2.5 border-l border-white/8 space-y-0.5 mb-1">
                      {child.branches.map(branch => (
                        <div key={branch} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5 transition-colors">
                          <GitBranch className="h-3 w-3 text-white/25 flex-shrink-0" />
                          <span className="text-[10px] text-white/50 truncate">{branch}</span>
                          <span className="text-[9px] text-white/20 flex-shrink-0">Branch</span>
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
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    if (mode === "register") {
      if (!form.name || !form.company) { setError("Name and company are required."); return; }
      if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    }
    setLoading(true);
    setTimeout(() => {
      const name = form.name || form.email.split("@")[0];
      const company = form.company || "Company";
      loginPublic(form.email, name, company);
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

      {/* Toggle */}
      <div className="flex rounded-xl bg-black/5 p-1 mb-6">
        {(["login", "register"] as const).map((m) => (
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
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="John Banda"
                  className="w-full h-11 pl-9 pr-4 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Company / Organisation *</label>
              <div className="relative mt-1.5">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                <input value={form.company} onChange={e => set("company", e.target.value)} placeholder="Highveld Engineering (Pvt) Ltd"
                  className="w-full h-11 pl-9 pr-4 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
            </div>
          </>
        )}
        <div>
          <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Email / Gmail *</label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@company.com"
              className="w-full h-11 pl-9 pr-4 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Password *</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input type={showPwd ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••"
              className="w-full h-11 pl-9 pr-11 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {mode === "register" && (
          <div>
            <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Confirm Password *</label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <input type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)} placeholder="••••••••"
                className="w-full h-11 pl-9 pr-4 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
            </div>
          </div>
        )}
        {error && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}
        <button type="submit" disabled={loading}
          className="w-full h-11 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
          {loading ? "Please wait…" : mode === "login" ? <><Shield className="h-4 w-4" /> Sign In to Portal</> : <><ArrowRight className="h-4 w-4" /> Create Account & Enter</>}
        </button>
      </form>
      <p className="text-xs text-black/40 text-center mt-4">
        Any email + password works in this demo. You'll see published tenders only.
      </p>
    </div>
  );
}

/* ─── Staff Role Detail Form ─────────────────────────────────────────────── */
function StaffLoginForm({ role, onBack }: { role: typeof ALL_ROLES[number]; onBack: () => void }) {
  const { loginWithDetails } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", department: "", entity: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Name, email and password are required."); return; }
    setLoading(true);
    setTimeout(() => {
      loginWithDetails({
        role: role.role,
        name: form.name,
        email: form.email,
        phone: form.phone,
        department: form.department || role.label,
        entity: form.entity || "Government of Zimbabwe",
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
            <div className="relative mt-1.5">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="T. Moyo"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Phone</label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+263 77 000 0000"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Work Email *</label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="name@gov.zw"
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Department</label>
            <div className="relative mt-1.5">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <input value={form.department} onChange={e => set("department", e.target.value)} placeholder="Procurement"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Entity / Ministry</label>
            <div className="relative mt-1.5">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <input value={form.entity} onChange={e => set("entity", e.target.value)} placeholder="PRAZ"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Password *</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
            <input type={showPwd ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••"
              className="w-full h-10 pl-9 pr-11 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {error && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}

        {/* Org hierarchy breadcrumb */}
        <div className="rounded-xl border border-black/8 bg-[#fafafa] px-3 py-2.5">
          <div className="text-[10px] text-black/40 uppercase tracking-wider font-semibold mb-2">Organisation Hierarchy</div>
          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
            <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-medium">
              <Landmark className="h-3 w-3" /> Ministry
            </div>
            <ChevronRight className="h-3 w-3 text-black/25" />
            <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-medium">
              <Building2 className="h-3 w-3" /> Department
            </div>
            <span className="text-black/25 text-[10px]">or</span>
            <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-medium">
              <Building className="h-3 w-3" /> State Entity
            </div>
            <ChevronRight className="h-3 w-3 text-black/25" />
            <div className="flex items-center gap-1 bg-violet-100 text-violet-700 px-2 py-0.5 rounded-md font-medium">
              <GitBranch className="h-3 w-3" /> Branch
            </div>
          </div>
          <p className="text-[10px] text-black/35 mt-1.5">Enter the Ministry or Entity you belong to above. Your account will be mapped to that org node.</p>
        </div>

        <button type="submit" disabled={loading}
          className={`w-full h-11 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-1 ${role.color} hover:opacity-90`}>
          {loading ? "Signing in…" : <><Shield className="h-4 w-4" /> Enter as {role.label}</>}
        </button>
      </form>
    </div>
  );
}

/* ─── Staff Role Picker (42 roles grid) ──────────────────────────────────── */
function StaffRolePicker({ onSelect, onBack }: { onSelect: (r: typeof ALL_ROLES[number]) => void; onBack: () => void }) {
  const [search, setSearch] = useState("");
  const filtered = ALL_ROLES.filter(r =>
    r.label.toLowerCase().includes(search.toLowerCase()) ||
    r.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black mb-5 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-black mb-1">Select Your Role</h2>
        <p className="text-sm text-black/50">Choose your government role to access the appropriate dashboard</p>
      </div>
      <div className="relative mb-4">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles…"
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black"><X className="h-4 w-4" /></button>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto pr-1">
        {filtered.map((r) => (
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
        {filtered.length === 0 && (
          <div className="col-span-2 py-8 text-center text-sm text-black/40">No roles match "{search}"</div>
        )}
      </div>
      <div className="mt-3 text-xs text-black/30 text-center">{ALL_ROLES.length} roles available</div>
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
        <p className="text-sm text-black/50 mt-1">AI-Powered Electronic Public Procurement and Oversight Intelligence System</p>
      </div>

      <div className="space-y-3">
        {/* Company/Supplier */}
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
          <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
        </button>

        {/* Government Staff */}
        <button onClick={onStaff}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-black hover:bg-gray-900 transition-colors text-left group">
          <div className="h-12 w-12 rounded-xl bg-white/10 grid place-items-center flex-shrink-0">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-white">Government Staff Portal</div>
            <div className="text-sm text-white/60">Full management system access</div>
            <div className="text-xs text-white/40 mt-1">44 roles · PS · CPO · Directors · Officers · Auditors</div>
          </div>
          <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-white transition-colors flex-shrink-0" />
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
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12" style={{ background: "#111" }}>
        <Link to="/" className="flex items-center gap-2.5">
          <LogoIcon className="w-8 h-8 text-white" />
          <span className="text-xl font-medium tracking-tight text-white">APPIIOMS</span>
        </Link>
        <div>
          <h2 className="text-3xl font-medium text-white mb-3" style={{ letterSpacing: "-0.03em" }}>
            Integrity.<br />Public Trust.<br />Clean Procurement.
          </h2>
          <p className="text-white/50 text-sm mb-6">
            AI-Powered Electronic Public Procurement and Oversight Intelligence System — Government of Zimbabwe.
          </p>

          {/* Org Hierarchy */}
          <div className="rounded-2xl overflow-hidden mb-5" style={{ background: "#1a1a1a" }}>
            <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white/80">Organisation Hierarchy</div>
                <div className="text-[10px] text-white/35 mt-0.5">Ministry → Department / State Entity → Branch</div>
              </div>
              <div className="flex gap-1.5 items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-white/35">Live</span>
              </div>
            </div>
            <div className="p-3 max-h-[260px] overflow-y-auto scrollbar-none">
              <OrgHierarchyTree />
            </div>
            <div className="px-4 py-2.5 border-t border-white/8 grid grid-cols-3 gap-2">
              {[
                { label: "Ministries", val: "3", color: "text-blue-400" },
                { label: "Depts & SOEs", val: "5", color: "text-emerald-400" },
                { label: "Branches", val: "8", color: "text-violet-400" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className={`text-base font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-[10px] text-white/30">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Access types */}
          <div className="p-4 rounded-xl border border-white/10">
            <div className="text-[10px] text-white/40 mb-2.5 uppercase tracking-wider font-semibold">Platform Access</div>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="h-7 w-7 rounded-lg bg-blue-600 grid place-items-center flex-shrink-0"><Building2 className="h-3.5 w-3.5 text-white" /></div>
              <div>
                <div className="text-xs text-white/80 font-medium">Companies & Suppliers</div>
                <div className="text-[10px] text-white/40">Tender portal — browse, bid, track</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-white/10 grid place-items-center flex-shrink-0"><Shield className="h-3.5 w-3.5 text-white" /></div>
              <div>
                <div className="text-xs text-white/80 font-medium">Government Staff</div>
                <div className="text-[10px] text-white/40">44 roles — PS, CPO, Directors, Officers, Auditors</div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-white/20">© 2026 APPIIOMS · PRAZ · Government of Zimbabwe</div>
      </div>

      {/* Right content */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        {screen === "choice" && (
          <EntryChoice onPublic={() => setScreen("public")} onStaff={() => setScreen("staff-roles")} />
        )}
        {screen === "public" && (
          <PublicLogin onBack={() => setScreen("choice")} />
        )}
        {screen === "staff-roles" && (
          <StaffRolePicker
            onSelect={(r) => { setSelectedRole(r); setScreen("staff-form"); }}
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
