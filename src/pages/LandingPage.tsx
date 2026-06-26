import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/* ── Logo SVG ─────────────────────────────────────────────────────────────── */
function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
    </svg>
  );
}

/* ── Brand lists ──────────────────────────────────────────────────────────── */
const HERO_BRANDS = [
  { name: "Stripe",    style: { fontFamily: "Georgia, serif", fontWeight: 700, letterSpacing: "-0.02em", fontSize: 15 } },
  { name: "COINBASE",  style: { fontFamily: "Arial, sans-serif", fontWeight: 900, letterSpacing: "0.08em", fontSize: 13 } },
  { name: "Uniswap",   style: { fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 600, letterSpacing: "0.01em", fontSize: 15, fontStyle: "italic" } },
  { name: "AAVE",      style: { fontFamily: "'Courier New', monospace", fontWeight: 700, letterSpacing: "0.12em", fontSize: 13 } },
  { name: "Compound",  style: { fontFamily: "'Palatino Linotype', 'Book Antiqua', serif", fontWeight: 400, letterSpacing: "-0.01em", fontSize: 16 } },
  { name: "MakerDAO",  style: { fontFamily: "'Impact', 'Arial Narrow', sans-serif", fontWeight: 400, letterSpacing: "0.04em", fontSize: 14 } },
  { name: "Chainlink", style: { fontFamily: "Verdana, sans-serif", fontWeight: 700, letterSpacing: "-0.03em", fontSize: 13 } },
];

const BACKER_BRANDS = [
  { name: "Fundamental Labs", style: { fontFamily: "'Times New Roman', serif", fontWeight: 400, letterSpacing: "0.02em", fontSize: 14 } },
  { name: "KUCOIN",           style: { fontFamily: "'Arial Black', sans-serif", fontWeight: 900, letterSpacing: "0.08em", fontSize: 16 } },
  { name: "NGC",              style: { fontFamily: "Impact, sans-serif", fontWeight: 700, letterSpacing: "0.05em", fontSize: 18 } },
  { name: "NxGen",            style: { fontFamily: "Georgia, serif", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 17 } },
  { name: "Matter Labs",      style: { fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 700, letterSpacing: "-0.01em", fontSize: 15 } },
  { name: "DEXTOOLS",         style: { fontFamily: "Verdana, sans-serif", fontWeight: 700, letterSpacing: "0.06em", fontSize: 14, textTransform: "uppercase" as const } },
  { name: "NGRAVE",           style: { fontFamily: "'Courier New', monospace", fontWeight: 700, letterSpacing: "0.18em", fontSize: 14 } },
  { name: "Polychain",        style: { fontFamily: "'Palatino Linotype', serif", fontWeight: 500, letterSpacing: "0.03em", fontSize: 15 } },
];

