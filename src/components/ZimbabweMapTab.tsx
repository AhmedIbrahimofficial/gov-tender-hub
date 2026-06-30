/**
 * ZimbabweMapTab — interactive procurement data map for Analytics & BI Dashboard.
 * Features: choropleth by spend, heat circles, tender pins, per-province charts.
 * Uses Leaflet + recharts. No API key required.
 */
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { ZW_PROVINCES, spendIntensity, choroColor, type ZWProvince } from "@/lib/zw-provinces-geo";
import { ALL_GIS_PINS } from "@/lib/gis-data";
import { MapPin, BarChart3, PieChart as PieIcon, Activity, Layers, Target } from "lucide-react";

const COLORS = ["#29b8c5","#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#f97316","#ec4899","#64748b","#06b6d4"];
const tt = { contentStyle: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 11 } };

type MapMode = "spend" | "heat" | "pins" | "compliance";

interface Props {
  /** "dark" for BI dashboard, "light" for Analytics */
  theme?: "dark" | "light";
}

export default function ZimbabweMapTab({ theme = "light" }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<{ choropleth?: L.LayerGroup; heat?: L.LayerGroup; pins?: L.LayerGroup }>({});
  const [mode, setMode] = useState<MapMode>("spend");
  const [selected, setSelected] = useState<ZWProvince | null>(null);
  const [chartView, setChartView] = useState<"bar" | "pie" | "radar">("bar");
  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-[#1c1f26] border-white/8 text-white" : "bg-white border-black/8 text-black";
  const subText = isDark ? "text-white/50" : "text-black/50";

  // ── Init Leaflet ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [-19.0, 29.8],
      zoom: 6,
      zoomControl: true,
      attributionControl: false,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OSM contributors", maxZoom: 18,
    }).addTo(map);
    mapRef.current = map;
    layersRef.current.choropleth = L.layerGroup().addTo(map);
    layersRef.current.heat = L.layerGroup().addTo(map);
    layersRef.current.pins = L.layerGroup().addTo(map);
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // ── Redraw overlays when mode changes ───────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    layersRef.current.choropleth?.clearLayers();
    layersRef.current.heat?.clearLayers();
    layersRef.current.pins?.clearLayers();

    if (mode === "spend" || mode === "compliance") {
      ZW_PROVINCES.forEach(p => {
        const intensity = mode === "spend" ? spendIntensity(p) : p.compliance / 100;
        const fill = mode === "spend" ? choroColor(intensity)
          : `hsl(${Math.round(120 * intensity)}, 60%, 45%)`;
        const circle = L.circle([p.lat, p.lng], {
          radius: p.radiusKm * 1000,
          fillColor: fill, fillOpacity: 0.55,
          color: fill, weight: 1.5, opacity: 0.8,
        });
        circle.bindTooltip(
          `<b>${p.name}</b><br/>` +
          (mode === "spend"
            ? `Spend: <b>USD ${p.tenderSpendM}M</b><br/>Tenders: ${p.activeTenders}`
            : `Compliance: <b>${p.compliance}%</b>`),
          { sticky: true }
        );
        circle.on("click", () => setSelected(p));
        circle.addTo(layersRef.current.choropleth!);
        // Province label
        L.marker([p.lat, p.lng], {
          icon: L.divIcon({
            html: `<div style="font-size:9px;font-weight:700;color:white;text-shadow:0 0 3px #000;white-space:nowrap;">${p.name}</div>`,
            className: "", iconAnchor: [30, 6],
          }),
        }).addTo(layersRef.current.choropleth!);
      });
    }

    if (mode === "heat") {
      ZW_PROVINCES.forEach(p => {
        const r = 8000 + p.tenderSpendM * 200;
        [r * 1.8, r * 1.2, r * 0.7].forEach((radius, i) => {
          const opacity = [0.15, 0.28, 0.48][i];
          const color = ["#ef4444","#f97316","#fbbf24"][i];
          L.circle([p.lat, p.lng], { radius, fillColor: color, fillOpacity: opacity, color: "transparent", weight: 0 })
            .addTo(layersRef.current.heat!);
        });
        L.marker([p.lat, p.lng], {
          icon: L.divIcon({
            html: `<div style="background:#1c1f26cc;color:white;font-size:9px;font-weight:700;padding:2px 5px;border-radius:4px;white-space:nowrap;">${p.name}<br/>USD ${p.tenderSpendM}M</div>`,
            className: "", iconAnchor: [30, 8],
          }),
        }).addTo(layersRef.current.heat!);
      });
    }

    if (mode === "pins") {
      ALL_GIS_PINS.forEach(pin => {
        const clr = pin.tone === "green" ? "#16a34a" : pin.tone === "red" ? "#dc2626" : pin.tone === "amber" ? "#d97706" : pin.tone === "violet" ? "#7c3aed" : "#2563eb";
        const icon = L.divIcon({
          html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" width="20" height="26">
            <circle cx="12" cy="10" r="7" fill="${clr}" stroke="white" stroke-width="1.5"/>
            <path d="M12 28 L12 17" stroke="${clr}" stroke-width="2"/>
          </svg>`,
          className: "", iconSize: [20, 26], iconAnchor: [10, 26],
        });
        L.marker([pin.lat, pin.lng], { icon })
          .bindTooltip(`<b>${pin.id}</b><br/>${pin.title}<br/><i>${pin.status}</i>`, { sticky: true })
          .addTo(layersRef.current.pins!);
      });
    }
  }, [mode]);


  // ── Fly to selected province ─────────────────────────────────────────
  useEffect(() => {
    if (selected && mapRef.current) {
      mapRef.current.flyTo([selected.lat, selected.lng], 8, { animate: true, duration: 0.8 });
    }
  }, [selected]);

  const sorted = [...ZW_PROVINCES].sort((a, b) => b.tenderSpendM - a.tenderSpendM);

  return (
    <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
      {/* ── Toolbar ───────────────────────────────────────────────── */}
      <div className={`flex items-center gap-2 px-4 py-2.5 border-b flex-wrap ${isDark ? "border-white/8 bg-white/3" : "border-black/6 bg-gray-50"}`}>
        <div className="flex items-center gap-1.5">
          <MapPin className={`h-4 w-4 ${isDark ? "text-[#29b8c5]" : "text-blue-600"}`} />
          <span className={`text-sm font-bold ${isDark ? "text-white" : "text-black"}`}>Zimbabwe Procurement Map</span>
        </div>
        <div className="flex gap-1 ml-auto flex-wrap">
          {([
            { key: "spend",      label: "Spend Choropleth", icon: BarChart3 },
            { key: "heat",       label: "Heat Map",          icon: Activity  },
            { key: "pins",       label: "Tender Pins",       icon: MapPin    },
            { key: "compliance", label: "Compliance",        icon: Target    },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setMode(key)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                mode === key
                  ? isDark ? "bg-[#29b8c5] text-black" : "bg-blue-600 text-white"
                  : isDark ? "bg-white/8 text-white/70 hover:bg-white/15" : "bg-white border border-black/10 text-black/60 hover:bg-gray-100"
              }`}>
              <Icon className="h-3 w-3" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Map + Side panel ──────────────────────────────────────── */}
      <div className="flex" style={{ minHeight: 480 }}>
        {/* Map */}
        <div className="flex-1 min-w-0" style={{ minHeight: 480 }}>
          <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: 480 }} />
        </div>

        {/* Province detail panel */}
        {selected && (
          <div className={`w-72 flex-shrink-0 border-l overflow-y-auto flex flex-col ${isDark ? "border-white/8 bg-[#161a21]" : "border-black/8 bg-white"}`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? "border-white/8" : "border-black/6"}`}>
              <span className={`text-sm font-bold ${isDark ? "text-white" : "text-black"}`}>{selected.name}</span>
              <button onClick={() => setSelected(null)} className={`text-xs px-2 py-0.5 rounded ${isDark ? "bg-white/10 text-white/60" : "bg-black/5 text-black/50"}`}>✕</button>
            </div>
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-2 p-3">
              {[
                { label: "Tender Spend",    value: `USD ${selected.tenderSpendM}M` },
                { label: "Active Tenders",  value: selected.activeTenders },
                { label: "Active Projects", value: selected.activeProjects },
                { label: "Awarded",         value: `USD ${selected.awardedM}M` },
                { label: "Compliance",      value: `${selected.compliance}%` },
                { label: "Population",      value: selected.population.toLocaleString() },
              ].map(kpi => (
                <div key={kpi.label} className={`rounded-xl p-2.5 ${isDark ? "bg-white/5" : "bg-gray-50 border border-black/5"}`}>
                  <div className={`text-[9px] uppercase tracking-wide ${subText}`}>{kpi.label}</div>
                  <div className={`text-sm font-bold mt-0.5 ${isDark ? "text-[#29b8c5]" : "text-blue-700"}`}>{kpi.value}</div>
                </div>
              ))}
            </div>
            {/* Chart switcher */}
            <div className={`flex gap-1 px-3 pb-2`}>
              {([["bar","Bar",BarChart3],["pie","Pie",PieIcon],["radar","Radar",Layers]] as const).map(([v, lbl, Icon]) => (
                <button key={v} onClick={() => setChartView(v)}
                  className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                    chartView === v
                      ? isDark ? "bg-[#29b8c5] text-black" : "bg-blue-600 text-white"
                      : isDark ? "bg-white/8 text-white/60" : "bg-gray-100 text-black/50"
                  }`}>
                  <Icon className="h-3 w-3" />{lbl}
                </button>
              ))}
            </div>
            {/* Chart */}
            <div className="px-3 pb-4">
              {chartView === "bar" && (
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "Spend",    value: selected.tenderSpendM },
                      { name: "Awarded",  value: selected.awardedM },
                      { name: "Tenders",  value: selected.activeTenders },
                      { name: "Projects", value: selected.activeProjects },
                    ]} margin={{ left: -20 }}>
                      <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} stroke={isDark?"#ffffff60":"#00000060"} />
                      <YAxis fontSize={9} tickLine={false} axisLine={false} stroke={isDark?"#ffffff60":"#00000060"} />
                      <Tooltip {...tt} />
                      <Bar dataKey="value" radius={[3,3,0,0]}>
                        {["#29b8c5","#10b981","#3b82f6","#f59e0b"].map((c,i)=>
                          <Cell key={i} fill={c} />
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {chartView === "pie" && (
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[
                        { name: "Awarded", value: selected.awardedM },
                        { name: "Pending", value: selected.tenderSpendM - selected.awardedM },
                      ]} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                        <Cell fill="#29b8c5" /><Cell fill={isDark?"#ffffff20":"#e2e8f0"} />
                      </Pie>
                      <Tooltip {...tt} formatter={(v: number) => [`USD ${v}M`]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className={`text-center text-[10px] ${subText}`}>Awarded vs Pending</div>
                </div>
              )}
              {chartView === "radar" && (
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { axis: "Spend",      value: Math.round(spendIntensity(selected) * 100) },
                      { axis: "Compliance", value: selected.compliance },
                      { axis: "Tenders",    value: Math.round(selected.activeTenders / 0.48) },
                      { axis: "Projects",   value: Math.round(selected.activeProjects * 4.5) },
                      { axis: "Awards",     value: Math.round(selected.awardedM / 3.12) },
                    ]}>
                      <PolarGrid stroke={isDark?"#ffffff15":"#00000010"} />
                      <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9, fill: isDark?"#ffffff80":"#00000080" }} />
                      <Radar name={selected.name} dataKey="value" stroke="#29b8c5" fill="#29b8c5" fillOpacity={0.35} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>


      {/* ── Province rankings table ───────────────────────────────── */}
      <div className={`border-t ${isDark ? "border-white/8" : "border-black/6"}`}>
        <div className={`px-4 py-2 flex items-center justify-between ${isDark ? "bg-white/3" : "bg-gray-50"}`}>
          <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? "text-white/60" : "text-black/50"}`}>Province Rankings — Tender Spend</span>
          <span className={`text-[10px] ${subText}`}>Click row to focus map</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={isDark ? "border-b border-white/8 text-white/40" : "border-b border-black/6 text-black/40"}>
                <th className="text-left px-4 py-2 font-medium">#</th>
                <th className="text-left px-4 py-2 font-medium">Province</th>
                <th className="text-right px-4 py-2 font-medium">Spend (M)</th>
                <th className="text-right px-4 py-2 font-medium">Tenders</th>
                <th className="text-right px-4 py-2 font-medium">Projects</th>
                <th className="text-right px-4 py-2 font-medium">Compliance</th>
                <th className="px-4 py-2 font-medium">Bar</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => {
                const barW = Math.round((p.tenderSpendM / sorted[0].tenderSpendM) * 100);
                const isSelected = selected?.id === p.id;
                return (
                  <tr key={p.id}
                    onClick={() => setSelected(p)}
                    className={`cursor-pointer border-b transition-colors ${
                      isDark
                        ? isSelected ? "bg-[#29b8c5]/15 border-white/8" : "border-white/5 hover:bg-white/5"
                        : isSelected ? "bg-blue-50 border-black/6" : "border-black/4 hover:bg-gray-50"
                    }`}>
                    <td className={`px-4 py-2.5 font-bold ${i < 3 ? "text-[#29b8c5]" : isDark ? "text-white/30" : "text-black/30"}`}>{i+1}</td>
                    <td className={`px-4 py-2.5 font-medium ${isDark ? "text-white" : "text-black"}`}>{p.name}</td>
                    <td className={`px-4 py-2.5 text-right font-bold ${isDark ? "text-[#29b8c5]" : "text-blue-700"}`}>USD {p.tenderSpendM}M</td>
                    <td className={`px-4 py-2.5 text-right ${isDark ? "text-white/70" : "text-black/70"}`}>{p.activeTenders}</td>
                    <td className={`px-4 py-2.5 text-right ${isDark ? "text-white/70" : "text-black/70"}`}>{p.activeProjects}</td>
                    <td className={`px-4 py-2.5 text-right font-semibold ${
                      p.compliance >= 90 ? "text-emerald-500" : p.compliance >= 80 ? "text-amber-500" : "text-red-500"
                    }`}>{p.compliance}%</td>
                    <td className="px-4 py-2.5 w-28">
                      <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
                        <div className="h-full rounded-full bg-[#29b8c5] transition-all" style={{ width: `${barW}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom summary charts ────────────────────────────────── */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-t ${isDark ? "border-white/8" : "border-black/6"}`}>
        {/* Spend by province bar */}
        <div className={`rounded-xl p-3 border ${isDark ? "bg-white/3 border-white/8" : "bg-gray-50 border-black/6"}`}>
          <div className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${subText}`}>Spend by Province (USD M)</div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sorted} margin={{ left: -20 }}>
                <XAxis dataKey="name" fontSize={8} tickLine={false} axisLine={false}
                  stroke={isDark?"#ffffff50":"#00000050"}
                  tickFormatter={n => n.split(" ")[0].substring(0,6)} />
                <YAxis fontSize={8} tickLine={false} axisLine={false} stroke={isDark?"#ffffff50":"#00000050"} />
                <Tooltip {...tt} formatter={(v: number) => [`USD ${v}M`, "Spend"]} />
                <Bar dataKey="tenderSpendM" radius={[3,3,0,0]}>
                  {sorted.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tenders per province pie */}
        <div className={`rounded-xl p-3 border ${isDark ? "bg-white/3 border-white/8" : "bg-gray-50 border-black/6"}`}>
          <div className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${subText}`}>Tenders Distribution by Province</div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sorted} dataKey="activeTenders" nameKey="name" innerRadius={35} outerRadius={65} paddingAngle={2}>
                  {sorted.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip {...tt} formatter={(v: number) => [v, "Tenders"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance by province */}
        <div className={`rounded-xl p-3 border ${isDark ? "bg-white/3 border-white/8" : "bg-gray-50 border-black/6"}`}>
          <div className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${subText}`}>Compliance Score by Province</div>
          <div className="space-y-1.5">
            {sorted.map(p => (
              <div key={p.id} className="flex items-center gap-2">
                <span className={`text-[9px] w-20 truncate ${isDark?"text-white/60":"text-black/60"}`}>{p.name.split(" ")[0]}</span>
                <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark?"bg-white/10":"bg-gray-200"}`}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${p.compliance}%`,
                    background: p.compliance >= 90 ? "#10b981" : p.compliance >= 80 ? "#f59e0b" : "#ef4444"
                  }} />
                </div>
                <span className={`text-[9px] font-bold w-7 text-right ${
                  p.compliance >= 90 ? "text-emerald-500" : p.compliance >= 80 ? "text-amber-500" : "text-red-500"
                }`}>{p.compliance}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={`flex items-center gap-4 px-4 py-2.5 border-t flex-wrap ${isDark ? "border-white/8 bg-white/2" : "border-black/5 bg-gray-50"}`}>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${subText}`}>Legend:</span>
        {mode === "spend" && <>
          <span className="flex items-center gap-1 text-[10px]"><span className="w-3 h-3 rounded-full bg-[rgb(0,80,140)] inline-block"/><span className={subText}>High spend</span></span>
          <span className="flex items-center gap-1 text-[10px]"><span className="w-3 h-3 rounded-full bg-[rgb(173,216,230)] inline-block"/><span className={subText}>Low spend</span></span>
        </>}
        {mode === "heat" && <>
          <span className="flex items-center gap-1 text-[10px]"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"/><span className={subText}>High intensity</span></span>
          <span className="flex items-center gap-1 text-[10px]"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"/><span className={subText}>Medium</span></span>
        </>}
        {mode === "pins" && <>
          <span className="flex items-center gap-1 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"/><span className={subText}>Active</span></span>
          <span className="flex items-center gap-1 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"/><span className={subText}>On Track</span></span>
          <span className="flex items-center gap-1 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"/><span className={subText}>At Risk</span></span>
          <span className="flex items-center gap-1 text-[10px]"><span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"/><span className={subText}>Troubled</span></span>
        </>}
        {mode === "compliance" && <>
          <span className="flex items-center gap-1 text-[10px]"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"/><span className={subText}>≥90% compliant</span></span>
          <span className="flex items-center gap-1 text-[10px]"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"/><span className={subText}>80–89%</span></span>
          <span className="flex items-center gap-1 text-[10px]"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"/><span className={subText}>&lt;80%</span></span>
        </>}
        <span className={`ml-auto text-[10px] ${subText}`}>Click province circle or table row to drill down</span>
      </div>
    </div>
  );
}
