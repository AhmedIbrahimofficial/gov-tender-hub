import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { seedIfEmpty } from "@/lib/local-store";

function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
    </svg>
  );
}

const ROLE_OPTIONS: { role: UserRole; label: string; desc: string }[] = [
  { role: "cpo",                label: "Chief Procurement Officer", desc: "Full platform · AI advisor" },
  { role: "procurement_officer",label: "Procurement Officer",       desc: "Tenders · RFQs · Lifecycle" },
  { role: "evaluator",          label: "Evaluation Officer",        desc: "Bid scoring workbench" },
  { role: "finance_officer",    label: "Finance Officer",           desc: "Invoices · Payments" },
  { role: "auditor",            label: "Auditor",                   desc: "Audit trails · Compliance" },
  { role: "minister",           label: "Minister / Executive",      desc: "Strategic dashboards" },
  { role: "supplier",           label: "Supplier / Vendor",        desc: "Bids · Contracts · Invoices" },
];

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginAs } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) {
        seedIfEmpty(email);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Use a demo role below.");
      }
      setLoading(false);
    }, 500);
  };

  const handleDemo = (role: UserRole) => {
    loginAs(role);
    seedIfEmpty(role);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-[#F5F5F5]">
      {/* Left dark panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ background: "#111" }}>
        <Link to="/" className="flex items-center gap-2.5">
          <LogoIcon className="w-8 h-8 text-white" />
          <span className="text-xl font-medium tracking-tight text-white">APPIIOMS</span>
        </Link>

        <div>
          <h2 className="text-4xl font-medium text-white mb-4" style={{ letterSpacing: "-0.03em" }}>
            Transparent.<br />Fast. Intelligent.
          </h2>
          <p className="text-white/50 text-lg mb-10">
            AI-Powered Public Procurement Integrity & Intelligence Oversight Management System.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Tender Management",  val: "25 phases" },
              { label: "RFQ Automation",     val: "18 stages" },
              { label: "RFP & EOI",          val: "25 stages" },
              { label: "Live Auctions",      val: "19 stages" },
              { label: "AI Agents",          val: "8 active" },
              { label: "Compliance",         val: "94.2%" },
            ].map((f) => (
              <div key={f.label} className="rounded-xl p-4" style={{ background: "#1f1f1f" }}>
                <div className="text-xs text-white/40 mb-1">{f.label}</div>
                <div className="text-lg font-medium text-white">{f.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-white/20">© 2026 APPIIOMS · PRAZ · Government of Zimbabwe</div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <LogoIcon className="w-7 h-7 text-black" />
            <span className="text-xl font-medium tracking-tight text-black">APPIIOMS</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-medium text-black" style={{ letterSpacing: "-0.02em" }}>Sign in</h1>
            <p className="text-sm text-black/50 mt-1">Access your procurement portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@gov.zw"
                className="mt-1.5 w-full h-11 px-4 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-shadow" />
            </div>
            <div>
              <label className="text-xs font-medium text-black/50 uppercase tracking-wider">Password</label>
              <div className="relative mt-1.5">
                <input type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? "Signing in…" : <><Shield className="h-4 w-4" /> Sign In</>}
            </button>
          </form>

          {/* Demo roles */}
          <div className="border-t border-black/10 pt-6">
            <p className="text-xs font-medium text-black/40 uppercase tracking-wider mb-3">Quick demo — select role</p>
            <div className="space-y-2">
              {ROLE_OPTIONS.map((r) => (
                <button key={r.role} onClick={() => handleDemo(r.role)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-black/10 hover:border-black/30 hover:bg-gray-50 transition-all group">
                  <div className="text-left">
                    <div className="text-sm font-medium text-black">{r.label}</div>
                    <div className="text-xs text-black/40">{r.desc}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-black/20 group-hover:text-black transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-black/40 hover:text-black transition-colors">← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
