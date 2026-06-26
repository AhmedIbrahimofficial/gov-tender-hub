import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home, Mail, Map, Search, FileText, MapPin, Building2, Tag,
  Archive, CheckCircle2, XCircle, Download, ListChecks,
  LogIn, UserPlus, KeyRound, UserSearch, HelpCircle, BookOpen, Info,
  Bell, ShieldCheck, Globe2, ChevronRight, Calendar, Phone,
} from "lucide-react";

/* ── Full system name ─────────────────────────────────────────────────────── */
const SYSTEM_SHORT = "APPOIS";
const SYSTEM_FULL  = "AI-Powered Public Procurement & Oversight Intelligence System";
const SYSTEM_SUB   = "Integrity · Public Trust · Transparency · Good Governance · Clean Procurement";

/* ───────────────────────── Logo ───────────────────────── */
function CoatOfArms({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-white border-2 border-white shadow ${className}`}>
      <ShieldCheck className="w-8 h-8 text-primary" />
    </div>
  );
}

/* ─────────────────────── Top bar ─────────────────────── */
function TopBar() {
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const navigate = useNavigate();
  return (
    <div className="bg-primary text-white text-xs">
      <div className="max-w-[1280px] mx-auto px-4 py-1.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{today}</span>
          <span className="hidden md:flex items-center gap-1.5"><Phone className="w-3 h-3" />Help Desk: +263 242 700 000</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth" })}
            className="hover:underline">Skip to main content</button>
          <span className="hover:underline cursor-default">Screen Reader</span>
          <div className="flex items-center gap-1">
            <button onClick={() => document.documentElement.style.fontSize = "13px"} className="hover:underline px-0.5">A-</button>
            <button onClick={() => document.documentElement.style.fontSize = "16px"} className="hover:underline px-0.5">A</button>
            <button onClick={() => document.documentElement.style.fontSize = "19px"} className="hover:underline px-0.5">A+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Header ─────────────────────── */
function Header() {
  const navigate = useNavigate();

  const navLinks = [
    { label: "Search",                  icon: Search,       to: "/portal"          },
    { label: "Active Tenders",          icon: FileText,     to: "/portal"          },
    { label: "Tenders by Closing Date", icon: Calendar,     to: "/portal"          },
    { label: "Corrigendum",             icon: Bell,         to: "/portal"          },
    { label: "Bid Awards",              icon: CheckCircle2, to: "/portal"          },
    { label: "APPOIS Home",             icon: Home,         to: "/"                },
  ];

  return (
    <header className="bg-primary text-white">
      <div className="max-w-[1280px] mx-auto px-4 py-4 flex items-center gap-4">
        <CoatOfArms className="w-14 h-14" />
        <div className="flex-1">
          <div className="text-xl md:text-2xl font-bold leading-tight">
            {SYSTEM_SHORT} — Central Public Procurement Portal
          </div>
          <div className="text-sm text-white/85 mt-0.5">
            {SYSTEM_FULL}
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-white/10 border border-white/20">Integrity</span>
          <span className="px-2 py-1 rounded bg-white/10 border border-white/20">Transparency</span>
          <span className="px-2 py-1 rounded bg-white/10 border border-white/20">Public Trust</span>
        </div>
      </div>

      {/* Secondary nav */}
      <div className="bg-primary/90 border-t border-white/15">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-0 text-sm">
            {navLinks.map((l) => (
              <Link key={l.label} to={l.to}
                className="flex items-center gap-1.5 px-3 py-2.5 hover:bg-white/10 border-r border-white/15 last:border-r-0 whitespace-nowrap">
                <l.icon className="w-3.5 h-3.5" />{l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-0 text-sm">
            <Link to="/" className="flex items-center gap-1.5 px-3 py-2.5 hover:bg-white/10 border-r border-white/15">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <a href="mailto:support@appois.gov.zw"
              className="flex items-center gap-1.5 px-3 py-2.5 hover:bg-white/10 border-r border-white/15">
              <Mail className="w-3.5 h-3.5" /> Contact Us
            </a>
            <Link to="/portal"
              className="flex items-center gap-1.5 px-3 py-2.5 hover:bg-white/10">
              <Map className="w-3.5 h-3.5" /> Site Map
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white text-primary border-t border-primary/10">
        <div className="max-w-[1280px] mx-auto px-4 py-2 text-sm font-semibold">
          {SYSTEM_FULL} ({SYSTEM_SHORT})
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────── Left rail button ─────────────────────── */
function RailButton({ icon: Icon, label, to }: { icon: any; label: string; to: string }) {
  return (
    <Link to={to}
      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-primary bg-white border border-primary/30 rounded hover:bg-primary hover:text-white transition-colors shadow-sm">
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
    </Link>
  );
}

/* ─────────────────────── Right column login card ─────────────────────── */
function LoginCard() {
  return (
    <div className="border border-primary/30 rounded bg-white">
      <div className="bg-primary text-white text-sm font-semibold px-3 py-2 rounded-t">
        Bidder / Officer Access
      </div>
      <div className="p-4 space-y-2">
        <Link
          to="/signin"
          className="block w-full text-center bg-primary text-white font-semibold py-3 rounded shadow hover:bg-primary/90 transition-colors ring-4 ring-primary/15"
        >
          <span className="inline-flex items-center gap-2"><LogIn className="w-4 h-4" /> Click here to Login</span>
        </Link>
        <Link to="/signin" className="flex items-center gap-2 text-sm text-primary hover:underline py-1.5">
          <UserPlus className="w-4 h-4" /> Online Bidder Enrolment
        </Link>
        <Link to="/signin" className="flex items-center gap-2 text-sm text-primary hover:underline py-1.5">
          <KeyRound className="w-4 h-4" /> Generate / Forgot Password?
        </Link>
        <Link to="/portal" className="flex items-center gap-2 text-sm text-primary hover:underline py-1.5">
          <UserSearch className="w-4 h-4" /> Find My Nodal Officer
        </Link>
      </div>
    </div>
  );
}

function SearchCard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) navigate(`/portal?q=${encodeURIComponent(query.trim())}`);
    else navigate("/portal");
  };

  return (
    <div className="border border-primary/30 rounded bg-white">
      <div className="bg-primary text-white text-xs font-semibold px-3 py-2 rounded-t flex items-center gap-2">
        <Search className="w-3.5 h-3.5" /> Search with ID / Title / Reference No
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
          <Search className="w-4 h-4" /> Tender Search
        </div>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Title / Ref No…"
            className="flex-1 h-9 px-2 text-sm border border-primary/30 rounded focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button onClick={handleSearch}
            className="px-4 h-9 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90">
            Go
          </button>
        </div>
        <Link to="/portal" className="text-xs text-primary hover:underline mt-2 inline-block">
          Advanced Search
        </Link>
      </div>
    </div>
  );
}

function HelpCard() {
  const items = [
    { icon: HelpCircle, label: "Help For Contractors",                       to: "/portal" },
    { icon: BookOpen,   label: "Guidelines for Hassle-Free Bid Submission",  to: "/portal" },
    { icon: Info,       label: "Information About DSC",                      to: "/portal" },
  ];
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <Link key={it.label} to={it.to}
          className="flex items-center gap-2 px-3 py-2.5 bg-white border border-primary/30 rounded text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors">
          <it.icon className="w-4 h-4 flex-shrink-0" /> {it.label}
        </Link>
      ))}
    </div>
  );
}

/* ─────────────────────── Tender table block ─────────────────────── */
function TenderTable({ title, rows }: { title: string; rows: { t: string; ref: string; close: string; open: string }[] }) {
  const navigate = useNavigate();
  return (
    <div className="border border-primary/30 rounded bg-white">
      <div className="bg-primary/10 text-primary font-semibold text-sm px-3 py-2 border-b border-primary/20 flex items-center gap-2">
        📁 {title}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-[55%]" />
            <col className="w-[20%]" />
            <col className="w-[12.5%]" />
            <col className="w-[12.5%]" />
          </colgroup>
          <thead className="bg-primary/5 text-primary text-left">
            <tr>
              <th className="px-3 py-2 font-semibold">Title</th>
              <th className="px-3 py-2 font-semibold">Reference No</th>
              <th className="px-3 py-2 font-semibold whitespace-nowrap">Closing</th>
              <th className="px-3 py-2 font-semibold whitespace-nowrap">Bid Opening</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {rows.map((r, i) => {
              const to = `/public/tenders/${encodeURIComponent(r.ref)}`;
              return (
                <tr key={i} className="hover:bg-primary/5 cursor-pointer align-top" onClick={() => navigate(to)}>
                  <td className="px-3 py-2.5 text-foreground">
                    <span className="text-primary font-medium mr-1">{i + 1}.</span>
                    <button onClick={e => { e.stopPropagation(); navigate(to); }}
                      className="text-primary hover:underline text-left">{r.t}</button>
                  </td>
                  <td className="px-3 py-2.5 text-foreground/80 truncate">{r.ref}</td>
                  <td className="px-3 py-2.5 text-foreground/80 whitespace-nowrap">{r.close}</td>
                  <td className="px-3 py-2.5 text-foreground/80 whitespace-nowrap">{r.open}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-3 py-2 text-xs text-muted-foreground border-t border-primary/10 flex items-center justify-between">
        <span>Updates every 15 mins.</span>
        <Link to="/portal" className="text-primary hover:underline flex items-center gap-0.5">
          More <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────── Welcome block ─────────────────────── */
function Welcome() {
  return (
    <div className="bg-white border border-primary/20 rounded p-5" id="main-content">
      <h1 className="text-xl md:text-2xl font-bold text-primary mb-2">
        Welcome to {SYSTEM_SHORT}
      </h1>
      <p className="text-sm text-foreground/80 leading-relaxed mb-3">
        The <strong>{SYSTEM_FULL}</strong> enables Tenderers to download tender schedules free of cost
        and submit bids online through this portal.
      </p>
      <div className="text-lg md:text-xl font-bold text-primary/90">
        {SYSTEM_FULL}
        <span className="block text-primary text-base font-semibold mt-0.5">AI Powered · {SYSTEM_SHORT}</span>
      </div>
      <p className="text-xs text-foreground/50 mt-2">{SYSTEM_SUB}</p>
    </div>
  );
}

/* ───────────────────────── Page ───────────────────────── */
export default function LandingPage() {
  const railLeft = [
    { icon: FileText,    label: "MIS Reports",               to: "/portal" },
    { icon: MapPin,      label: "Tenders by Location",       to: "/gis"    },
    { icon: Building2,   label: "Tenders by Organisation",   to: "/portal" },
    { icon: Tag,         label: "Tenders by Classification", to: "/portal" },
    { icon: Archive,     label: "Tenders in Archive",        to: "/portal" },
    { icon: ListChecks,  label: "Tenders Status",            to: "/portal" },
    { icon: XCircle,     label: "Cancelled / Retendered",    to: "/portal" },
    { icon: Download,    label: "Downloads",                 to: "/portal" },
    { icon: ShieldCheck, label: "Debarment List",            to: "/portal" },
  ];

  const latest = [
    { t: "Repair and Maintenance — Civil & Electrical Works (16 Nos) and Bathroom (15 Nos) of SOS Mess at Sector HQ Harare", ref: "ZW(WB Sector HQr) 2026-27-CZ-C CellNIT-31", close: "01-Jul-2026 09:30 AM", open: "02-Jul-2026 09:30 AM" },
    { t: "Repair and Maintenance — 48 Nos (out of 96) Type II Government Family Quarters", ref: "B V106 RAF Bn 2026-27-CZ-C Cell NIT-29", close: "01-Jul-2026 09:30 AM", open: "02-Jul-2026 09:30 AM" },
    { t: "Supply of Medical Imaging Equipment — Parirenyatwa Group of Hospitals", ref: "MOH/PARI/2026-27/MED-IMG-04", close: "03-Jul-2026 10:00 AM", open: "04-Jul-2026 10:30 AM" },
    { t: "Construction of Rural Feeder Roads — Mashonaland East Phase II", ref: "MOTID/RDC/2026-MASH-E/PH2", close: "05-Jul-2026 11:00 AM", open: "06-Jul-2026 11:30 AM" },
    { t: "Solar Mini-Grid Installation — Binga District (24 Schools, 8 Clinics)", ref: "MOE-NRG/RURAL-SOL/2026-BG/05", close: "07-Jul-2026 09:00 AM", open: "08-Jul-2026 10:00 AM" },
  ];

  const corrigenda = [
    { t: "Corrigendum: Replies to Pre-Bid Queries — Highway Rehabilitation Lot 3", ref: "PKG-III/SC/01", close: "30-Jun-2026 12:00 PM", open: "01-Jul-2026 02:00 PM" },
    { t: "Corrigendum: Extension of Closing Date — Hospital Linen Supply", ref: "JD/8962-101-PM-T-7200/1028", close: "10-Jul-2026 12:00 PM", open: "12-Jul-2026 02:00 PM" },
    { t: "Corrigendum: Revised BOQ — Bulawayo Water Treatment Upgrade", ref: "ZINWA/BYO-WTP/2026-COR-02", close: "11-Jul-2026 11:00 AM", open: "12-Jul-2026 11:30 AM" },
  ];

  return (
    <div className="h-full w-full overflow-y-auto bg-[#EAF1F8] flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 py-6 grid grid-cols-12 gap-4">
          {/* LEFT RAIL */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 space-y-2">
            {railLeft.map((b) => (
              <RailButton key={b.label} icon={b.icon} label={b.label} to={b.to} />
            ))}
          </aside>

          {/* CENTER */}
          <section className="col-span-12 md:col-span-9 lg:col-span-7 space-y-4">
            <Welcome />
            <TenderTable title="Latest Tenders" rows={latest} />
            <TenderTable title="Latest Corrigendums" rows={corrigenda} />
          </section>

          {/* RIGHT RAIL */}
          <aside className="col-span-12 lg:col-span-3 space-y-4">
            <LoginCard />
            <SearchCard />
            <HelpCard />
          </aside>
        </div>

        {/* Marquee strip */}
        <div className="bg-primary text-white text-sm">
          <div className="max-w-[1280px] mx-auto px-4 py-2 flex items-center gap-3 overflow-hidden">
            <Bell className="w-4 h-4 flex-shrink-0" />
            <div className="whitespace-nowrap overflow-hidden">
              <span className="inline-block animate-[marquee_40s_linear_infinite]">
                Important: All bidders must register a valid Digital Signature Certificate before submitting bids · Tender opening sessions are live-streamed for transparency · New AI-powered fraud detection module activated for all tenders above USD 100,000 · Public procurement plans for FY 2026/27 now published · Visit Help Desk for assistance · {SYSTEM_SHORT} — {SYSTEM_FULL} ·&nbsp;
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white text-sm mt-2">
        <div className="max-w-[1280px] mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <CoatOfArms className="w-10 h-10" />
              <div className="font-bold text-base leading-tight">
                {SYSTEM_SHORT}<br />
                <span className="text-white/80 text-xs font-normal">{SYSTEM_FULL}</span>
              </div>
            </div>
            <p className="text-white/80 text-xs leading-relaxed">
              {SYSTEM_SUB}.<br />
              Powered by the Procurement Regulatory Authority (PRAZ).
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2">Quick Links</div>
            <ul className="space-y-1 text-white/80 text-xs">
              <li><Link to="/signin" className="hover:underline">Bidder Login</Link></li>
              <li><Link to="/portal" className="hover:underline">Public Portal</Link></li>
              <li><Link to="/signin" className="hover:underline">Officer Login</Link></li>
              <li><Link to="/knowledge-base" className="hover:underline">Help &amp; Support</Link></li>
              <li><Link to="/tenders" className="hover:underline">Active Tenders</Link></li>
              <li><Link to="/awards" className="hover:underline">Bid Awards</Link></li>
              <li><Link to="/anti-corruption" className="hover:underline">Debarment List</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Contact</div>
            <ul className="space-y-1 text-white/80 text-xs">
              <li className="flex items-center gap-2"><Phone className="w-3 h-3" /> +263 242 700 000</li>
              <li>
                <a href="mailto:support@appois.gov.zw" className="flex items-center gap-2 hover:underline">
                  <Mail className="w-3 h-3" /> support@appois.gov.zw
                </a>
              </li>
              <li>
                <a href="https://www.appois.gov.zw" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:underline">
                  <Globe2 className="w-3 h-3" /> www.appois.gov.zw
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/15">
          <div className="max-w-[1280px] mx-auto px-4 py-3 text-xs text-white/70 flex items-center justify-between flex-wrap gap-2">
            <span>© {new Date().getFullYear()} {SYSTEM_SHORT} — {SYSTEM_FULL}. All rights reserved.</span>
            <span>Best viewed in Chrome / Edge / Firefox at 1280×768</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
