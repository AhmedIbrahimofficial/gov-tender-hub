/**
 * BriefingPage — 7-tab AI Executive Briefing module.
 * Each tab has its own route; tab strip uses URL-based active state.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import KpiScrollTicker from "@/components/KpiScrollTicker";
import GisMapView from "@/components/GisMapView";
import ZimbabweMapTab from "@/components/ZimbabweMapTab";
import { ALL_GIS_PINS } from "@/lib/gis-data";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  Sparkles, Play, Pause, SkipBack, SkipForward, Square,
  TrendingUp, TrendingDown, AlertTriangle,
  Bell, BarChart3, Globe2, MapPin, LayoutDashboard, FileText,
  Clock, Volume2, VolumeX, Mic, Radio, Cpu, Calendar, Mail,
} from "lucide-react";

// ── Utilities ─────────────────────────────────────────────────────────────
function getTimeGreeting(name: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name}`;
  if (h < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

// ── Tab definitions ────────────────────────────────────────────────────────
const TABS = [
  { path: "/briefing/notes",        label: "1. Notes & Alerts",        Icon: Bell            },
  { path: "/briefing/dashboard",    label: "2. Visual Dashboard",      Icon: BarChart3       },
  { path: "/briefing/video",        label: "3. AI Briefing Video",     Icon: Sparkles        },
  { path: "/briefing/executive-bi", label: "4. Executive BI",          Icon: Globe2          },
  { path: "/briefing/projects",     label: "5. Projects & Tenders Map",Icon: MapPin          },
  { path: "/briefing/my-briefing",  label: "6. My Briefing",           Icon: LayoutDashboard },
  { path: "/briefing/meeting",      label: "7. Meeting Board Pack",    Icon: FileText        },
];

// ── Video tab data ─────────────────────────────────────────────────────────
const BRIEFING_TOPICS = [
  { id: 1, title: "Welcome & System Status",        duration: "0:45", type: "intro"   },
  { id: 2, title: "Procurement Overview",           duration: "1:20", type: "report"  },
  { id: 3, title: "Budget Performance",             duration: "1:15", type: "finance" },
  { id: 4, title: "Active Tenders & Deadlines",     duration: "0:55", type: "tender"  },
  { id: 5, title: "Risk Alerts & Flags",            duration: "1:05", type: "risk"    },
  { id: 6, title: "Vendor Performance",             duration: "0:50", type: "vendor"  },
  { id: 7, title: "Your Tasks & Urgent Items",      duration: "0:40", type: "tasks"   },
  { id: 8, title: "AI Insights & Recommendations", duration: "1:10", type: "ai"      },
];

const NARRATION_SCRIPTS: Record<number, string> = {
  0: "Welcome to your AI-generated executive briefing for APPOIS. I am your AI intelligence assistant. Today's date is July 1st 2026. The system is fully operational with all AI agents active. Let me walk you through the key metrics on your dashboard.",
  1: "Looking at the Procurement Overview. National spend year-to-date stands at USD 2.84 billion, up 6.2 percent. There are 1,287 active tenders across all ministries.",
  2: "On Budget Performance: Budget utilisation is at 67.8 percent, which is on track. However, Infrastructure Division is approaching 88 percent utilisation.",
  3: "Regarding Active Tenders and Deadlines: The Solar Mini-Grid installation tender closes in 48 hours. The Highway Rehabilitation tender worth USD 88 million was recently published.",
  4: "Risk Alerts and Flags: There are 23 open fraud alerts. 4 ghost vendor transactions have been detected this week. Asset wastage of USD 2.1 million has been flagged.",
  5: "Vendor Performance Update: The Compliance Score stands at 94.2 percent. VEN-00476 Granite Construction has been blacklisted due to high risk classification.",
  6: "Your Tasks and Urgent Items: You have 12 overdue tasks requiring immediate attention. Q3 Budget submission is due in 3 days.",
  7: "AI Insights and Recommendations: Recommend immediate review of bid rotation pattern flagged for VEN-00476 and VEN-00481. Briefing complete. Have a productive day.",
};

const ALERTS = [
  { type: "critical", msg: "Ghost vendor pattern detected — VEN-00476 & VEN-00481" },
  { type: "warning",  msg: "Budget ceiling approaching: Infrastructure Div at 88%" },
  { type: "warning",  msg: "3 ARV medicines at critically low stock levels" },
  { type: "critical", msg: "Solar Mini-Grid tender closing in 48 hours — no award yet" },
  { type: "info",     msg: "12 overdue tasks require immediate attention" },
  { type: "critical", msg: "Asset wastage of USD 2.1M flagged in Transport Dept" },
  { type: "info",     msg: "Q3 Budget submission due in 3 days" },
  { type: "warning",  msg: "4 ghost vendor transactions detected this week" },
];

// ── Animated waveform bars ─────────────────────────────────────────────────
function VoiceWaveform({ active, bars = 28 }: { active: boolean; bars?: number }) {
  const [heights, setHeights] = useState(() => Array.from({ length: bars }, () => 4));
  useEffect(() => {
    if (!active) { setHeights(Array.from({ length: bars }, () => 4)); return; }
    const id = setInterval(() => {
      setHeights(Array.from({ length: bars }, (_, i) => {
        const base = 4 + Math.sin(Date.now() / 200 + i * 0.6) * 12;
        return Math.max(3, Math.min(32, base + (Math.random() - 0.5) * 10));
      }));
    }, 80);
    return () => clearInterval(id);
  }, [active, bars]);
  return (
    <div className="flex items-center justify-center gap-[2px]" style={{ height: 40 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 3, height: h, borderRadius: 2,
          background: active ? `hsl(${200 + i * 5}, 90%, ${50 + h}%)` : "rgba(255,255,255,0.15)",
          transition: "height 80ms ease",
        }} />
      ))}
    </div>
  );
}

function MiniSparkline({ color, points }: { color: string; points: number[] }) {
  const w = 80, h = 32;
  const min = Math.min(...points), max = Math.max(...points), range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(v => h - ((v - min) / range) * (h - 4) - 2);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={xs.map((x, i) => `${x},${ys[i]}`).join(" ")} fill="none" stroke={color} strokeWidth={1.5} />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r={2.5} fill={color} />
    </svg>
  );
}

// ── AI Video Panel component ───────────────────────────────────────────────
function AiBriefingVideoPanel({
  playing, paused, currentTopic, onPlay, onPause, onStop,
  onPrev, onNext, muted, onMuteToggle, name,
}: {
  playing: boolean; paused: boolean; currentTopic: number;
  onPlay: () => void; onPause: () => void; onStop: () => void;
  onPrev: () => void; onNext: () => void;
  muted: boolean; onMuteToggle: () => void; name: string;
}) {
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [captionText, setCaptionText] = useState("");
  const captionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sparkData, setSparkData] = useState(() =>
    Array.from({ length: 20 }, (_, i) => 50 + Math.sin(i * 0.5) * 20)
  );
  useEffect(() => {
    const id = setInterval(() => setSparkData(d => [...d.slice(1), 30 + Math.random() * 50]), 600);
    return () => clearInterval(id);
  }, []);

  const startCaption = useCallback((topicIdx: number) => {
    if (captionIntervalRef.current) clearInterval(captionIntervalRef.current);
    const script = NARRATION_SCRIPTS[topicIdx] ?? "";
    const words = script.split(" ");
    let idx = 0;
    setCaptionText(words.slice(0, 8).join(" "));
    captionIntervalRef.current = setInterval(() => {
      idx += 6;
      if (idx >= words.length) { if (captionIntervalRef.current) clearInterval(captionIntervalRef.current); return; }
      setCaptionText(words.slice(Math.max(0, idx - 4), idx + 8).join(" "));
    }, 1800);
  }, []);

  const speak = useCallback((topicIdx: number) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(NARRATION_SCRIPTS[topicIdx] ?? "");
    utterance.rate = 0.92; utterance.pitch = 1.05; utterance.volume = muted ? 0 : 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith("en") && /female|zira|samantha|victoria|karen/i.test(v.name))
      ?? voices.find(v => v.lang.startsWith("en")) ?? voices[0];
    if (preferred) utterance.voice = preferred;
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [muted]);

  const startTimer = useCallback(() => {
    if (elapsedRef.current) clearInterval(elapsedRef.current);
    setElapsed(0);
    elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  }, []);
  const stopTimer = useCallback(() => {
    if (elapsedRef.current) { clearInterval(elapsedRef.current); elapsedRef.current = null; }
  }, []);

  useEffect(() => {
    if (playing && !paused) { speak(currentTopic); startCaption(currentTopic); startTimer(); }
    else {
      if ("speechSynthesis" in window) {
        if (paused) window.speechSynthesis.pause();
        else { window.speechSynthesis.cancel(); stopTimer(); setCaptionText(""); }
      }
      if (!paused) stopTimer();
    }
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      if (captionIntervalRef.current) clearInterval(captionIntervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, paused, currentTopic]);

  const totalDuration = BRIEFING_TOPICS[currentTopic]?.duration ?? "1:00";
  const [tMin, tSec] = totalDuration.split(":").map(Number);
  const totalSec = tMin * 60 + tSec;
  const progress = Math.min(1, elapsed / Math.max(totalSec, 1));
  const elapsedFmt = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;

  const videoKpis = [
    { label: "Spend YTD",    value: "USD 2.84B", color: "#00e676" },
    { label: "Compliance",   value: "94.2%",     color: "#2563eb" },
    { label: "Fraud Alerts", value: "23 Open",   color: "#ff1744" },
    { label: "Budget Util",  value: "67.8%",     color: "#ffa726" },
    { label: "Tenders",      value: "1,287",     color: "#42a5f5" },
    { label: "Savings",      value: "USD 184M",  color: "#00e676" },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#050d1a] overflow-hidden">
      <div className="flex-1 relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 50% 40%, #0d2545 0%, #050d1a 80%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(41,184,197,0.06) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(41,184,197,0.06) 40px)",
        }} />
        {playing && !paused && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white z-10">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> AI LIVE
          </div>
        )}
        <div className="absolute top-3 right-3 bg-[#0d2545]/90 border border-[#2563eb]/30 px-2 py-1 text-[10px] text-[#2563eb] z-10">
          {currentTopic + 1} / {BRIEFING_TOPICS.length} · {BRIEFING_TOPICS[currentTopic]?.title}
        </div>
        <div className="absolute top-10 left-3 flex flex-col gap-1.5 z-10">
          {videoKpis.slice(0, 3).map((kpi, i) => (
            <div key={i} className="bg-[#0a1628]/85 border px-2 py-1" style={{ borderColor: `${kpi.color}40`, minWidth: 120 }}>
              <div className="text-[8px] text-white/65 uppercase">{kpi.label}</div>
              <div className="text-xs font-bold font-mono" style={{ color: kpi.color }}>{kpi.value}</div>
            </div>
          ))}
        </div>
        <div className="absolute top-10 right-3 flex flex-col gap-1.5 z-10">
          {videoKpis.slice(3).map((kpi, i) => (
            <div key={i} className="bg-[#0a1628]/85 border px-2 py-1 text-right" style={{ borderColor: `${kpi.color}40`, minWidth: 120 }}>
              <div className="text-[8px] text-white/65 uppercase">{kpi.label}</div>
              <div className="text-xs font-bold font-mono" style={{ color: kpi.color }}>{kpi.value}</div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-14 left-0 right-0 flex items-end justify-center gap-4 px-6 z-10">
          {[{ label: "Spend Flow", color: "#2563eb" }, { label: "Risk", color: "#ff1744" }, { label: "Budget", color: "#ffa726" }].map((item, i) => (
            <div key={i} className="bg-[#0a1628]/70 border border-white/10 px-2 py-1 flex items-center gap-2">
              <div>
                <div className="text-[8px] text-white/65 uppercase">{item.label}</div>
                <MiniSparkline color={item.color} points={sparkData.map((v, j) => v + Math.sin(j * 0.3 + i) * 15)} />
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="relative mb-3">
            <div className="h-20 w-20 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#1e3a5f,#2563eb,#06b6d4)",
                boxShadow: playing && !paused ? "0 0 40px 12px rgba(41,184,197,0.5)" : "0 0 16px 4px rgba(41,184,197,0.2)",
              }}>
              <Sparkles className="h-9 w-9 text-white" />
            </div>
            {playing && !paused && <div className="absolute -inset-3 rounded-full border-2 border-[#2563eb]/30 animate-ping" />}
          </div>
          <VoiceWaveform active={playing && !paused} bars={32} />
          <div className="mt-2 text-[11px] font-semibold tracking-wider" style={{ color: playing && !paused ? "#2563eb" : "#ffffff60" }}>
            {!playing ? `APPOIS AI · ${name}` : paused ? "⏸ PAUSED" : "● AI NARRATING"}
          </div>
          {playing && captionText && (
            <div className="mt-3 max-w-xs text-center text-[11px] leading-relaxed text-white/90 bg-[#050d1a]/80 px-3 py-2 border border-[#2563eb]/20 pointer-events-none">
              {captionText}
            </div>
          )}
          {!playing && (
            <div className="mt-4 flex flex-col items-center gap-2 pointer-events-auto">
              <p className="text-white/70 text-xs text-center max-w-xs">AI will narrate a detailed voice-over explaining each dashboard chart and KPI in real time.</p>
            </div>
          )}
        </div>
        <div className="absolute bottom-3 right-3 text-[9px] font-mono text-white/50 z-10">{new Date().toLocaleTimeString("en-GB")}</div>
      </div>
      <div className="flex-shrink-0 bg-[#0a1628] px-4 pt-2 pb-0.5">
        <div className="relative bg-white/10 h-1 overflow-hidden">
          {BRIEFING_TOPICS.map((_, i) => (
            <div key={i} className="absolute top-0 bottom-0 border-r border-[#0a1628]"
              style={{ left: `${(i / BRIEFING_TOPICS.length) * 100}%`, width: `${100 / BRIEFING_TOPICS.length}%`,
                background: i < currentTopic ? "#2563eb" : i === currentTopic ? `rgba(41,184,197,${0.3 + progress * 0.7})` : "transparent" }} />
          ))}
          <div className="absolute top-0 bottom-0 bg-[#2563eb] transition-all"
            style={{ left: `${(currentTopic / BRIEFING_TOPICS.length) * 100}%`, width: `${(progress / BRIEFING_TOPICS.length) * 100}%` }} />
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[9px] font-mono text-white/55">{elapsedFmt}</span>
          <span className="text-[9px] font-mono text-white/55">{totalDuration}</span>
        </div>
      </div>
      <div className="flex-shrink-0 bg-[#0a1628] border-t border-white/10 px-4 py-2.5 flex items-center gap-3">
        <button onClick={onPrev} className="h-8 w-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"><SkipBack className="h-4 w-4" /></button>
        <button onClick={playing && !paused ? onPause : onPlay}
          className="h-9 w-9 flex items-center justify-center bg-[#2563eb] text-white hover:bg-blue-500 transition-all"
          style={{ boxShadow: "0 0 12px 3px rgba(41,184,197,0.4)" }}>
          {playing && !paused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button onClick={onStop} className="h-8 w-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"><Square className="h-4 w-4" /></button>
        <button onClick={onNext} className="h-8 w-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"><SkipForward className="h-4 w-4" /></button>
        <button onClick={onMuteToggle} className="h-8 w-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all ml-1">
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none ml-2">
          {BRIEFING_TOPICS.map((t, i) => (
            <button key={t.id} title={t.title} className={`flex-shrink-0 h-1.5 transition-all ${i === currentTopic ? "bg-[#2563eb]" : i < currentTopic ? "bg-[#2563eb]/50" : "bg-white/20 hover:bg-white/40"}`}
              style={{ width: i === currentTopic ? 24 : 12 }} />
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
          <Cpu className="h-3.5 w-3.5 text-[#2563eb]" /><span className="text-[10px] text-[#2563eb] font-mono">AI GEN</span>
        </div>
      </div>
      <div className="flex-shrink-0 bg-[#050d1a] border-t border-[#2563eb]/20 px-4 py-2 text-center">
        <div className="text-[9px] font-bold text-[#ff1744] uppercase tracking-widest mb-0.5 flex items-center justify-center gap-2">
          <Radio className="h-3 w-3 animate-pulse" /> Ai GENERATED BRIEFING VIDEO. PLAYING VIDEO EXPLAINING THE DASHBOARDS <Radio className="h-3 w-3 animate-pulse" />
        </div>
        {captionText && playing && <div className="text-[10px] text-white/60 italic truncate">{captionText}</div>}
      </div>
    </div>
  );
}

// ── Tab 1: Notes & Alerts — Auto-scrolling hazard feed with topic rotation ──
const HAZARD_TOPICS: {
  topic: string;
  alerts: { level: "critical" | "warning" | "caution" | "info"; msg: string; source: string }[];
}[] = [
  {
    topic: "Fraud & Integrity Watch",
    alerts: [
      { level: "critical", msg: "Ghost vendor pattern detected — VEN-00476 & VEN-00481 alternating wins", source: "/vendors" },
      { level: "critical", msg: "Asset wastage of USD 2.1M flagged in Transport Department", source: "/audit" },
      { level: "critical", msg: "Bid rotation scheme suspected in MOTID roads tenders", source: "/ai-analytics" },
      { level: "warning",  msg: "4 ghost vendor transactions detected this week", source: "/vendors" },
      { level: "warning",  msg: "Collusion signals — 3 vendors sharing directors", source: "/vendors" },
    ],
  },
  {
    topic: "Budget & Financial Pressure",
    alerts: [
      { level: "critical", msg: "Infrastructure Division at 88% budget utilisation — Q3 still ahead", source: "/budget" },
      { level: "warning",  msg: "Ministry of Health commitments exceed cash releases by USD 4.2M", source: "/finance" },
      { level: "caution",  msg: "Foreign currency exposure on 3 pending contracts", source: "/contracts" },
      { level: "info",     msg: "Q3 Budget submission due in 3 days", source: "/budget" },
    ],
  },
  {
    topic: "Tender Deadlines",
    alerts: [
      { level: "critical", msg: "Solar Mini-Grid tender closing in 48 hours — no award yet", source: "/tenders" },
      { level: "warning",  msg: "Highway Rehab Lot 3 evaluation running 6 days late", source: "/evaluations" },
      { level: "caution",  msg: "ARV framework technical scoring pending sign-off", source: "/evaluations" },
      { level: "info",     msg: "12 overdue procurement tasks require attention", source: "/tenders" },
    ],
  },
  {
    topic: "Service Delivery",
    alerts: [
      { level: "critical", msg: "3 ARV medicines at critically low stock levels — MOHCC", source: "/inventory" },
      { level: "warning",  msg: "Ambulance shortages: 74% shortfall (184/248)", source: "/analytics" },
      { level: "caution",  msg: "Hospital bed occupancy 15% above capacity", source: "/analytics" },
      { level: "info",     msg: "Fuel availability at 94% nationally", source: "/analytics" },
    ],
  },
];

const HAZARD_STYLE = {
  critical: { border: "border-red-600",    bg: "bg-red-50",    text: "text-red-800",    dot: "bg-red-600",    icon: "🛑" },
  warning:  { border: "border-amber-500",  bg: "bg-amber-50",  text: "text-amber-800",  dot: "bg-amber-500",  icon: "⚠️" },
  caution:  { border: "border-emerald-500",bg: "bg-emerald-50",text: "text-emerald-800",dot: "bg-emerald-500",icon: "🟢" },
  info:     { border: "border-blue-500",   bg: "bg-blue-50",   text: "text-blue-800",   dot: "bg-blue-500",   icon: "🔵" },
} as const;

function NotesAlertsTab({ greeting, today }: { greeting: string; today: string }) {
  const navigate = useNavigate();
  const [topicIdx, setTopicIdx] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollDone, setScrollDone] = useState(false);

  const currentTopic = HAZARD_TOPICS[topicIdx];

  // When CSS animation ends (one full scroll of duplicated content), advance
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const handler = () => {
      setScrollDone(true);
      if (playCount >= 1) {
        // Advance to next topic after replay
        setPlayCount(0);
        setTopicIdx(i => (i + 1) % HAZARD_TOPICS.length);
      } else {
        setPlayCount(c => c + 1);
      }
      // Reset animation
      el.style.animation = "none";
      void el.offsetHeight;
      el.style.animation = "";
    };
    el.addEventListener("animationiteration", handler);
    return () => el.removeEventListener("animationiteration", handler);
  }, [topicIdx, playCount]);

  const doubled = [...currentTopic.alerts, ...currentTopic.alerts];

  return (
    <div className="flex-1 overflow-hidden bg-[#f5f7fb] p-4 flex flex-col">
      {/* Header banner */}
      <div className="flex-shrink-0 bg-[#0f172a] text-white px-5 py-3 border-b-2 border-blue-600 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-blue-300 uppercase mb-0.5">AI Executive Briefing — Hazard Feed</p>
          <h1 className="text-lg font-bold">{greeting}</h1>
          <p className="text-xs text-white/60">{today}</p>
        </div>
        <div className="text-right">
          <div className="text-[9px] uppercase tracking-widest text-blue-300 font-bold">Now Presenting</div>
          <div className="text-sm font-bold text-white mt-0.5">{currentTopic.topic}</div>
          <div className="text-[10px] text-white/50 mt-0.5">Topic {topicIdx + 1} of {HAZARD_TOPICS.length} · Pass {playCount + 1}/2</div>
        </div>
      </div>

      {/* Scroll-up hazards feed */}
      <div className="flex-1 mt-3 overflow-hidden bg-white border border-slate-300 relative" style={{ minHeight: 0 }}>
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
        <div ref={trackRef} className="tender-scroll-track" style={{ animationDuration: "24s" }}>
          {doubled.map((a, i) => {
            const s = HAZARD_STYLE[a.level];
            const isCritical = a.level === "critical";
            return (
              <div key={i}
                className={`flex items-center gap-3 border-l-4 ${s.border} ${s.bg} px-4 py-3 mx-3 my-2 ${isCritical ? "hazard-critical-glow" : ""}`}>
                <span className="text-lg flex-shrink-0">{s.icon}</span>
                <span className={`h-2 w-2 rounded-full ${s.dot} flex-shrink-0 ${isCritical ? "animate-pulse" : ""}`} />
                <span className={`text-xs font-semibold flex-1 ${s.text} ${isCritical ? "hazard-critical-text" : ""}`}>{a.msg}</span>
                <button
                  onClick={() => navigate(a.source)}
                  className="flex-shrink-0 h-7 px-3 bg-[#0f172a] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors">
                  View →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic navigator dots */}
      <div className="flex-shrink-0 flex items-center justify-center gap-2 py-3">
        {HAZARD_TOPICS.map((t, i) => (
          <button key={i} onClick={() => { setTopicIdx(i); setPlayCount(0); }}
            className={`h-1.5 rounded-full transition-all ${i === topicIdx ? "w-8 bg-[#0f172a]" : "w-2 bg-slate-300 hover:bg-slate-500"}`}
            title={t.topic} />
        ))}
      </div>
    </div>
  );
}


// ── Tab 2: Visual Dashboard ────────────────────────────────────────────────
function VisualDashboardTab() {
  const kpiCards = [
    { label: "NATIONAL SPEND YTD", value: "USD 2.84B", delta: "+6.2% YoY", up: true  },
    { label: "SAVINGS",            value: "USD 184M",  delta: "+11.4%",    up: true  },
    { label: "COMPLIANCE",         value: "94.2%",     delta: "+1.8 pts",  up: true  },
    { label: "OPEN FRAUD ALERTS",  value: "23",        delta: "+3 today",  up: false },
  ];
  const monthlyData = [
    { month: "Jan", spend: 220, savings: 8  }, { month: "Feb", spend: 235, savings: 10 },
    { month: "Mar", spend: 240, savings: 9  }, { month: "Apr", spend: 250, savings: 12 },
    { month: "May", spend: 265, savings: 14 }, { month: "Jun", spend: 280, savings: 15 },
  ];
  const ministrySpend = [
    { name: "Defence",     value: 450 }, { name: "Transport",   value: 350 },
    { name: "Agriculture", value: 300 }, { name: "Health",      value: 280 },
    { name: "Finance",     value: 200 }, { name: "Education",   value: 165 },
  ];
  const riskData = [
    { name: "Low",      value: 24 }, { name: "Medium", value: 10 },
    { name: "High",     value: 4  }, { name: "Critical",value: 4  },
  ];
  const riskColors = ["#10b981", "#f59e0b", "#f97316", "#ef4444"];
  return (
    <div className="flex-1 overflow-y-auto bg-[#0a1628] p-4 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpiCards.map((k, i) => (
          <div key={i} className="bg-white/10 border border-white/20 rounded-lg p-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">{k.label}</div>
            <div className="text-xl font-black text-white">{k.value}</div>
            <div className={`text-xs font-semibold mt-1 flex items-center gap-1 ${k.up ? "text-emerald-400" : "text-red-400"}`}>
              {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {k.delta}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0f1f3d] rounded-lg border border-white/10 overflow-hidden" style={{ height: 420 }}>
          <div className="px-3 py-2 border-b border-white/10 text-xs font-bold text-white/80 uppercase tracking-widest">Live Scrolling KPI Stream</div>
          <KpiScrollTicker height={376} theme="dark" speed={1} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-[#0f1f3d] rounded-lg border border-white/10 p-4">
            <div className="text-xs font-bold text-white/60 uppercase mb-2">Monthly Spend &amp; Savings (USD M)</div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#ffffff80" }} />
                <YAxis tick={{ fontSize: 10, fill: "#ffffff80" }} />
                <Tooltip contentStyle={{ background: "#0f1f3d", border: "1px solid #ffffff20", color: "#fff" }} />
                <Area type="monotone" dataKey="spend" stroke="#2563eb" fill="#2563eb22" name="Spend" />
                <Area type="monotone" dataKey="savings" stroke="#10b981" fill="#10b98122" name="Savings" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0f1f3d] rounded-lg border border-white/10 p-3">
              <div className="text-xs font-bold text-white/60 uppercase mb-2">Spend by Ministry (USD M)</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={ministrySpend} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#ffffff60" }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#ffffff60" }} width={60} />
                  <Tooltip contentStyle={{ background: "#0f1f3d", border: "1px solid #ffffff20", color: "#fff" }} />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-[#0f1f3d] rounded-lg border border-white/10 p-3">
              <div className="text-xs font-bold text-white/60 uppercase mb-2">Risk Distribution (%)</div>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={riskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50}
                    label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                    {riskData.map((_, i) => <Cell key={i} fill={riskColors[i % riskColors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0f1f3d", border: "1px solid #ffffff20", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab 3: AI Briefing Video wrapper ──────────────────────────────────────
function VideoTab({ name }: { name: string }) {
  const [playing, setPlaying] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!playing || paused) return;
    const dur = BRIEFING_TOPICS[currentTopic]?.duration ?? "1:00";
    const [m, s] = dur.split(":").map(Number);
    const ms = (m * 60 + s) * 1000;
    const timer = setTimeout(() => {
      if (currentTopic < BRIEFING_TOPICS.length - 1) setCurrentTopic(p => p + 1);
      else setPlaying(false);
    }, ms);
    return () => clearTimeout(timer);
  }, [playing, currentTopic, paused]);

  const handlePlay  = () => { setPlaying(true); setPaused(false); };
  const handlePause = () => setPaused(true);
  const handleStop  = () => { setPlaying(false); setPaused(false); if ("speechSynthesis" in window) window.speechSynthesis.cancel(); };
  const handlePrev  = () => { handleStop(); setTimeout(() => setCurrentTopic(p => Math.max(0, p - 1)), 50); };
  const handleNext  = () => { handleStop(); setTimeout(() => setCurrentTopic(p => Math.min(BRIEFING_TOPICS.length - 1, p + 1)), 50); };

  // AI chatbox state
  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "I'm your APPOIS AI briefing assistant. Ask me anything about today's briefing — KPIs, alerts, tenders, budgets, or vendor risk." },
  ]);
  const sendChat = () => {
    const q = chatInput.trim();
    if (!q) return;
    setChatMsgs(m => [...m, { role: "user", text: q }]);
    setChatInput("");
    setTimeout(() => {
      const reply = `Based on today's briefing: ${q.toLowerCase().includes("spend") ? "YTD national spend is USD 2.84B (+6.2% YoY), driven mainly by Infrastructure (38%) and Health (22%)." : q.toLowerCase().includes("risk") || q.toLowerCase().includes("fraud") ? "23 open fraud alerts. Priority: ghost-vendor pattern VEN-00476 / VEN-00481 and bid rotation in MOTID roads." : q.toLowerCase().includes("budget") ? "Utilisation is 67.8% nationally. Infrastructure Division is running hot at 88% with Q3 ahead — recommend reallocation review." : "I've cross-checked your query against active tenders, contracts, and audit logs. Recommend opening the relevant workbench for a deeper drill-down."}`;
      setChatMsgs(m => [...m, { role: "ai", text: reply }]);
    }, 700);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#050d1a]">
      {/* Full-height video */}
      <div className="flex-1 flex flex-col min-h-0" style={{ minHeight: "60%" }}>
        <AiBriefingVideoPanel
          playing={playing} paused={paused} currentTopic={currentTopic}
          onPlay={handlePlay} onPause={handlePause} onStop={handleStop}
          onPrev={handlePrev} onNext={handleNext}
          muted={muted} onMuteToggle={() => setMuted(m => !m)} name={name}
        />
      </div>

      {/* AI chatbox underneath */}
      <div className="flex-shrink-0 bg-[#0a1628] border-t-2 border-blue-600 flex flex-col" style={{ height: 220 }}>
        <div className="flex-shrink-0 px-4 py-2 border-b border-white/10 flex items-center gap-2">
          <div className="h-6 w-6 rounded-full ai-logo-gradient ai-logo-glow flex items-center justify-center">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-widest">Ask APPOIS AI — About This Briefing</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {chatMsgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] text-xs px-3 py-2 rounded ${m.role === "user" ? "bg-blue-600 text-white" : "bg-white/10 text-white/90 border border-white/10"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 border-t border-white/10 p-2 flex gap-2">
          <input value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendChat()}
            placeholder="Ask about today's KPIs, alerts, tenders, budgets…"
            className="flex-1 h-9 px-3 bg-[#050d1a] border border-white/15 text-white text-xs placeholder-white/30 focus:outline-none focus:border-blue-500" />
          <button onClick={sendChat} disabled={!chatInput.trim()}
            className="h-9 px-4 bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 disabled:opacity-40 uppercase tracking-wider">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}


// ── Tab 4: Executive BI (Province Choropleth Map) ────────────────────────
function ExecutiveBITab() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#0a1628] p-3">
      <ZimbabweMapTab theme="dark" />
    </div>
  );
}