/* ── Navbar ───────────────────────────────────────────────────────────────── */
function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
      <div className="max-w-[88rem] mx-auto flex items-center justify-between">
        {/* Left: System Name (no logo) */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="leading-none">
            <div className="text-[10px] font-bold text-black tracking-tight leading-tight uppercase">AI Powered Electronic Public</div>
            <div className="text-[10px] font-bold text-black tracking-tight leading-tight uppercase">Procurement & Oversight</div>
            <div className="text-[10px] font-bold text-black tracking-tight leading-tight uppercase">Intelligence System</div>
          </div>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Tenders",   to: "/tenders" },
            { label: "RFQ",       to: "/rfq" },
            { label: "Auctions",  to: "/auctions" },
            { label: "Analytics", to: "/analytics" },
            { label: "About",     to: "/portal" },
          ].map((link) => (
            <Link key={link.label} to={link.to} className="text-base text-gray-700 hover:text-black font-medium transition-colors duration-200">{link.label}</Link>
          ))}
        </div>

        {/* Right CTA */}
        <Link to="/signin" className="bg-black text-white text-base font-medium px-7 py-2.5 rounded-full hover:bg-gray-800 transition-colors duration-200">
          Open Portal
        </Link>
      </div>
    </nav>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <div className="flex-1 px-6 pt-20 pb-6 flex items-end">
      <div className="relative w-full rounded-2xl overflow-hidden max-w-[88rem] mx-auto" style={{ height: "calc(100vh - 96px)" }}>
        {/* Background video — autoplays behind the page */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4"
        />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center justify-start h-full p-6 pt-10">
          {/* Title — full width, top of card */}
          <h1
            className="w-full text-center text-black text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3"
            style={{ letterSpacing: "-0.03em" }}
          >
            AI Powered Electronic Public Procurement and Oversight Intelligence System
          </h1>

          {/* Tagline — centered, visible, smaller than title */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["Integrity", "Public Trust", "Transparency", "Good Governance", "Clean Procurement"].map(v => (
              <span key={v} className="text-sm md:text-base font-semibold text-black bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-black/20">
                {v}
              </span>
            ))}
          </div>

          {/* CTA button */}
          <Link
            to="/signin"
            className="inline-flex items-center gap-3 bg-black text-white text-base md:text-lg font-medium pl-8 pr-2 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            Get Started
            <span className="bg-white rounded-full p-2">
              <ArrowRight className="w-5 h-5 text-black" />
            </span>
          </Link>

          {/* Brand marquee */}
          <div className="mt-auto w-full max-w-md overflow-hidden">
            <div className="marquee-track">
              {[...HERO_BRANDS, ...HERO_BRANDS].map((b, i) => (
                <span key={i} className="mx-7 shrink-0 text-black/60 whitespace-nowrap" style={b.style}>{b.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Info Section ─────────────────────────────────────────────────────────── */
function InfoSection() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="max-w-[88rem] mx-auto">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          <div>
            <h2
              className="text-black text-4xl md:text-5xl font-medium leading-tight mb-8"
              style={{ letterSpacing: "-0.03em" }}
            >
              AI Powered Electronic<br />Public Procurement<br />&amp; Oversight System.
            </h2>
            <Link
              to="/signin"
              className="inline-flex items-center gap-3 bg-black text-white text-base font-medium pl-7 pr-2 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
            >
              Discover it
              <span className="bg-white rounded-full p-2">
                <ArrowRight className="w-4 h-4 text-black" />
              </span>
            </Link>
          </div>
          <div>
            <p className="text-black/70 text-2xl md:text-3xl leading-relaxed">
              AI-Powered Electronic Public Procurement and Oversight Intelligence System — where every procurement decision is transparent, automated, and incorruptible.
            </p>
          </div>
        </div>

        {/* Row 2 — 4-col cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 — image bg, spans 2 cols */}
          <div
            className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{
              backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="p-7 min-h-80 flex flex-col justify-between">
              <p className="text-black text-2xl font-medium leading-snug" style={{ letterSpacing: "-0.02em" }}>
                Procurement<br />that blooms
              </p>
              <p className="text-black/70 text-base max-w-xs">
                Gain full visibility as every tender, RFQ, and contract is tracked through automated, AI-driven workflows.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl p-7 min-h-80 flex flex-col justify-between" style={{ background: "#1a1a1a" }}>
            <p className="text-white text-2xl font-medium leading-snug" style={{ letterSpacing: "-0.02em" }}>
              Always auditable,<br />always compliant.
            </p>
            <p className="text-white/60 text-base">
              Every action is immutably logged. Fraud patterns are detected before they cost a dollar.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl p-7 min-h-80 flex flex-col justify-between" style={{ background: "#1a1a1a" }}>
            <p className="text-white text-2xl font-medium leading-snug" style={{ letterSpacing: "-0.02em" }}>
              Fully<br />automated.
            </p>
            <p className="text-white/60 text-base">
              Eight AI agents handle verification, evaluation, and compliance — 24/7, without corruption.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Backed By Section ────────────────────────────────────────────────────── */
function BackedBySection() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-12">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        <div className="text-black/70 text-base leading-relaxed">
          Adopted by premier<br />government entities and<br />forward-thinking institutions.
        </div>
        <div className="md:col-span-3 overflow-hidden">
          <div className="backers-track">
            {[...BACKER_BRANDS, ...BACKER_BRANDS].map((b, i) => (
              <span key={i} className="mx-10 shrink-0 text-black/50 whitespace-nowrap" style={b.style}>{b.name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Use Cases Section ────────────────────────────────────────────────────── */
function UseCasesSection() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left */}
        <div className="md:pr-12 md:pt-2">
          <p className="text-black/60 text-sm mb-2">Our System in Practice</p>
          <h2
            className="text-5xl md:text-6xl font-medium leading-none mb-6"
            style={{ letterSpacing: "-0.04em" }}
          >
            Use modes
          </h2>
          <p className="text-black/60 text-base leading-relaxed max-w-sm">
            This system powers a wide range of procurement modes for government entities, oversight bodies, and treasury offices wanting transparent, AI-enforced procurement management.
          </p>
          <div className="mt-10 space-y-3">
            {["Tender Management","RFQ & Small Purchases","RFP & EOI","Live Asset Auctions","Anti-Corruption AI","Public Transparency Portal"].map((m) => (
              <Link key={m} to="/signin" className="flex items-center justify-between py-3 border-b border-black/10 hover:border-black/30 transition-colors group">
                <span className="text-base font-medium text-black">{m}</span>
                <ArrowRight className="w-4 h-4 text-black/30 group-hover:text-black transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Right — video card */}
        <div className="relative rounded-3xl overflow-hidden min-h-[720px]">
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_183428_ab5e672a-f608-4dcb-b319-f3e040f02e2d.mp4"
          />
          <div className="relative z-10 p-10 md:p-12 h-full flex flex-col justify-end">
            <h3
              className="text-4xl md:text-5xl font-medium leading-tight mb-5 text-black"
              style={{ letterSpacing: "-0.03em" }}
            >
              Government<br />Commerce
            </h3>
            <p className="text-black/70 text-base max-w-md mb-8">
              Lift procurement integrity with a trusted AI-driven system featuring full audit trails, letting every official transact with zero corruption risk.
            </p>
            <Link
              to="/signin"
              className="inline-flex items-center gap-3 group"
            >
              <span className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center group-hover:bg-white transition-colors">
                <ArrowRight className="w-4 h-4 text-black" />
              </span>
              <span className="text-black font-medium text-base">Know more</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stats Section ────────────────────────────────────────────────────────── */
function StatsSection() {
  const stats = [
    { value: "USD 2.84B", label: "Procurement Managed" },
    { value: "1,287", label: "Active Tenders" },
    { value: "12,847", label: "Registered Suppliers" },
    { value: "94.2%", label: "Compliance Score" },
    { value: "8", label: "AI Agents Active" },
    { value: "184", label: "Government Entities" },
  ];
  return (
    <section className="bg-[#F5F5F5] px-6 py-16 border-t border-black/10">
      <div className="max-w-[88rem] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-medium text-black" style={{ letterSpacing: "-0.03em" }}>{s.value}</div>
            <div className="text-sm text-black/50 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#F5F5F5] px-6 py-12 border-t border-black/10">
      <div className="max-w-[88rem] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="leading-none">
          <div className="text-[9px] font-bold text-black tracking-tight leading-tight uppercase">AI Powered Electronic Public Procurement</div>
          <div className="text-[9px] font-bold text-black tracking-tight leading-tight uppercase">and Oversight Intelligence System</div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-black/50">
          <span>AI Powered Electronic Public Procurement and Oversight Intelligence System · Integrity · Public Trust · Transparency · Good Governance · Clean Procurement</span>
        </div>
        <div className="flex gap-6 text-sm text-black/50">
          {[
            { label: "Privacy",  to: "/portal" },
            { label: "Terms",    to: "/portal" },
            { label: "Contact",  to: "/portal" },
          ].map((l) => (
            <Link key={l.label} to={l.to} className="hover:text-black transition-colors">{l.label}</Link>
          ))}
        </div>
      </div>
      <div className="max-w-[88rem] mx-auto mt-8 pt-6 border-t border-black/10 text-xs text-black/30">
        © 2026 AI Powered Electronic Public Procurement and Oversight Intelligence System · PRAZ · All procurement data publicly disclosed
      </div>
    </footer>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="flex flex-col bg-[#F5F5F5]">
      {/* Hero wrapper */}
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <HeroSection />
      </div>

      <InfoSection />
      <BackedBySection />
      <StatsSection />
      <UseCasesSection />
      <Footer />
    </div>
  );
}
