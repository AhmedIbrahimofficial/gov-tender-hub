import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, ALL_ROLES } from "@/lib/auth-context";
import { ZW_MINISTRIES } from "@/lib/zw-ministries";
import {
  Eye, EyeOff, ArrowRight, Shield, Building2, ChevronLeft, X,
  Phone, User, Mail, Lock, Briefcase, Landmark, Search, Users,
  ChevronDown, ChevronRight, Crown, Star,
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
      {/* Prime Minister node */}
      <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-amber-500/15 border border-amber-500/20 mb-2">
        <span className="h-5 w-5 rounded-md bg-amber-500 grid place-items-center flex-shrink-0">
          <Crown className="h-2.5 w-2.5 text-white" />
        </span>
        <span className="text-[11px] font-semibold text-amber-300">Prime Minister</span>
        <span className="ml-auto text-[9px] text-amber-400/60">Head of Government</span>
      </div>

      {ZW_MINISTRIES.slice(0, 8).map(ministry => (
        <div key={ministry.id}>
          <button
            onClick={() => setOpenMin(openMin === ministry.id ? null : ministry.id)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/8 transition-colors text-left"
          >
            <span className="h-4 w-4 rounded bg-blue-500/70 grid place-items-center flex-shrink-0">
              <Landmark className="h-2 w-2 text-white" />
            </span>
            <span className="flex-1 text-[10px] font-medium text-white/75 truncate">{ministry.name.replace("Ministry of ", "")}</span>
            <span className="text-[8px] text-white/30 mr-1 flex-shrink-0">{ministry.code}</span>
            <ChevronRight className={`h-2.5 w-2.5 text-white/25 flex-shrink-0 transition-transform ${openMin === ministry.id ? "rotate-90" : ""}`} />
          </button>
          {openMin === ministry.id && (
            <div className="ml-4 pl-2 border-l border-white/10 space-y-0.5 mb-1">
              {ministry.departments.map(dept => (
                <div key={dept.id}>
                  <button
                    onClick={() => setOpenDept(openDept === dept.id ? null : dept.id)}
                    className="w-full flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/6 transition-colors text-left"
                  >
                    <span className="h-3.5 w-3.5 rounded bg-emerald-500/60 grid place-items-center flex-shrink-0">
                      <Building2 className="h-2 w-2 text-white" />
                    </span>
                    <span className="text-[9.5px] text-white/55 truncate flex-1">{dept.name}</span>
                    <ChevronRight className={`h-2 w-2 text-white/20 flex-shrink-0 transition-transform ${openDept === dept.id ? "rotate-90" : ""}`} />
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

      {/* PM node */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 mb-2">
        <Crown className="h-4 w-4 text-amber-500 flex-shrink-0" />
        <span className="text-xs font-semibold text-amber-700">Prime Minister — Head of Government</span>
      </div>

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
                        {dept.roles.map(role => (
                          <button
                            key={role.title}
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
          <div className="text-lg font-semibold text-black">Company / Supplier Portal</div>
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
function GovStaffForm({ onBack }: { onBack: () => void }) {
  const { loginWithDetails } = useAuth();
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

  const resolveRole = (roleTitle: string) => {
    const lower = roleTitle.toLowerCase();
    let match = ALL_ROLES.find(r => r.label.toLowerCase() === lower);
    if (!match) {
      const keyword = lower.split(",")[0].split(" ").filter(w => w.length > 4)[0];
      if (keyword) match = ALL_ROLES.find(r => r.label.toLowerCase().includes(keyword));
    }
    return match ?? ALL_ROLES[4];
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    if (mode === "register") {
      if (!form.name) { setError("Full name is required."); return; }
      if (!form.phone) { setError("Phone number is required."); return; }
      if (!hier.ministryId || !hier.departmentId || !hier.roleTitle) { setError("Please select your ministry, department and role."); return; }
      if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    }
    setLoading(true);
    const resolvedRole = hier.roleTitle ? resolveRole(hier.roleTitle) : ALL_ROLES[4];
    setTimeout(() => {
      loginWithDetails({
        role: resolvedRole.role,
        name: form.name || form.email.split("@")[0],
        email: form.email,
        phone: form.phone,
        department: selectedDept?.name ?? hier.roleTitle ?? resolvedRole.label,
        entity: selectedMinistry?.name ?? "Government of Zimbabwe",
      });
      seedIfEmpty(form.email);
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

        {mode === "register" && (
          <div>
            <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Ministry / Department / Role *</label>
            <button type="button" onClick={() => setShowHierarchy(!showHierarchy)}
              className="w-full mt-1 h-10 px-3 rounded-xl border border-black/10 text-sm text-left flex items-center gap-2 hover:border-black/25 transition-colors bg-white">
              {hier.roleTitle ? (
                <div className="flex-1 min-w-0">
                  <span className="block text-xs text-black truncate">{hier.roleTitle}</span>
                  <span className="block text-[10px] text-black/40 truncate">
                    {selectedMinistry?.name} · {selectedDept?.name}
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
        )}

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

        {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full h-10 rounded-xl bg-gray-950 text-white text-sm font-semibold hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? "Please wait…" : <><Shield className="h-4 w-4" /> {mode === "login" ? "Sign In" : "Create Account"}</>}
        </button>
      </form>
    </div>
  );
}

// ─── Entry Choice ─────────────────────────────────────────────────────────────
function EntryChoice({ onPublic, onStaff }: { onPublic: () => void; onStaff: () => void }) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <LogoIcon className="h-10 w-10 text-black" />
        </div>
        <h1 className="text-2xl font-bold text-black" style={{ letterSpacing: "-0.02em" }}>
          AI Powered Electronic Public Procurement and Oversight Intelligence System
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
            <div className="text-base font-semibold text-white">Company / Supplier Portal</div>
            <div className="text-sm text-blue-200">Browse tenders · Bid · Submit applications</div>
            <div className="text-xs text-blue-300 mt-0.5">Sign in or register with company details</div>
          </div>
          <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white flex-shrink-0" />
        </button>

        <button onClick={onStaff}
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
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="text-sm text-black/40 hover:text-black transition-colors">← Back to home</Link>
      </div>
    </div>
  );
}

// ─── Main SignInPage ───────────────────────────────────────────────────────────
type Screen = "choice" | "public" | "staff";

export default function SignInPage() {
  const [screen, setScreen] = useState<Screen>("choice");

  return (
    <div className="min-h-screen flex bg-[#F5F5F5]">

      {/* ── Left dark panel (desktop only) ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] flex-col bg-gray-950 border-r border-white/5">
        {/* Logo */}
        <div className="px-8 py-6 border-b border-white/8 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoIcon className="w-7 h-7 text-white flex-shrink-0" />
            <div className="leading-none">
              <div className="text-[9px] font-bold text-white tracking-tight leading-tight uppercase">AI Powered Electronic Public</div>
              <div className="text-[9px] font-bold text-white tracking-tight leading-tight uppercase">Procurement &amp; Oversight</div>
              <div className="text-[9px] font-bold text-white/60 tracking-tight leading-tight uppercase">Intelligence System</div>
            </div>
          </Link>
        </div>

        {/* Tag line */}
        <div className="px-8 py-6 flex-shrink-0 border-b border-white/8">
          <h2 className="text-2xl font-semibold text-white leading-tight mb-2" style={{ letterSpacing: "-0.025em" }}>
            Integrity.<br />Public Trust.<br />Transparency.<br />Good Governance.<br />Clean Procurement.
          </h2>
          <p className="text-sm text-white/45 leading-relaxed">
            AI Powered Electronic Public Procurement and Oversight Intelligence System — Government of Zimbabwe.
          </p>
        </div>

        {/* Government hierarchy panel */}
        <div className="flex-1 px-4 py-4 overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3 px-2 flex-shrink-0">
            <div>
              <div className="text-xs font-semibold text-white/70">Government Hierarchy</div>
              <div className="text-[10px] text-white/30 mt-0.5">
                Prime Minister · {ZW_MINISTRIES.length} Ministries · Departments · Roles
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
            { label: "Roles", val: String(ALL_ROLES.length), color: "text-violet-400" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`text-base font-bold ${s.color}`}>{s.val}</div>
              <div className="text-[9px] text-white/30 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-white/8 flex-shrink-0">
          <p className="text-[10px] text-white/20">© 2026 AI Powered Electronic Public Procurement and Oversight Intelligence System · Government of Zimbabwe</p>
        </div>
      </div>

      {/* ── Right content panel ───────────────────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center p-6 lg:p-12 overflow-y-auto">
        {screen === "choice" && (
          <EntryChoice onPublic={() => setScreen("public")} onStaff={() => setScreen("staff")} />
        )}
        {screen === "public" && (
          <PublicLogin onBack={() => setScreen("choice")} />
        )}
        {screen === "staff" && (
          <GovStaffForm onBack={() => setScreen("choice")} />
        )}
      </div>
    </div>
  );
}
