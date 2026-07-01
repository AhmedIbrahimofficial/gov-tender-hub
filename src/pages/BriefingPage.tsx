/**
 * BriefingPage — AI-generated executive briefing module.
 * Shows a video briefing with play/pause + a full-screen briefing chart
 * with scrolling KPIs, news ticker, and AI chat.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import KpiScrollTicker from "@/components/KpiScrollTicker";
import BriefingDashboard from "@/components/BriefingDashboard";
import {
  Sparkles, Play, Pause, SkipBack, SkipForward, Square, X,
  ChevronLeft, ChevronRight, Filter, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, DollarSign, Shield, BarChart3,
  Activity, Clock, Send, Volume2, VolumeX, Maximize2, Minimize2, Bell,
  Mic, Radio, Cpu,
} from "lucide-react";

function getTimeGreeting(name: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name}`;
  if (h < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

const BRIEFING_TOPICS = [
  { id: 1, title: "Welcome & System Status",         duration: "0:45",  type: "intro"   },
  { id: 2, title: "Procurement Overview",            duration: "1:20",  type: "report"  },
  { id: 3, title: "Budget Performance",              duration: "1:15",  type: "finance" },
  { id: 4, title: "Active Tenders & Deadlines",      duration: "0:55",  type: "tender"  },
  { id: 5, title: "Risk Alerts & Flags",             duration: "1:05",  type: "risk"    },
  { id: 6, title: "Vendor Performance",              duration: "0:50",  type: "vendor"  },
  { id: 7, title: "Your Tasks & Urgent Items",       duration: "0:40",  type: "tasks"   },
  { id: 8, title: "AI Insights & Recommendations",  duration: "1:10",  type: "ai"      },
];

const KPI_INDICATORS = [
  { label: "Total Spend (YTD)",         value: "USD 2.84B",   delta: "+6.2%",  up: true,   color: "text-emerald-400", urgent: false },
  { label: "Active Tenders",            value: "1,287",       delta: "+42",    up: true,   color: "text-blue-400",    urgent: false },
  { label: "Open Fraud Alerts",         value: "23",          delta: "-5",     up: false,  color: "text-red-400",     urgent: true  },
  { label: "Budget Utilisation",        value: "67.8%",       delta: "On Track",up: true,  color: "text-emerald-400", urgent: false },
  { label: "Compliance Score",          value: "94.2%",       delta: "+1.8pts",up: true,   color: "text-emerald-400", urgent: false },
  { label: "Overdue Tasks",             value: "12",          delta: "Urgent", up: false,  color: "text-red-400",     urgent: true  },
  { label: "Contracts In Progress",     value: "964",         delta: "+8",     up: true,   color: "text-blue-400",    urgent: false },
  { label: "Procurement Savings",       value: "USD 184M",    delta: "+11.4%", up: true,   color: "text-emerald-400", urgent: false },
  { label: "Infrastructure Div Budget", value: "88% Used",    delta: "Warning",up: false,  color: "text-amber-400",   urgent: true  },
  { label: "Staff Productivity",        value: "82%",         delta: "+4pts",  up: true,   color: "text-emerald-400", urgent: false },
  { label: "Quality of Life Index",     value: "6.4/10",      delta: "+0.2",   up: true,   color: "text-blue-400",    urgent: false },
  { label: "Revenue Collections",       value: "USD 18.2B",   delta: "+3.1%",  up: true,   color: "text-emerald-400", urgent: false },
  { label: "Fuel Availability",         value: "94%",         delta: "Normal", up: true,   color: "text-emerald-400", urgent: false },
  { label: "Medicine Shortages",        value: "3 Items",     delta: "Alert",  up: false,  color: "text-red-400",     urgent: true  },
  { label: "Asset Wastage Detected",    value: "USD 2.1M",    delta: "Flagged",up: false,  color: "text-red-400",     urgent: true  },
  { label: "Economic Growth Rate",      value: "3.8%",        delta: "+0.4pts",up: true,   color: "text-emerald-400", urgent: false },
  { label: "Inflation Rate",            value: "7.2%",        delta: "+0.3pts",up: false,  color: "text-amber-400",   urgent: false },
  { label: "Bid Award Rate",            value: "78.3%",       delta: "-1.2%",  up: false,  color: "text-amber-400",   urgent: false },
  { label: "Ghost Vendor Detections",   value: "4 This Week", delta: "Critical",up: false, color: "text-red-400",     urgent: true  },
  { label: "Building Shortages",        value: "14 Units",    delta: "Urgent", up: false,  color: "text-red-400",     urgent: true  },
];

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

const AI_RESPONSES: Record<string, string> = {
  "fraud": "I've detected 23 open fraud alerts. The most critical is a bid rotation pattern between VEN-00476 and VEN-00481. They have alternated contract wins 4 times in 18 months. Recommend ZACC referral immediately.",
  "budget": "Budget utilisation is at 67.8% year-to-date. Infrastructure Division is at 88% with Q3 still ahead — this is a Warning indicator. Primary Education and Irrigation are On Track at 71% and 51% respectively.",
  "tender": "There are currently 1,287 active tenders. The Solar Mini-Grid tender (ZW-PRA-2026-00184) closes in 48 hours with 11 bids received. The Highway Rehabilitation tender (USD 88M) is published and awaiting bids.",
  "risk": "Top 5 risks: (1) Ghost vendor detections — 4 this week, (2) Budget ceiling breach — Infrastructure, (3) Medicine shortage — 3 ARV items, (4) Asset wastage — USD 2.1M flagged, (5) Overdue tasks — 12 items.",
};

const getAIAnswer = (q: string): string => {
  const lower = q.toLowerCase();
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return `Based on current data: ${KPI_INDICATORS.filter(k => k.urgent).map(k => k.label).join(", ")} require immediate attention. Total procurement spend is at USD 2.84B with a compliance score of 94.2%.`;
};

// ── AI Video Briefing narration scripts per topic ─────────────────────────
const NARRATION_SCRIPTS: Record<number, string> = {
  0: "Welcome to your AI-generated executive briefing for APPOIS. I am your AI intelligence assistant. Today's date is July 1st 2026. The system is fully operational with all AI agents active. Let me walk you through the key metrics on your dashboard.",
  1: "Looking at the Procurement Overview. National spend year-to-date stands at USD 2.84 billion, up 6.2 percent. There are 1,287 active tenders across all ministries. The Spend Flow chart on the top-left shows steady upward momentum throughout the year. The Procurement Flow candlestick chart indicates healthy tender cycle activity with no major anomalies.",
  2: "On Budget Performance: Budget utilisation is at 67.8 percent, which is on track. The Budget Pool indicator shows USD 425 million available. The Budget Absorption Trend chart shows stable absorption. However, Infrastructure Division is approaching 88 percent utilisation. The Risk Exposure rolling 60-day bar chart is showing elevated red bars — this is an area requiring attention.",
  3: "Regarding Active Tenders and Deadlines: The Solar Mini-Grid installation tender closes in 48 hours. The Highway Rehabilitation tender worth USD 88 million was recently published. The Ministry Spend chart on the right shows Transport leading at USD 578 million, followed by Health at USD 392 million and Agriculture at USD 312 million.",
  4: "Risk Alerts and Flags: There are 23 open fraud alerts. The Risk Exposure chart shows peak exposure periods. 4 ghost vendor transactions have been detected this week. Asset wastage of USD 2.1 million has been flagged in the Transport Department. Medicine shortages — 3 ARV items — are at critically low stock levels.",
  5: "Vendor Performance Update: The Compliance Score stands at an impressive 94.2 percent. The Rendity Index is at USD 339 million. Highveld Engineering scores 4.5 out of 5 for overall performance. VEN-00476 Granite Construction has been blacklisted due to high risk classification. Supplier spend is being monitored across all 8 ministry categories.",
  6: "Your Tasks and Urgent Items: You have 12 overdue tasks requiring immediate attention. Q3 Budget submission is due in 3 days. The debarment list has been updated with 3 new entities. 4 AI agents are currently in pending review mode and require your authorisation to proceed.",
  7: "AI Insights and Recommendations: Based on pattern analysis, I recommend immediate review of the bid rotation pattern flagged for VEN-00476 and VEN-00481. The Spend Tracker shows USD 1.72 billion processed. Budget absorption trend indicates you are well-positioned for Q3. Overall system health is strong. Compliance score of 94.2 percent exceeds the 90 percent target. Briefing complete. Have a productive day.",
};

// ── Animated waveform bars ─────────────────────────────────────────────────
function VoiceWaveform({ active, bars = 28 }: { active: boolean; bars?: number }) {
  const [heights, setHeights] = useState(() => Array.from({ length: bars }, () => 4));
  useEffect(() => {
    if (!active) {
      setHeights(Array.from({ length: bars }, () => 4));
      return;
    }
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
        <div
          key={i}
          className="transition-all"
          style={{
            width: 3,
            height: h,
            borderRadius: 2,
            background: active
              ? `hsl(${200 + i * 5}, 90%, ${50 + h}%)`
              : "rgba(255,255,255,0.15)",
            transition: "height 80ms ease",
          }}
        />
      ))}
    </div>
  );
}

// ── Live mini chart overlays for the video panel ──────────────────────────
function MiniSparkline({ color, points }: { color: string; points: number[] }) {
  const w = 80, h = 32;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(v => h - ((v - min) / range) * (h - 4) - 2);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={xs.map((x, i) => `${x},${ys[i]}`).join(" ")} fill="none" stroke={color} strokeWidth={1.5} />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r={2.5} fill={color} />
    </svg>
  );
}

// ── AI Video Panel (the main video feature) ───────────────────────────────
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
  const [captionIdx, setCaptionIdx] = useState(0);
  const captionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Rolling sparkline data
  const [sparkData, setSparkData] = useState(() =>
    Array.from({ length: 20 }, (_, i) => 50 + Math.sin(i * 0.5) * 20)
  );
  useEffect(() => {
    const id = setInterval(() => {
      setSparkData(d => [...d.slice(1), 30 + Math.random() * 50]);
    }, 600);
    return () => clearInterval(id);
  }, []);

  // Caption rolling effect
  const startCaption = useCallback((topicIdx: number) => {
    if (captionIntervalRef.current) clearInterval(captionIntervalRef.current);
    const script = NARRATION_SCRIPTS[topicIdx] ?? "";
    const words = script.split(" ");
    let idx = 0;
    setCaptionIdx(0);
    setCaptionText(words.slice(0, 8).join(" "));
    captionIntervalRef.current = setInterval(() => {
      idx += 6;
      if (idx >= words.length) {
        if (captionIntervalRef.current) clearInterval(captionIntervalRef.current);
        return;
      }
      setCaptionText(words.slice(Math.max(0, idx - 4), idx + 8).join(" "));
      setCaptionIdx(idx);
    }, 1800);
  }, []);

  // Speak using Web Speech API
  const speak = useCallback((topicIdx: number) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(NARRATION_SCRIPTS[topicIdx] ?? "");
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = muted ? 0 : 1;
    // Prefer a female English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith("en") && /female|zira|samantha|victoria|karen/i.test(v.name)
    ) ?? voices.find(v => v.lang.startsWith("en")) ?? voices[0];
    if (preferred) utterance.voice = preferred;
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [muted]);

  // Elapsed timer
  const startTimer = useCallback(() => {
    if (elapsedRef.current) clearInterval(elapsedRef.current);
    setElapsed(0);
    elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (elapsedRef.current) { clearInterval(elapsedRef.current); elapsedRef.current = null; }
  }, []);

  useEffect(() => {
    if (playing && !paused) {
      speak(currentTopic);
      startCaption(currentTopic);
      startTimer();
    } else {
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

  // Mute toggle
  useEffect(() => {
    if (speechRef.current) speechRef.current.volume = muted ? 0 : 1;
    if ("speechSynthesis" in window && playing && !paused) {
      // Re-speak to apply mute (browser limitation)
    }
  }, [muted, playing, paused]);

  const totalDuration = BRIEFING_TOPICS[currentTopic]?.duration ?? "1:00";
  const [tMin, tSec] = totalDuration.split(":").map(Number);
  const totalSec = tMin * 60 + tSec;
  const progress = Math.min(1, elapsed / Math.max(totalSec, 1));
  const elapsedFmt = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;

  // Floating KPI tiles inside the video
  const videoKpis = [
    { label: "Spend YTD",    value: "USD 2.84B", color: "#00e676" },
    { label: "Compliance",   value: "94.2%",     color: "#29b8c5" },
    { label: "Fraud Alerts", value: "23 Open",   color: "#ff1744" },
    { label: "Budget Util",  value: "67.8%",     color: "#ffa726" },
    { label: "Tenders",      value: "1,287",     color: "#42a5f5" },
    { label: "Savings",      value: "USD 184M",  color: "#00e676" },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#050d1a] overflow-hidden">
      {/* ── Video Screen ─────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 50% 40%, #0d2545 0%, #050d1a 80%)" }}>

        {/* Grid overlay — mimics trading terminal */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(41,184,197,0.06) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(41,184,197,0.06) 40px)",
        }} />

        {/* Scan-line overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ background: "repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)" }} />

        {/* Corner brackets — cinematic framing */}
        {[["top-2 left-2", "border-t-2 border-l-2"], ["top-2 right-2", "border-t-2 border-r-2"],
          ["bottom-2 left-2", "border-b-2 border-l-2"], ["bottom-2 right-2", "border-b-2 border-r-2"]].map(([pos, border], i) => (
          <div key={i} className={`absolute ${pos} ${border} border-[#29b8c5]/60`} style={{ width: 24, height: 24 }} />
        ))}

        {/* LIVE badge */}
        {playing && !paused && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white z-10">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            AI LIVE
          </div>
        )}

        {/* Topic badge top-right */}
        <div className="absolute top-3 right-3 bg-[#0d2545]/90 border border-[#29b8c5]/30 px-2 py-1 text-[10px] text-[#29b8c5] z-10">
          {currentTopic + 1} / {BRIEFING_TOPICS.length} · {BRIEFING_TOPICS[currentTopic]?.title}
        </div>

        {/* ── Floating KPI tiles ─────────────────────────────── */}
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

        {/* ── Bottom sparkline strip ─────────────────────────── */}
        <div className="absolute bottom-14 left-0 right-0 flex items-end justify-center gap-4 px-6 z-10">
          {[{ label: "Spend Flow", color: "#29b8c5" }, { label: "Risk", color: "#ff1744" }, { label: "Budget", color: "#ffa726" }].map((item, i) => (
            <div key={i} className="bg-[#0a1628]/70 border border-white/10 px-2 py-1 flex items-center gap-2">
              <div>
                <div className="text-[8px] text-white/65 uppercase">{item.label}</div>
                <MiniSparkline color={item.color} points={sparkData.map((v, j) => v + Math.sin(j * 0.3 + i) * 15)} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Center: AI avatar + waveform ─────────────────── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          {/* AI avatar circle */}
          <div className="relative mb-3">
            <div className="h-20 w-20 rounded-full ai-logo-gradient ai-logo-glow flex items-center justify-center"
              style={{ boxShadow: playing && !paused ? "0 0 40px 12px rgba(41,184,197,0.5)" : "0 0 16px 4px rgba(41,184,197,0.2)" }}>
              <Sparkles className="h-9 w-9 text-white" />
            </div>
            {playing && !paused && (
              <div className="absolute -inset-3 rounded-full border-2 border-[#29b8c5]/30 animate-ping" />
            )}
          </div>

          {/* Waveform */}
          <VoiceWaveform active={playing && !paused} bars={32} />

          {/* State label */}
          <div className="mt-2 text-[11px] font-semibold tracking-wider" style={{ color: playing && !paused ? "#29b8c5" : "#ffffff60" }}>
            {!playing ? `APPOIS AI · ${name}` : paused ? "⏸ PAUSED" : "● AI NARRATING"}
          </div>

          {/* Caption / subtitle overlay */}
          {playing && captionText && (
            <div className="mt-3 max-w-xs text-center text-[11px] leading-relaxed text-white/90 bg-[#050d1a]/80 px-3 py-2 border border-[#29b8c5]/20 pointer-events-none">
              {captionText}
            </div>
          )}

          {/* Start prompt when not playing */}
          {!playing && (
            <div className="mt-4 flex flex-col items-center gap-2 pointer-events-auto">
              <p className="text-white/70 text-xs text-center max-w-xs">
                AI will narrate a detailed voice-over explaining each dashboard chart and KPI in real time.
              </p>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="absolute bottom-3 right-3 text-[9px] font-mono text-white/50 z-10">
          {new Date().toLocaleTimeString("en-GB")}
        </div>
      </div>

      {/* ── Progress bar ──────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-[#0a1628] px-4 pt-2 pb-0.5">
        <div className="relative bg-white/10 h-1 cursor-pointer overflow-hidden" style={{ borderRadius: 0 }}>
          {/* Topic segments */}
          {BRIEFING_TOPICS.map((_, i) => (
            <div key={i} className="absolute top-0 bottom-0 border-r border-[#0a1628]"
              style={{ left: `${(i / BRIEFING_TOPICS.length) * 100}%`, width: `${100 / BRIEFING_TOPICS.length}%`,
                background: i < currentTopic ? "#29b8c5" : i === currentTopic ? `rgba(41,184,197,${0.3 + progress * 0.7})` : "transparent" }} />
          ))}
          {/* Active fill */}
          <div className="absolute top-0 bottom-0 bg-[#29b8c5] transition-all"
            style={{ left: `${(currentTopic / BRIEFING_TOPICS.length) * 100}%`,
              width: `${(progress / BRIEFING_TOPICS.length) * 100}%` }} />
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[9px] font-mono text-white/55">{elapsedFmt}</span>
          <span className="text-[9px] font-mono text-white/55">{totalDuration}</span>
        </div>
      </div>

      {/* ── Controls bar ─────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-[#0a1628] border-t border-white/10 px-4 py-2.5 flex items-center gap-3">
        {/* Rewind */}
        <button onClick={onPrev} title="Previous Topic"
          className="h-8 w-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          style={{ borderRadius: 0 }}>
          <SkipBack className="h-4 w-4" />
        </button>
        {/* Play / Pause */}
        <button onClick={playing && !paused ? onPause : onPlay} title={playing && !paused ? "Pause" : "Play"}
          className="h-9 w-9 flex items-center justify-center bg-[#29b8c5] text-[#050d1a] hover:bg-[#3dd5e4] transition-all appois-glow-on-hover"
          style={{ borderRadius: 0, boxShadow: "0 0 12px 3px rgba(41,184,197,0.4)" }}>
          {playing && !paused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        {/* Stop */}
        <button onClick={onStop} title="Stop"
          className="h-8 w-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          style={{ borderRadius: 0 }}>
          <Square className="h-4 w-4" />
        </button>
        {/* Fast-forward */}
        <button onClick={onNext} title="Next Topic"
          className="h-8 w-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          style={{ borderRadius: 0 }}>
          <SkipForward className="h-4 w-4" />
        </button>

        {/* Volume / mute */}
        <button onClick={onMuteToggle} title={muted ? "Unmute" : "Mute"}
          className="h-8 w-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all ml-1"
          style={{ borderRadius: 0 }}>
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {/* Topic selector */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none ml-2">
          {BRIEFING_TOPICS.map((t, i) => (
            <button key={t.id} onClick={() => { onStop(); setTimeout(() => { onPlay(); }, 50); }}
              title={t.title}
              className={`flex-shrink-0 h-1.5 transition-all ${i === currentTopic ? "bg-[#29b8c5]" : i < currentTopic ? "bg-[#29b8c5]/50" : "bg-white/20 hover:bg-white/40"}`}
              style={{ width: i === currentTopic ? 24 : 12, borderRadius: 0 }} />
          ))}
        </div>

        {/* AI indicator */}
        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
          <Cpu className="h-3.5 w-3.5 text-[#29b8c5]" />
          <span className="text-[10px] text-[#29b8c5] font-mono">AI GEN</span>
        </div>
      </div>

      {/* ── Caption bar ──────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-[#050d1a] border-t border-[#29b8c5]/20 px-4 py-2 text-center">
        <div className="text-[9px] font-bold text-[#ff1744] uppercase tracking-widest mb-0.5 flex items-center justify-center gap-2">
          <Radio className="h-3 w-3 animate-pulse" />
          Ai GENERATED BRIEFING VIDEO. DETAILED BRIEFING REPORT, PLAYING VIDEO EXPLAINING THE DASHBOARDS PRESENTED IN THE VIDEO
          <Radio className="h-3 w-3 animate-pulse" />
        </div>
        {captionText && playing && (
          <div className="text-[10px] text-white/60 italic truncate">{captionText}</div>
        )}
      </div>
    </div>
  );
}

export default function BriefingPage() {
  const { user } = useAuth();
  const name = user?.name?.split(" ")[0] ?? "Officer";
  const role = user?.role ?? "procurement_officer";
  const greeting = getTimeGreeting(name);

  const [activeModule, setActiveModule] = useState<"video" | "alerts" | "chart">("video");
  const [playing, setPlaying] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "user"|"ai"; text: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const aiEndRef = useRef<HTMLDivElement>(null);

  // Auto-advance topics
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

  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const handleAsk = () => {
    if (!aiQuery.trim()) return;
    const q = aiQuery.trim();
    setAiMessages(p => [...p, { role: "user", text: q }]);
    setAiQuery("");
    setAiLoading(true);
    setTimeout(() => {
      setAiMessages(p => [...p, { role: "ai", text: getAIAnswer(q) }]);
      setAiLoading(false);
    }, 900);
  };

  const handlePlay = () => { setPlaying(true); setPaused(false); };
  const handlePause = () => setPaused(true);
  const handleStop = () => { setPlaying(false); setPaused(false); if ("speechSynthesis" in window) window.speechSynthesis.cancel(); };
  const handlePrev = () => { handleStop(); setTimeout(() => { setCurrentTopic(p => Math.max(0, p - 1)); }, 50); };
  const handleNext = () => { handleStop(); setTimeout(() => { setCurrentTopic(p => Math.min(BRIEFING_TOPICS.length - 1, p + 1)); }, 50); };

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-[#0a1628] text-white overflow-hidden">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="flex-shrink-0 bg-[#0f1f3d] border-b border-white/10">
          {/* Top row */}
          <div className="px-5 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full ai-logo-gradient ai-logo-glow flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">{greeting}</div>
              <div className="text-xs text-blue-300">AI Executive Briefing · {today}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                className="h-7 px-2 text-xs bg-white/10 border border-white/20 text-white focus:outline-none" style={{ borderRadius: 0 }}>
                <option value="">All Departments</option>
                <option>Ministry of Health</option>
                <option>Ministry of Finance</option>
                <option>Ministry of Transport</option>
                <option>ZIMRA</option>
              </select>
              <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
                className="h-7 px-2 text-xs bg-white/10 border border-white/20 text-white focus:outline-none" style={{ borderRadius: 0 }} />
            </div>
          </div>

          {/* ── Sub-module tab strip ──────────────────────────────── */}
          <div className="flex items-end px-5 gap-0">
            {([
              { key: "video"  as const, num: 1, label: "AI Video",         Icon: Play,     badge: playing && !paused ? "LIVE" : undefined },
              { key: "alerts" as const, num: 2, label: "Live Alerts & AI", Icon: Bell,     badge: String(ALERTS.filter(a => a.type === "critical").length) },
              { key: "chart"  as const, num: 3, label: "Briefing Chart",   Icon: BarChart3 },
            ]).map(m => {
              const active = activeModule === m.key;
              return (
                <button key={m.key} onClick={() => setActiveModule(m.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold border-b-2 transition-all flex-shrink-0
                    ${active ? "border-[#29b8c5] text-[#29b8c5] bg-[#29b8c5]/10" : "border-transparent text-white/65 hover:text-white hover:border-white/30"}`}
                  style={{ borderRadius: 0 }}>
                  <span className={`flex items-center justify-center h-5 w-5 rounded flex-shrink-0 ${active ? "bg-[#29b8c5] text-[#050d1a]" : "bg-white/10 text-white/70"}`}>
                    <m.Icon className="h-3 w-3" />
                  </span>
                  <span>{m.num}. {m.label}</span>
                  {m.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${m.badge === "LIVE" ? "bg-red-500 text-white animate-pulse" : "bg-[#29b8c5]/30 text-[#29b8c5]"}`}>
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="flex-1" />
            <div className="flex items-center gap-1.5 pb-2.5 pr-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00e676] animate-pulse" />
              <span className="text-[9px] font-bold text-[#00e676] uppercase tracking-wider">Live</span>
            </div>
          </div>
        </div>

        {/* ── Module content ────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* 1. AI Video */}
          {activeModule === "video" && (
            <>
              <AiBriefingVideoPanel
                playing={playing} paused={paused} currentTopic={currentTopic}
                onPlay={handlePlay} onPause={handlePause} onStop={handleStop}
                onPrev={handlePrev} onNext={handleNext}
                muted={muted} onMuteToggle={() => setMuted(v => !v)} name={name}
              />
              {/* Right sidebar */}
              <div className="flex flex-col w-72 flex-shrink-0 border-l border-white/10 bg-[#0a1628] overflow-hidden">
                <div className="text-[10px] font-bold text-[#29b8c5] uppercase tracking-wider px-3 py-2 border-b border-white/10 flex items-center gap-1.5">
                  <BarChart3 className="h-3 w-3" /> Live Briefing Intel
                </div>
                <div className="px-3 py-2 border-b border-white/10 space-y-1 flex-shrink-0">
                  <div className="text-[9px] font-bold text-red-400 uppercase tracking-wider">🚨 Critical Alerts</div>
                  {ALERTS.filter(a => a.type === "critical").map((a, i) => (
                    <div key={i} className="text-[10px] text-red-300 flex items-start gap-1.5">
                      <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" /><span>{a.msg}</span>
                    </div>
                  ))}
                  {ALERTS.filter(a => a.type === "warning").map((a, i) => (
                    <div key={i} className="text-[10px] text-amber-300 flex items-start gap-1.5">
                      <Bell className="h-3 w-3 mt-0.5 flex-shrink-0" /><span>{a.msg}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-1 overflow-hidden min-h-0">
                  <KpiScrollTicker theme="dark" height="100%" speed={0.8} showCategory />
                </div>
                <div className="flex-shrink-0 border-t border-white/10 p-2 space-y-0.5">
                  <div className="text-[9px] font-bold text-[#29b8c5] uppercase tracking-wider mb-1">Briefing Topics</div>
                  {BRIEFING_TOPICS.map((t, i) => (
                    <button key={t.id} onClick={() => { handleStop(); setCurrentTopic(i); }}
                      className={`w-full text-left flex items-center gap-2 px-2 py-1 text-[10px] transition-colors
                        ${i === currentTopic ? "bg-[#29b8c5]/20 text-[#29b8c5] border-l-2 border-[#29b8c5]" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
                      style={{ borderRadius: 0 }}>
                      <span className="flex-shrink-0 w-4 text-center">{i === currentTopic && playing && !paused ? "▶" : i + 1}</span>
                      <span className="flex-1 truncate">{t.title}</span>
                      <span className="flex-shrink-0 text-white/55">{t.duration}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* 2. Live Alerts & AI */}
          {activeModule === "alerts" && (
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Left — full KPI ticker */}
              <div className="flex flex-col w-72 flex-shrink-0 border-r border-white/10 bg-[#050d1a] overflow-hidden">
                <div className="px-3 py-2.5 border-b border-white/10 flex-shrink-0">
                  <div className="text-[10px] font-bold text-[#29b8c5] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#29b8c5] animate-pulse" /> Live KPI Ticker
                  </div>
                  <div className="text-[9px] text-white/55 mt-0.5">Real-time national indicators</div>
                </div>
                <div className="flex-1 overflow-hidden min-h-0">
                  <KpiScrollTicker theme="dark" height="100%" speed={0.9} showCategory />
                </div>
              </div>
              {/* Centre — Scrolling alerts */}
              <div className="flex flex-col flex-1 min-w-0 border-r border-white/10 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/10 bg-[#0a1628] flex-shrink-0">
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" /> Live System Alerts
                  </div>
                  <div className="text-[9px] text-white/55 mt-0.5">Auto-refreshing · AI-classified</div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  <div className="text-[9px] font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> Critical
                  </div>
                  {ALERTS.filter(a => a.type === "critical").map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-red-950/40 border border-red-500/20">
                      <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-[10px] font-semibold text-red-300">{a.msg}</div>
                        <div className="text-[9px] text-red-400/60 mt-0.5">AI Flagged · Requires immediate action</div>
                      </div>
                      <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 flex-shrink-0">CRITICAL</span>
                    </div>
                  ))}
                  <div className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mt-4 mb-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Warnings
                  </div>
                  {ALERTS.filter(a => a.type === "warning").map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-amber-950/30 border border-amber-500/20">
                      <Bell className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-[10px] font-semibold text-amber-200">{a.msg}</div>
                        <div className="text-[9px] text-amber-400/60 mt-0.5">Monitor · Review by COB</div>
                      </div>
                      <span className="text-[9px] font-bold bg-amber-600 text-white px-1.5 py-0.5 flex-shrink-0">WARN</span>
                    </div>
                  ))}
                  <div className="text-[9px] font-bold text-blue-400 uppercase tracking-wider mt-4 mb-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Information
                  </div>
                  {ALERTS.filter(a => a.type === "info").map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-blue-950/20 border border-blue-500/20">
                      <Bell className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-[10px] font-semibold text-blue-200">{a.msg}</div>
                        <div className="text-[9px] text-blue-400/60 mt-0.5">For your awareness</div>
                      </div>
                      <span className="text-[9px] font-bold bg-blue-700 text-white px-1.5 py-0.5 flex-shrink-0">INFO</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right — AI Chat full height */}
              <div className="flex flex-col w-80 flex-shrink-0 bg-[#0f1f3d] overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/10 flex-shrink-0">
                  <div className="text-[10px] font-bold text-[#29b8c5] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" /> AI Executive Assistant
                  </div>
                  <div className="text-[9px] text-white/55 mt-0.5">Ask about any KPI, alert or decision</div>
                </div>
                <div className="px-3 py-2 border-b border-white/10 flex-shrink-0 flex flex-wrap gap-1">
                  {["Fraud summary", "Budget status", "Tender alerts", "Top risks"].map(q => (
                    <button key={q} onClick={() => setAiQuery(q)}
                      className="text-[9px] px-2 py-1 bg-white/10 text-white/75 hover:bg-[#29b8c5]/20 hover:text-[#29b8c5] transition-colors">
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
                  {aiMessages.length === 0 && (
                    <div className="text-center py-8">
                      <Sparkles className="h-8 w-8 text-[#29b8c5]/40 mx-auto mb-2" />
                      <div className="text-xs text-white/55">Ask the AI about any alert, KPI, budget figure, or procurement risk.</div>
                    </div>
                  )}
                  {aiMessages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                      <span className={`text-[9px] font-semibold mb-0.5 ${m.role === "user" ? "text-white/55" : "text-[#29b8c5]"}`}>
                        {m.role === "user" ? "You" : "AI"}
                      </span>
                      <div className={`max-w-[90%] px-3 py-2 text-xs leading-relaxed ${m.role === "user" ? "bg-[#29b8c5] text-[#050d1a]" : "bg-white/10 text-white/90 border border-white/10"}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex items-center gap-2 text-[#29b8c5]">
                      <Sparkles className="h-3 w-3 animate-spin" />
                      <span className="text-xs animate-pulse">AI is analysing…</span>
                    </div>
                  )}
                  <div ref={aiEndRef} />
                </div>
                <div className="flex gap-2 px-3 pb-3 pt-2 border-t border-white/10 flex-shrink-0">
                  <input value={aiQuery} onChange={e => setAiQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAsk()}
                    placeholder="Ask about fraud, budget, tenders…"
                    className="flex-1 h-8 px-3 text-xs bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#29b8c5]/50" />
                  <button onClick={handleAsk} disabled={!aiQuery.trim() || aiLoading}
                    className="h-8 px-3 bg-[#29b8c5] text-[#050d1a] text-xs font-bold disabled:opacity-40 hover:bg-[#3dd5e4] flex items-center gap-1.5">
                    <Send className="h-3 w-3" /> Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Briefing Chart */}
          {activeModule === "chart" && (
            <div className="flex-1 min-h-0 overflow-hidden">
              <BriefingDashboard />
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}
