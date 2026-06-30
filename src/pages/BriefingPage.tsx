/**
 * BriefingPage — AI-generated executive briefing module.
 * Shows a video briefing with play/pause + a full-screen briefing chart
 * with scrolling KPIs, news ticker, and AI chat.
 */
import { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import KpiScrollTicker from "@/components/KpiScrollTicker";
import {
  Sparkles, Play, Pause, SkipBack, SkipForward, Square, X,
  ChevronLeft, ChevronRight, Filter, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, DollarSign, Shield, BarChart3,
  Activity, Clock, Send, Volume2, Maximize2, Minimize2, Bell,
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

export default function BriefingPage() {
  const { user } = useAuth();
  const name = user?.name?.split(" ")[0] ?? "Officer";
  const role = user?.role ?? "procurement_officer";
  const greeting = getTimeGreeting(name);

  const [showVideo, setShowVideo] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "user"|"ai"; text: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const aiEndRef = useRef<HTMLDivElement>(null);

  // Simulate video playing progress
  useEffect(() => {
    if (!playing || paused) return;
    const timer = setTimeout(() => {
      if (currentTopic < BRIEFING_TOPICS.length - 1) {
        setCurrentTopic(p => p + 1);
      } else {
        setPlaying(false);
      }
    }, 4000);
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

  const urgent = KPI_INDICATORS.filter(k => k.urgent);
  const normal = KPI_INDICATORS.filter(k => !k.urgent);

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-[#0a1628] text-white overflow-hidden">

        {/* Header */}
        <div className="flex-shrink-0 px-5 py-3 border-b border-white/10 flex items-center gap-3 bg-[#0f1f3d]">
          <div className="h-9 w-9 rounded-full ai-logo-gradient ai-logo-glow flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">{greeting}</div>
            <div className="text-xs text-blue-300">AI Executive Briefing · {today}</div>
          </div>
          <div className="flex items-center gap-2">
            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
              className="h-7 px-2 text-xs bg-white/10 border border-white/20 text-white focus:outline-none" style={{ borderRadius: 0 }}>
              <option value="">All Departments</option>
              <option>Ministry of Health</option><option>Ministry of Finance</option>
              <option>Ministry of Transport</option><option>ZIMRA</option>
            </select>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
              className="h-7 px-2 text-xs bg-white/10 border border-white/20 text-white focus:outline-none" style={{ borderRadius: 0 }} />
            <button onClick={() => setShowVideo(v => !v)}
              className="h-7 px-3 text-xs bg-blue-600 text-white font-medium hover:bg-blue-500 appois-glow-on-hover transition-all" style={{ borderRadius: 0 }}>
              {showVideo ? "📊 Briefing Chart" : "▶ AI Video"}
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* VIDEO PANEL */}
          {showVideo && (
            <div className="flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden">
              {!minimized ? (
                <div className="flex-1 bg-[#080d1a] relative overflow-hidden flex flex-col">
                  {/* Cinematic video screen */}
                  <div className="flex-1 relative flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0d2040] to-[#060c1a]">
                    {/* Animated dashboard charts background */}
                    <div className="absolute inset-0 opacity-20" style={{
                      background: "repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(59,130,246,0.1) 49px), repeating-linear-gradient(180deg, transparent, transparent 48px, rgba(59,130,246,0.1) 49px)"
                    }} />
                    {/* Central content */}
                    <div className="z-10 text-center px-8 max-w-2xl">
                      {!playing ? (
                        <>
                          <div className="h-20 w-20 rounded-full ai-logo-gradient ai-logo-glow flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="h-10 w-10 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-2">{greeting}</h2>
                          <p className="text-blue-300 text-sm mb-4">Your Role: <strong className="text-white">{role.replace(/_/g, " ").toUpperCase()}</strong></p>
                          <p className="text-white/70 text-sm mb-6">Click Play to begin your AI-generated executive briefing. The AI assistant will walk you through today's critical indicators, risks, alerts, and your pending tasks.</p>
                          <button onClick={() => setPlaying(true)}
                            className="px-8 py-3 bg-blue-600 text-white font-bold text-base flex items-center gap-3 mx-auto appois-glow-on-hover transition-all"
                            style={{ borderRadius: 0, boxShadow: "0 0 24px 6px rgba(59,130,246,0.4)" }}>
                            <Play className="h-6 w-6" /> Start AI Briefing
                          </button>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="h-14 w-14 rounded-full ai-logo-gradient ai-logo-glow flex items-center justify-center mx-auto animate-pulse">
                            <Sparkles className="h-7 w-7 text-white" />
                          </div>
                          <div className="text-lg font-bold text-white">{BRIEFING_TOPICS[currentTopic].title}</div>
                          <div className="text-blue-300 text-sm">AI is presenting this section…</div>
                          {/* Animated bars */}
                          <div className="flex items-end justify-center gap-1 h-12">
                            {Array.from({ length: 12 }).map((_, i) => (
                              <div key={i} className="bg-blue-500 w-2 transition-all"
                                style={{
                                  height: `${20 + Math.sin(Date.now() / 500 + i) * 20}px`,
                                  opacity: paused ? 0.4 : 1,
                                  animation: paused ? "none" : `${0.3 + i * 0.05}s ease-in-out infinite alternate`,
                                  animationName: "none"
                                }} />
                            ))}
                          </div>
                          <div className="text-white/50 text-xs">Topic {currentTopic + 1} of {BRIEFING_TOPICS.length}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video controls */}
                  <div className="flex-shrink-0 bg-[#0a1628] border-t border-white/10 px-4 py-3">
                    <div className="flex items-center gap-3 mb-2">
                      <button onClick={() => setCurrentTopic(p => Math.max(0, p - 1))} className="text-white/60 hover:text-white transition-colors"><SkipBack className="h-5 w-5" /></button>
                      <button onClick={() => { setPlaying(!playing); setPaused(false); }}
                        className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors appois-glow-on-hover">
                        {playing && !paused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      <button onClick={() => { setPaused(v => !v); }} className="text-white/60 hover:text-white transition-colors">
                        {paused ? <Play className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                      </button>
                      <button onClick={() => setCurrentTopic(p => Math.min(BRIEFING_TOPICS.length - 1, p + 1))} className="text-white/60 hover:text-white transition-colors"><SkipForward className="h-5 w-5" /></button>
                      <div className="flex-1 bg-white/10 h-1 cursor-pointer" style={{ borderRadius: 0 }}>
                        <div className="bg-blue-500 h-full transition-all" style={{ width: `${(currentTopic / (BRIEFING_TOPICS.length - 1)) * 100}%`, borderRadius: 0 }} />
                      </div>
                      <span className="text-white/40 text-xs">{BRIEFING_TOPICS[currentTopic]?.duration}</span>
                      <button className="text-white/60 hover:text-white"><Volume2 className="h-4 w-4" /></button>
                      <button onClick={() => setMinimized(true)} className="text-white/60 hover:text-white"><Minimize2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-shrink-0 bg-[#0a1628] border-b border-white/10 px-4 py-2 flex items-center gap-3">
                  <button onClick={() => { setPlaying(!playing); setPaused(false); }}
                    className="h-7 w-7 bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors" style={{ borderRadius: 0 }}>
                    {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </button>
                  <span className="text-xs text-white/70 flex-1 truncate">{BRIEFING_TOPICS[currentTopic]?.title}</span>
                  <button onClick={() => setMinimized(false)} className="text-white/60 hover:text-white"><Maximize2 className="h-4 w-4" /></button>
                </div>
              )}

              {/* AI Chat */}
              <div className="flex-shrink-0 bg-[#0f1f3d] border-t border-white/10 flex flex-col" style={{ height: "180px" }}>
                <div className="text-xs font-semibold text-blue-300 px-3 py-1.5 border-b border-white/10 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" /> Ask AI Briefing Assistant
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
                  {aiMessages.map((m, i) => (
                    <div key={i} className={`text-xs ${m.role === "user" ? "text-right" : "text-left"}`}>
                      <span className={`inline-block px-2 py-1.5 max-w-[85%] ${m.role === "user" ? "bg-blue-600 text-white" : "bg-white/10 text-white/90"}`} style={{ borderRadius: 0 }}>
                        {m.text}
                      </span>
                    </div>
                  ))}
                  {aiLoading && <div className="text-xs text-blue-400 animate-pulse">AI is thinking…</div>}
                  <div ref={aiEndRef} />
                </div>
                <div className="flex gap-2 px-3 pb-2">
                  <input value={aiQuery} onChange={e => setAiQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAsk()}
                    placeholder="Ask about fraud, budget, tenders, risks…"
                    className="flex-1 h-7 px-2 text-xs bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none" style={{ borderRadius: 0 }} />
                  <button onClick={handleAsk} disabled={!aiQuery.trim() || aiLoading}
                    className="h-7 px-3 bg-blue-600 text-white text-xs disabled:opacity-40 hover:bg-blue-500 flex items-center" style={{ borderRadius: 0 }}>
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BRIEFING CHART — right side (or full screen if no video) */}
          <div className={`flex flex-col ${showVideo ? "w-72 flex-shrink-0" : "flex-1"} border-l border-white/10 bg-[#0a1628] overflow-hidden`}>
            <div className="text-[10px] font-bold text-blue-300 uppercase tracking-wider px-3 py-2 border-b border-white/10 flex items-center gap-1.5">
              <BarChart3 className="h-3 w-3" /> Live Briefing Chart
            </div>

            {/* Critical alerts */}
            <div className="px-3 py-2 border-b border-white/10 space-y-1">
              <div className="text-[9px] font-bold text-red-400 uppercase tracking-wider">🚨 Critical Alerts</div>
              {ALERTS.filter(a => a.type === "critical").map((a, i) => (
                <div key={i} className="text-[10px] text-red-300 flex items-start gap-1.5">
                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{a.msg}</span>
                </div>
              ))}
              {ALERTS.filter(a => a.type === "warning").map((a, i) => (
                <div key={i} className="text-[10px] text-amber-300 flex items-start gap-1.5">
                  <Bell className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{a.msg}</span>
                </div>
              ))}
            </div>

            {/* Auto-scrolling KPI indicators — slides up, pauses on hover */}
            <div className="flex-1 overflow-hidden">
              <KpiScrollTicker theme="dark" height="100%" speed={0.8} showCategory />
            </div>

            {/* Topic list */}
            <div className="flex-shrink-0 border-t border-white/10 p-2 space-y-0.5">
              <div className="text-[9px] font-bold text-blue-300 uppercase tracking-wider mb-1">Briefing Topics</div>
              {BRIEFING_TOPICS.map((t, i) => (
                <button key={t.id} onClick={() => { setCurrentTopic(i); setShowVideo(true); }}
                  className={`w-full text-left flex items-center gap-2 px-2 py-1 text-[10px] transition-colors ${i === currentTopic ? "bg-blue-600 text-white" : "text-white/50 hover:bg-white/10 hover:text-white"}`}
                  style={{ borderRadius: 0 }}>
                  <span className="flex-shrink-0 w-4 text-center">{i === currentTopic ? "▶" : i + 1}</span>
                  <span className="flex-1 truncate">{t.title}</span>
                  <span className="flex-shrink-0 text-white/30">{t.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