// ── Tab 5: Projects & Tenders Map ─────────────────────────────────────────
function ProjectsTendersTab() {
  const projects = [
    { name: "Solar Mini-Grids (12 Clinics)",    ministry: "MOE",   value: "USD 14.8M", status: "On Track", province: "Matabeleland",        progress: 72 },
    { name: "Highway Rehabilitation Lot 3",      ministry: "MOTID", value: "USD 88M",   status: "At Risk",  province: "Mashonaland East",    progress: 38 },
    { name: "ARV Supply Framework",              ministry: "MOH",   value: "USD 12.4M", status: "On Track", province: "National",             progress: 85 },
    { name: "Water Treatment Upgrade Bulawayo",  ministry: "ZINWA", value: "USD 31M",   status: "Troubled", province: "Bulawayo",             progress: 21 },
    { name: "School Textbooks 2026/27",          ministry: "MOPSE", value: "USD 8.2M",  status: "On Track", province: "National",             progress: 60 },
  ];
  const tenders = [
    { ref: "ZW-PRA-2026-00184", title: "Solar Mini-Grid Installation",    value: "USD 14.8M", closes: "2026-07-03", status: "Active"   },
    { ref: "ZW-MOTID-2026-088",  title: "Highway Rehabilitation Lot 3",   value: "USD 88M",   closes: "2026-07-18", status: "Active"   },
    { ref: "ZW-MOH-2026-0124",   title: "ARV Medicines Framework 2026",   value: "USD 12.4M", closes: "2026-07-25", status: "Active"   },
    { ref: "ZW-ZINWA-2026-031",  title: "Water Treatment Plant Upgrade",  value: "USD 31M",   closes: "2026-08-01", status: "Active"   },
    { ref: "ZW-ZIMRA-2026-045",  title: "Tax Admin System Phase II",      value: "USD 45M",   closes: "2026-08-15", status: "Active"   },
  ];
  const projectStatusStyle: Record<string, string> = {
    "On Track": "bg-emerald-100 text-emerald-700",
    "At Risk":  "bg-amber-100 text-amber-700",
    "Troubled": "bg-red-100 text-red-700",
  };
  const tenderStatusStyle: Record<string, string> = {
    "Active":   "bg-blue-100 text-blue-700",
    "Closed":   "bg-gray-100 text-gray-600",
    "Awarded":  "bg-purple-100 text-purple-700",
  };
  return (
    <div className="flex-1 overflow-y-auto bg-white p-6 space-y-8">
      <div>
        <h1 className="text-lg font-black text-gray-900 mb-1">Projects &amp; Tenders Overview</h1>
        <p className="text-xs text-gray-500">Active government projects and open tenders as of today.</p>
      </div>
      {/* Active Projects */}
      <div>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">Active Projects</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Project", "Ministry", "Value", "Status", "Province", "Progress"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-800">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.ministry}</td>
                  <td className="px-4 py-3 font-bold text-emerald-700">{p.value}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${projectStatusStyle[p.status] ?? "bg-gray-100 text-gray-600"}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.province}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden" style={{ minWidth: 60 }}>
                        <div className="h-full rounded-full" style={{
                          width: `${p.progress}%`,
                          background: p.progress > 60 ? "#10b981" : p.progress > 30 ? "#f59e0b" : "#ef4444",
                        }} />
                      </div>
                      <span className="text-[10px] text-gray-500 w-8">{p.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Active Tenders */}
      <div>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">Active Tenders</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Ref", "Title", "Value", "Closes", "Status"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tenders.map((t, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-[10px] text-blue-600">{t.ref}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{t.title}</td>
                  <td className="px-4 py-3 font-bold text-emerald-700">{t.value}</td>
                  <td className="px-4 py-3 font-mono text-gray-500">{t.closes}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tenderStatusStyle[t.status] ?? "bg-gray-100 text-gray-600"}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab 6: My Briefing ────────────────────────────────────────────────────
function MyBriefingTab() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm"];
  // col (0=Mon..6=Sun), row (0=8am..6=2pm), label, color
  const calEvents = [
    { col: 1, row: 1, label: "Executive...",   color: "bg-blue-500"   },
    { col: 2, row: 2, label: "Procuram...",    color: "bg-green-500"  },
    { col: 3, row: 3, label: "Vendor p...",    color: "bg-orange-500" },
    { col: 4, row: 1, label: "Ministry v...",  color: "bg-purple-500" },
    { col: 3, row: 5, label: "Board pre...",   color: "bg-blue-600"   },
  ];
  const todos = [
    { time: "9:00am",  task: "Approve Solar Mini-Grid award",           done: false },
    { time: "11:00am", task: "Review ZACC referral pack",               done: false },
    { time: "2:00pm",  task: "Sign INV-2026-4821 payment authority",    done: true  },
    { time: "10:00am", task: "Prep Q3 budget submission",               done: false },
  ];
  const mails = [
    { from: "Treasury Secretary",         subject: "Q3 Budget submission",              time: "07:22" },
    { from: "Chief Procurement ...",       subject: "Solar Mini-Grid award rec.",        time: "08:14" },
    { from: "Auditor-General",            subject: "ZACC referral — VEN-00476",         time: "08:41" },
    { from: "PS Health",                  subject: "ARV stockout alert",                time: "09:02" },
  ];
  const scrollAlerts = [
    { msg: "APIs Error / 1 min alert OK for 10 days",           color: "bg-red-100 border-red-400"   },
    { msg: "Customer Reviews alert OK for 5 hours",             color: "bg-teal-100 border-teal-400" },
    { msg: "Dashboard Loads Peaking OK for 3 days",             color: "bg-amber-100 border-amber-400"},
    { msg: "Vendor Portal uptime alert OK for 2 days",          color: "bg-blue-100 border-blue-400" },
    { msg: "APIs Error / 1 min alert OK for 10 days",           color: "bg-red-100 border-red-400"   },
    { msg: "Customer Reviews alert OK for 5 hours",             color: "bg-teal-100 border-teal-400" },
    { msg: "Budget submission reminder — 3 days remaining",     color: "bg-amber-100 border-amber-400"},
    { msg: "Ghost vendor flag active — ZACC referral pending",  color: "bg-red-100 border-red-400"   },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top-left: Calendar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">My Calendar — Schedules, Meetings</span>
          </div>
          <div className="overflow-x-auto">
            <div className="grid" style={{ gridTemplateColumns: "48px repeat(7, 1fr)", minWidth: 440 }}>
              {/* header row */}
              <div />
              {days.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-gray-500 pb-1 border-b border-gray-200">{d}</div>
              ))}
              {/* time rows */}
              {hours.map((hr, rowIdx) => (
                <>
                  <div key={`hr-${rowIdx}`} className="text-[9px] text-gray-400 font-mono pt-1 pr-1 text-right">{hr}</div>
                  {days.map((_, colIdx) => {
                    const ev = calEvents.find(e => e.col === colIdx && e.row === rowIdx);
                    return (
                      <div key={`cell-${rowIdx}-${colIdx}`} className="border border-gray-100 h-8 relative">
                        {ev && (
                          <div className={`absolute inset-0.5 rounded text-[9px] text-white font-semibold flex items-center px-1 truncate ${ev.color}`}>
                            {ev.label}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Top-right: To-Do List */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">My Daily To-Do List (Reminders, Alarm)</span>
          </div>
          <div className="space-y-2">
            {todos.map((t, i) => (
              <div key={i} className={`flex items-start gap-3 p-2.5 rounded border ${t.done ? "border-gray-100 bg-gray-50" : "border-blue-100 bg-blue-50"}`}>
                <span className="text-[10px] font-mono text-gray-400 flex-shrink-0 mt-0.5">{t.time}</span>
                <span className={`text-xs flex-1 ${t.done ? "line-through text-gray-400" : "text-gray-700 font-medium"}`}>{t.task}</span>
                {t.done && <span className="text-[9px] text-gray-400">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-left: My Mails */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-4 w-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">My Mails</span>
          </div>
          <div className="space-y-1.5">
            {mails.map((m, i) => (
              <div key={i} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-blue-600">{m.from[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-gray-700 truncate">{m.from}</div>
                  <div className="text-[10px] text-gray-500 truncate">{m.subject}</div>
                </div>
                <span className="text-[9px] font-mono text-gray-400 flex-shrink-0">{m.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-right: Scroll-Up Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-4 w-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Scroll-Up Alerts</span>
          </div>
          <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: 200 }}>
            {scrollAlerts.map((a, i) => (
              <div key={i} className={`flex items-center gap-2 px-2 py-1.5 border-l-4 rounded-r text-[10px] font-medium text-gray-700 ${a.color}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current flex-shrink-0" />
                {a.msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab 7: Meeting Board Pack ─────────────────────────────────────────────
function MeetingBoardPackTab() {
  const meetings = [
    {
      name: "Annual Board Meeting",
      date: "2026-05-07", time: "09:00",
      venue: "The Country Club",
      members: 12, scope: "Governance",
      owner: "Board Chair",
      status: "SCHEDULED",
    },
    {
      name: "Audit & Risk Committee",
      date: "2026-05-09", time: "10:30",
      venue: "Boardroom A, Kaguvi Building",
      members: 7, scope: "Audit",
      owner: "Auditor-General",
      status: "SCHEDULED",
    },
    {
      name: "Monthly Sales & Ops Review",
      date: "2026-05-12", time: "14:00",
      venue: "Virtual (Teams)",
      members: 18, scope: "Operations",
      owner: "COO",
      status: "SCHEDULED",
    },
    {
      name: "Procurement Committee",
      date: "2026-04-28", time: "11:00",
      venue: "Boardroom B",
      members: 9, scope: "Procurement",
      owner: "CPO",
      status: "CONCLUDED",
    },
    {
      name: "Strategic Priorities Retreat",
      date: "2026-06-02", time: "08:30",
      venue: "Nyanga Conference Centre",
      members: 24, scope: "Strategy",
      owner: "PS Cabinet",
      status: "SCHEDULED",
    },
  ];

  const statusStyle: Record<string, string> = {
    SCHEDULED: "bg-blue-100 text-blue-700",
    CONCLUDED: "bg-gray-100 text-gray-600",
    CANCELLED: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <FileText className="h-8 w-8 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h1 className="text-xl font-black text-gray-900">Meeting Board Pack</h1>
          <p className="text-xs text-gray-500 mt-1">Scheduled meetings with linked briefing packs. Materials issued at least 7 days before each meeting.</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Meeting Name", "Date", "Time", "Venue", "Members", "Scope", "Owner", "Status", "Pack"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meetings.map((m, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{m.name}</td>
                <td className="px-4 py-3 font-mono text-gray-600">{m.date}</td>
                <td className="px-4 py-3 font-mono text-gray-600">{m.time}</td>
                <td className="px-4 py-3 text-gray-500">{m.venue}</td>
                <td className="px-4 py-3 text-gray-600">
                  <span className="inline-flex items-center gap-1">👤 {m.members}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{m.scope}</td>
                <td className="px-4 py-3 text-gray-600">{m.owner}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyle[m.status] ?? "bg-gray-100 text-gray-600"}`}>{m.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:text-blue-800 font-semibold text-[11px] whitespace-nowrap transition-colors hover:underline">
                    Open Pack &rsaquo;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Board Pack Best Practices */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-bold text-blue-800 mb-3">Board Pack Best Practices</h3>
        <ul className="space-y-1.5">
          {[
            "Issue board packs at least 7 days before the meeting to allow adequate preparation time.",
            "Include an executive summary, agenda, and all supporting documents with version control.",
            "Use a standardised format across all committees to ensure consistency and ease of review.",
            "Ensure all sensitive annexures are access-controlled and watermarked before distribution.",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
              <span className="mt-0.5 h-4 w-4 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-[9px] font-bold flex-shrink-0">{i + 1}</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Main BriefingPage component ───────────────────────────────────────────
export default function BriefingPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const name = user?.name ?? user?.email ?? "Minister";
  const greeting = getTimeGreeting(name);
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // Default to first tab if at /briefing with no sub-path
  const activeTab = TABS.find(t => location.pathname.startsWith(t.path))?.path ?? TABS[0].path;

  // Redirect bare /briefing to first tab
  useEffect(() => {
    if (location.pathname === "/briefing" || location.pathname === "/briefing/") {
      navigate(TABS[0].path, { replace: true });
    }
  }, [location.pathname, navigate]);

  function renderTab() {
    if (location.pathname.startsWith("/briefing/notes"))        return <NotesAlertsTab greeting={greeting} today={today} />;
    if (location.pathname.startsWith("/briefing/dashboard"))    return <VisualDashboardTab />;
    if (location.pathname.startsWith("/briefing/video"))        return <VideoTab name={name} />;
    if (location.pathname.startsWith("/briefing/executive-bi")) return <ExecutiveBITab />;
    if (location.pathname.startsWith("/briefing/projects"))     return <ProjectsTendersTab />;
    if (location.pathname.startsWith("/briefing/my-briefing"))  return <MyBriefingTab />;
    if (location.pathname.startsWith("/briefing/meeting"))      return <MeetingBoardPackTab />;
    return <NotesAlertsTab greeting={greeting} today={today} />;
  }

  return (
    <AppShell>
      <div className="flex flex-col h-full min-h-0">
        {/* Tab strip */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 overflow-x-auto">
          <div className="flex">
            {TABS.map(({ path, label, Icon }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-700 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {renderTab()}
        </div>
      </div>
    </AppShell>
  );
}
