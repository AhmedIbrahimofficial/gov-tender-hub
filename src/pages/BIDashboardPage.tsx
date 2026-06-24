import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
  ComposedChart,
} from "recharts";
import {
  BarChart3, TrendingUp, Users, DollarSign, Activity, Globe, ShoppingCart,
  Download, Filter, Layers, Building2,
} from "lucide-react";

// ── Colour palette matching Senstar orange + blue theme ──────────────────────
const C = {
  orange:  "#f97316",
  amber:   "#f59e0b",
  blue:    "#3b82f6",
  teal:    "#14b8a6",
  green:   "#10b981",
  violet:  "#8b5cf6",
  red:     "#ef4444",
  slate:   "#64748b",
  gold:    "#eab308",
};
const PIE_COLORS = [C.orange, C.blue, C.teal, C.green, C.violet, C.amber, C.red, C.slate, C.gold];

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  "Business Analysis",
  "Performance Report",
  "Finance Analysis",
  "Sales Analysis",
  "Stakeholders",
  "Incubatees",
  "Cohort Analysis",
  "Mentorship",
  "Investment",
  "Budget",
  "Services",
  "Executive Summary",
] as const;
type Tab = typeof TABS[number];

// ── Shared helpers ────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold text-black mb-3 mt-5 first:mt-0">{children}</h2>;
}

function StatBox({ label, value, sub, color = "bg-orange-500" }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className={`${color} text-white rounded-xl p-4 flex flex-col items-center justify-center text-center`}>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs font-semibold opacity-90 mt-0.5 uppercase tracking-wider">{label}</div>
      {sub && <div className="text-[10px] opacity-70 mt-0.5">{sub}</div>}
    </div>
  );
}

const fmtM = (v: number, dec = 2) => `${(v / 1e6).toFixed(dec)}M`;

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1 — BUSINESS ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────
const languageData = [
  { lang: "Spanish",      orders: 431709, profit: 8896930 },
  { lang: "Sign Language",orders: 138854, profit: 5349023 },
  { lang: "English",      orders: 16256,  profit: 4119516 },
  { lang: "Other",        orders: 11769,  profit: 3349761 },
  { lang: "Arabic",       orders: 56624,  profit: 1790062 },
  { lang: "Vietnamese",   orders: 62925,  profit: 1707077 },
  { lang: "Farsi",        orders: 23496,  profit: 1046906 },
  { lang: "Korean",       orders: 16624,  profit:  596095 },
  { lang: "Mandarin",     orders: 18668,  profit:  544239 },
  { lang: "Burmese",      orders: 6038,   profit:  422412 },
  { lang: "Cantonese",    orders: 17876,  profit:  347662 },
  { lang: "Russian",      orders: 15269,  profit:  327379 },
  { lang: "Nepali",       orders: 3741,   profit:  278016 },
  { lang: "Amharic",      orders: 3206,   profit:  180676 },
  { lang: "Tagalog",      orders: 6232,   profit:  175841 },
  { lang: "Dari",         orders: 2855,   profit:  140796 },
  { lang: "Portuguese",   orders: 3168,   profit:  140432 },
  { lang: "French",       orders: 2720,   profit:  133159 },
  { lang: "Somali",       orders: 4522,   profit:  115172 },
  { lang: "Laotian",      orders: 7393,   profit:   95855 },
];

const grossProfitByCompany = [
  { name: "IUG-SD",    value: 25550000 },
  { name: "ACD",       value:  3420000 },
  { name: "ASIT",      value:  2080000 },
  { name: "Globelink", value:  1290000 },
];

const salesVolumeYoY = [
  { year: "2006", vol: 25097 }, { year: "2007", vol: 26120 }, { year: "2008", vol: 37527 },
  { year: "2009", vol: 42358 }, { year: "2010", vol: 49531 }, { year: "2011", vol: 60575 },
  { year: "2012", vol: 58320 }, { year: "2013", vol: 61513 }, { year: "2014", vol: 70601 },
  { year: "2015", vol: 57251 }, { year: "2016", vol: 62950 }, { year: "2017", vol: 70848 },
  { year: "2018", vol: 76354 }, { year: "2019", vol: 76015 }, { year: "2020", vol: 56787 },
  { year: "2021", vol: 59392 }, { year: "2022", vol: 18160 }, { year: "2023", vol: 9 },
];

const grossProfitYoY = [
  { year: "2015", gp: 3100000 }, { year: "2016", gp: 4130000 }, { year: "2017", gp: 4490000 },
  { year: "2018", gp: 5300000 }, { year: "2019", gp: 4850000 }, { year: "2020", gp: 3720000 },
  { year: "2021", gp: 4420000 }, { year: "2022", gp: 940000  },
];

const salesCount2022 = [
  { month: "Jan", cnt: 4537 }, { month: "Feb", cnt: 15 }, { month: "Mar", cnt: 6151 },
  { month: "Apr", cnt: 2201 }, { month: "May", cnt: 341 }, { month: "Jun", cnt: 107 },
  { month: "Jul", cnt: 35   }, { month: "Aug", cnt: 24 }, { month: "Sep", cnt: 23 },
  { month: "Oct", cnt: 19   }, { month: "Nov", cnt: 15 }, { month: "Dec", cnt: 12 },
];

const profit2022 = [
  { month: "Jan", gp: 310000 }, { month: "Feb", gp: 360000 },
  { month: "Mar", gp: 270000 }, { month: "Dec", gp: 0 },
];

function BusinessAnalysisTab({ onChartClick }: { onChartClick?: (data: Record<string, unknown>, cat: string) => void }) {
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="Total Orders"  value="909,408"        color="bg-orange-500" />
        <StatBox label="Total Profit"  value="USD 32.35M"     color="bg-blue-600"   />
        <StatBox label="Languages"     value="40+"            color="bg-teal-600"   />
        <StatBox label="Companies"     value="4"              color="bg-amber-500"  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top 20 products by gross profit — horizontal bar */}
        <Card className="lg:col-span-2">
          <CardHeader title="Top 20 Products — Gross Profit" subtitle="Language services ranked by gross profit" />
          <div className="p-4 h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...languageData].sort((a,b) => b.profit - a.profit).slice(0,20)}
                layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false}
                  tickFormatter={v => `${(v/1e6).toFixed(1)}M`} />
                <YAxis type="category" dataKey="lang" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} width={72} />
                <Tooltip contentStyle={{ background:"white", border:"1px solid #e2e8f0", borderRadius:8, fontSize:12 }}
                  formatter={(v:number) => [`USD ${(v/1e6).toFixed(2)}M`, "Gross Profit"]} />
                <Bar dataKey="profit" fill={C.orange} radius={[0,3,3,0]} name="Gross Profit"
                  onClick={(d: Record<string, unknown>) => onChartClick?.(d, "gross-profit")} style={{ cursor: "pointer" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Gross profit by company — donut */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Gross Profit by Company" />
            <div className="p-4 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={grossProfitByCompany} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                    dataKey="value" paddingAngle={2}
                    onClick={(d: Record<string, unknown>) => onChartClick?.(d, "company-profit")} style={{ cursor: "pointer" }}>
                    {grossProfitByCompany.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background:"white", border:"1px solid #e2e8f0", borderRadius:8, fontSize:11 }}
                    formatter={(v:number) => [`USD ${(v/1e6).toFixed(2)}M`, ""]} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize:10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <CardHeader title="2022 Gross Profit" subtitle="Monthly (Jan–Mar)" />
            <div className="p-4 h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profit2022}>
                  <defs>
                    <linearGradient id="gpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.orange} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={C.orange} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false}
                    tickFormatter={v => `${(v/1e6).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ background:"white", border:"1px solid #e2e8f0", borderRadius:8, fontSize:11 }}
                    formatter={(v:number) => [`USD ${(v/1e6).toFixed(2)}M`, "GP"]} />
                  <Area type="monotone" dataKey="gp" stroke={C.orange} strokeWidth={2} fill="url(#gpGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales unit volume YoY */}
        <Card>
          <CardHeader title="Sales Unit Volume — Year on Year" subtitle="2006–2023 all companies" />
          <div className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesVolumeYoY}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                  tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                <Tooltip contentStyle={{ background:"white", border:"1px solid #e2e8f0", borderRadius:8, fontSize:12 }} />
                <Bar dataKey="vol" fill={C.orange} radius={[3,3,0,0]} name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Gross profit YoY */}
        <Card>
          <CardHeader title="Year on Year Gross Profit" subtitle="2015–2022" />
          <div className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={grossProfitYoY}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                  tickFormatter={v => `${(v/1e6).toFixed(1)}M`} />
                <Tooltip contentStyle={{ background:"white", border:"1px solid #e2e8f0", borderRadius:8, fontSize:12 }}
                  formatter={(v:number) => [`USD ${(v/1e6).toFixed(2)}M`, "GP"]} />
                <Bar dataKey="gp" fill={C.blue} radius={[3,3,0,0]} name="Gross Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 2022 monthly orders */}
      <Card>
        <CardHeader title="2022 Sales Units Count — Month Wise" subtitle="All products, all companies" />
        <div className="p-4 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesCount2022}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background:"white", border:"1px solid #e2e8f0", borderRadius:8, fontSize:12 }} />
              <Bar dataKey="cnt" fill={C.orange} radius={[3,3,0,0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Language table */}
      <Card>
        <CardHeader title="Top Products — Orders & Profit" subtitle="Ranked by gross profit" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-black/10">
                {["Language","No. of Orders","Gross Profit (USD)"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-black/50 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {languageData.map(r => (
                <tr key={r.lang} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{r.lang}</td>
                  <td className="px-4 py-2">{r.orders.toLocaleString()}</td>
                  <td className="px-4 py-2 font-semibold">{r.profit.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0})}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="px-4 py-2">Total</td>
                <td className="px-4 py-2">909,408</td>
                <td className="px-4 py-2 text-orange-600">$32,348,273</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 — PERFORMANCE REPORT
// ─────────────────────────────────────────────────────────────────────────────
const salesByCompany = [
  { name: "IUG-SD",    value: 746115, pct: 82.04 },
  { name: "ASIT",      value: 73330,  pct: 8.06  },
  { name: "ACD",       value: 49220,  pct: 5.41  },
  { name: "Globelink", value: 40743,  pct: 4.48  },
];

const salesByStage = [
  { stage: "INVOICED",      cnt: 782005 },
  { stage: "CANCELLED",     cnt: 122315 },
  { stage: "SCHEDULED",     cnt: 215721 },
  { stage: "UNSCHEDULED",   cnt: 327623 },
  { stage: "UNBILLED",      cnt: 151 },
  { stage: "REJECTED",      cnt: 29800 },
];

const cancelledByReason = [
  { reason: "Requestor Cancelled", cnt: 67471 },
  { reason: "No Interpreter",      cnt: 32469 },
  { reason: "Duplicate Appt",      cnt: 16519 },
  { reason: "Generic",             cnt: 2744  },
  { reason: "No Authorization",    cnt: 1262  },
  { reason: "Requester Cancelled", cnt: 1135  },
  { reason: "Import Error",        cnt: 287   },
  { reason: "Late Cancel",         cnt: 57    },
  { reason: "No Show",             cnt: 22    },
];

const cancelledYoY = [
  { year:"2006",cnt:4070},{year:"2007",cnt:4275},{year:"2008",cnt:5026},
  {year:"2009",cnt:5999},{year:"2010",cnt:6708},{year:"2011",cnt:8228},
  {year:"2012",cnt:7300},{year:"2013",cnt:6900},{year:"2014",cnt:7733},
  {year:"2015",cnt:8621},{year:"2016",cnt:8532},{year:"2017",cnt:7709},
  {year:"2018",cnt:8951},{year:"2019",cnt:9845},{year:"2020",cnt:8944},
  {year:"2021",cnt:9977},{year:"2022",cnt:3494},{year:"2023",cnt:3},
];

const dateWiseOrders2022 = Array.from({length:60},(_,i)=>({
  day: i+1,
  cnt: i < 10 ? 268+Math.floor(Math.sin(i)*30) :
       i < 20 ? 286+Math.floor(Math.cos(i)*20) :
       i < 30 ? 260+Math.floor(Math.sin(i)*40) : 100-i,
}));

function PerformanceReportTab() {
  return (
    <div className="space-y-4">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatBox label="Orders Served"      value="909,411" color="bg-orange-500" />
        <StatBox label="Customer Served"    value="25,193"  color="bg-orange-500" />
        <StatBox label="Interpreter Onboard"value="29,800"  color="bg-orange-500" />
        <StatBox label="Translator Onboard" value="1,637"   color="bg-orange-500" />
        <StatBox label="Products Offered"   value="1,436"   color="bg-orange-500" />
        <StatBox label="Location Covered"   value="77,286"  color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sales orders by company */}
        <Card>
          <CardHeader title="Sales Orders by Company" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={salesByCompany} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" paddingAngle={2}>
                  {salesByCompany.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[v.toLocaleString(),"Orders"]} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Assignment count by type */}
        <Card>
          <CardHeader title="Assignment Count by Type" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{name:"Language",value:891718},{name:"Translation",value:17690}]}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  <Cell fill={C.orange} /><Cell fill={C.blue} />
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[v.toLocaleString(),""]} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Count by purpose */}
        <Card>
          <CardHeader title="Count by Purpose" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{name:"Normal",value:441600},{name:"Medical",value:406391},{name:"Other",value:38235}]}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  <Cell fill={C.orange} /><Cell fill={C.teal} /><Cell fill={C.blue} />
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[v.toLocaleString(),""]} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Count by schedule type */}
        <Card>
          <CardHeader title="Count by Schedule Type" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{type:"Onsite",cnt:898891},{type:"Online",cnt:6070},{type:"Phone",cnt:2497},{type:"Other",cnt:1950}]}
                layout="vertical">
                <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false}
                  tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}K`:v} />
                <YAxis type="category" dataKey="type" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} width={45} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="cnt" fill={C.orange} radius={[0,3,3,0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Year on year orders */}
      <Card>
        <CardHeader title="Year on Year Sales Orders Count" subtitle="2006–2023 all companies" />
        <div className="p-4 h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesVolumeYoY}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}K`:v} />
              <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12}} />
              <Bar dataKey="vol" fill={C.orange} radius={[3,3,0,0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Sales count by stage */}
      <Card>
        <CardHeader title="Sales Count by Stage" subtitle="All companies, all years" />
        <div className="p-4 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesByStage}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="stage" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}K`:v} />
              <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:12}} />
              <Bar dataKey="cnt" fill={C.blue} radius={[3,3,0,0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cancelled orders count by company */}
        <Card>
          <CardHeader title="Cancelled Orders — by Company" />
          <div className="p-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{name:"IUG-SD",value:99715},{name:"ACD",value:9364},{name:"ASIT",value:8032}]}
                  cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                  dataKey="value" paddingAngle={2}>
                  <Cell fill={C.orange} /><Cell fill={C.blue} /><Cell fill={C.gold} />
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[v.toLocaleString(),""]} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Cancelled YoY */}
        <Card>
          <CardHeader title="Cancelled Orders — Year on Year" />
          <div className="p-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cancelledYoY}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false}
                  tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}K`:v} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="cnt" fill={C.amber} radius={[3,3,0,0]} name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Cancelled by reason */}
        <Card>
          <CardHeader title="Cancelled Orders — by Reason" />
          <div className="p-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cancelledByReason} layout="vertical">
                <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false}
                  tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}K`:v} />
                <YAxis type="category" dataKey="reason" stroke="#94a3b8" fontSize={7} tickLine={false} axisLine={false} width={88} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="cnt" fill={C.red} radius={[0,3,3,0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3 — FINANCE ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────
const invoicedBilledYoY = [
  {year:"2015",inv:3950000,billed:1650000},{year:"2016",inv:8700000,billed:7760000},
  {year:"2017",inv:6750000,billed:6600000},{year:"2018",inv:13700000,billed:12170000},
  {year:"2019",inv:10470000,billed:11100000},{year:"2020",inv:13560000,billed:10000000},
  {year:"2021",inv:5870000,billed:8400000},{year:"2022",inv:7060000,billed:2580000},
];

const profitByCustomer = [
  {cust:"Serco 15193",       profit:2020000},
  {cust:"Eastern LA Reg",    profit:1440000},
  {cust:"Cobb DFCS",         profit:1370000},
  {cust:"Kaiser Permanente", profit:1220000},
  {cust:"Gwinnett DFCS",     profit: 850000},
  {cust:"Monarch Healthcare",profit: 690000},
  {cust:"Dekalb DFCS",       profit: 630000},
  {cust:"Sharp Memorial",    profit: 590000},
  {cust:"UCSD Interpreting", profit: 450000},
  {cust:"DHS US CBP",        profit: 560000},
  {cust:"FAU Florida",       profit: 400000},
  {cust:"Riverside UHCS",    profit: 360000},
];

const profitableProducts = [
  {lang:"Spanish",     profit:8890000},{lang:"Sign Language",profit:5350000},
  {lang:"Farsi",       profit:4120000},{lang:"English",      profit:3370000},
  {lang:"Arabic",      profit:1790000},{lang:"Vietnamese",   profit:1710000},
  {lang:"Russian",     profit:1050000},{lang:"Korean",       profit: 600000},
  {lang:"Mandarin",    profit: 540000},{lang:"Laotian",      profit: 340000},
  {lang:"Cantonese",   profit: 420000},{lang:"Nepali",       profit: 280000},
  {lang:"Tagalog",     profit: 180000},{lang:"French",       profit: 130000},
  {lang:"Burmese",     profit: 120000},
];

const receivablePayable = [
  {month:"Jan",recv:5100000,pay:4200000},{month:"Feb",recv:4800000,pay:3900000},
  {month:"Mar",recv:3200000,pay:2800000},{month:"Apr",recv:2100000,pay:1800000},
  {month:"May",recv:1400000,pay:1200000},{month:"Jun",recv: 900000,pay: 800000},
  {month:"Jul",recv: 600000,pay: 550000},{month:"Aug",recv: 400000,pay: 380000},
];

function FinanceAnalysisTab({ onChartClick }: { onChartClick?: (data: Record<string, unknown>, cat: string) => void }) {
  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatBox label="Customers Served" value="25,193"         color="bg-orange-500" />
        <StatBox label="Languages Served" value="1,436"          color="bg-orange-500" />
        <StatBox label="Amount Invoiced"  value="USD 82.95M"     color="bg-orange-500" />
        <StatBox label="Amount Paid"      value="USD 50.61M"     color="bg-orange-500" />
        <StatBox label="Gross Profit"     value="USD 32.34M"     color="bg-orange-500" />
        <StatBox label="Locations Covered"value="77,286"         color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Invoiced by company */}
        <Card>
          <CardHeader title="Invoiced by Company" />
          <div className="p-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{name:"IUG-SD",value:65770000},{name:"ACD",value:11180000},{name:"Globelink",value:3690000}]}
                  cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={2}>
                  {[C.orange,C.blue,C.teal].map((c,i)=><Cell key={i} fill={c}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[`USD ${(v/1e6).toFixed(2)}M`,""]} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bills by company */}
        <Card>
          <CardHeader title="Bills by Company" />
          <div className="p-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{name:"IUG-SD",value:40160000},{name:"ACD",value:7760000},{name:"Globelink",value:1610000}]}
                  cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={2}>
                  {[C.orange,C.blue,C.teal].map((c,i)=><Cell key={i} fill={c}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[`USD ${(v/1e6).toFixed(2)}M`,""]} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* GP by company */}
        <Card>
          <CardHeader title="Gross Profit by Company" />
          <div className="p-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={grossProfitByCompany} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={2}>
                  {grossProfitByCompany.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[`USD ${(v/1e6).toFixed(2)}M`,""]} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Invoiced & Billed YoY */}
        <Card>
          <CardHeader title="Year on Year Invoiced & Billed Amount" subtitle="2015–2022" />
          <div className="p-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={invoicedBilledYoY}>
                <defs>
                  <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.orange} stopOpacity={0.3}/>
                    <stop offset="100%" stopColor={C.orange} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="billGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.blue} stopOpacity={0.2}/>
                    <stop offset="100%" stopColor={C.blue} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                  tickFormatter={v=>`${(v/1e6).toFixed(0)}M`} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[`USD ${(v/1e6).toFixed(2)}M`,""]} />
                <Legend wrapperStyle={{fontSize:10}} />
                <Area type="monotone" dataKey="inv" stroke={C.orange} strokeWidth={2} fill="url(#invGrad)" name="Invoiced" />
                <Area type="monotone" dataKey="billed" stroke={C.blue} strokeWidth={2} fill="url(#billGrad)" name="Billed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* GP YoY */}
        <Card>
          <CardHeader title="Year on Year Gross Profit" subtitle="2015–2022" />
          <div className="p-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={grossProfitYoY}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                  tickFormatter={v=>`${(v/1e6).toFixed(1)}M`} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[`USD ${(v/1e6).toFixed(2)}M`,"GP"]} />
                <Bar dataKey="gp" fill={C.orange} radius={[3,3,0,0]} name="Gross Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Receivable vs Payable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Receivable vs Payable — Order Based" />
          <div className="p-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={receivablePayable}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                  tickFormatter={v=>`${(v/1e6).toFixed(1)}M`} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[`USD ${(v/1e6).toFixed(2)}M`,""]} />
                <Legend wrapperStyle={{fontSize:10}} />
                <Line type="monotone" dataKey="recv" stroke={C.orange} strokeWidth={2} dot={false} name="Receivable (in_invoice)" />
                <Line type="monotone" dataKey="pay"  stroke={C.blue}   strokeWidth={2} dot={false} name="Payable (out_invoice)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Profit by ordering customer */}
        <Card>
          <CardHeader title="Profit Based on Ordering Customer" subtitle="Top 12 customers" />
          <div className="p-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitByCustomer}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="cust" stroke="#94a3b8" fontSize={7} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                  tickFormatter={v=>`${(v/1e6).toFixed(1)}M`} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[`USD ${(v/1e6).toFixed(2)}M`,"Profit"]} />
                <Bar dataKey="profit" fill={C.orange} radius={[3,3,0,0]} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Products making profit > $2000 */}
      <Card>
        <CardHeader title="Products Making Profit More Than $2,000" subtitle="All language products ranked by gross profit" />
        <div className="p-4 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profitableProducts}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="lang" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                tickFormatter={v=>`${(v/1e6).toFixed(1)}M`} />
              <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                formatter={(v:number)=>[`USD ${(v/1e6).toFixed(2)}M`,"Profit"]} />
              <Line type="monotone" dataKey="profit" stroke={C.orange} strokeWidth={2.5}
                dot={{ r:4, fill:C.orange }} name="Gross Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 4 — SALES ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────
const top10Revenue = [
  {lang:"Spanish",      rev:32050000},{lang:"Sign Language",rev:31230000},
  {lang:"Other",        rev:20070000},{lang:"English",      rev:11070000},
  {lang:"Vietnamese",   rev: 5410000},{lang:"Arabic",       rev: 4450000},
  {lang:"Farsi",        rev: 3060000},{lang:"Mandarin",     rev: 2270000},
  {lang:"Korean",       rev: 2030000},{lang:"Russian",      rev: 1810000},
];

const top10Sales = [
  {lang:"Spanish",      cnt:431709},{lang:"Sign Language",cnt:138854},
  {lang:"Vietnamese",   cnt:62925 },{lang:"Arabic",       cnt:56624 },
  {lang:"Farsi",        cnt:23496 },{lang:"Mandarin",     cnt:18668 },
  {lang:"Korean",       cnt:16624 },{lang:"English",      cnt:16256 },
];

function SalesAnalysisTab({ onChartClick }: { onChartClick?: (data: Record<string, unknown>, cat: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top 10 by gross profit — line */}
        <Card className="lg:col-span-2">
          <CardHeader title="Top 10 Products — Gross Profit" subtitle="Ranked by cumulative gross profit" />
          <div className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitableProducts.slice(0,10)}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="lang" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                  tickFormatter={v=>`${(v/1e6).toFixed(1)}M`} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[`USD ${(v/1e6).toFixed(2)}M`,"Profit"]} />
                <Line type="monotone" dataKey="profit" stroke={C.orange} strokeWidth={2.5}
                  dot={{r:5,fill:C.orange}} name="Gross Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top 10 sales by product — donut */}
        <Card>
          <CardHeader title="Top 10 Sales by Product" subtitle="Order count share" />
          <div className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={top10Sales} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                  dataKey="cnt" nameKey="lang" paddingAngle={2}>
                  {top10Sales.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[v.toLocaleString(),"Orders"]} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top 10 revenue generators */}
      <Card>
        <CardHeader title="Top 10 Revenue Generators" subtitle="Total revenue by language product" />
        <div className="p-4 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top10Revenue}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="lang" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                tickFormatter={v=>`${(v/1e6).toFixed(0)}M`} />
              <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                formatter={(v:number)=>[`USD ${(v/1e6).toFixed(2)}M`,"Revenue"]} />
              <Bar dataKey="rev" fill={C.orange} radius={[3,3,0,0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Detailed language table */}
      <Card>
        <CardHeader title="Sales Report — Language, Assignments, Revenue & Profit" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-black/10">
                {["Language","Assignments","Revenue (USD)","Gross Profit (USD)"].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left text-black/50 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                {lang:"Spanish",     asgn:431709,rev:32047225,profit:8896930},
                {lang:"Sign Language",asgn:138854,rev:31234230,profit:5349023},
                {lang:"Other",       asgn:11769, rev:20065929,profit:3349761},
                {lang:"English",     asgn:16256, rev:11070096,profit:4119516},
                {lang:"Vietnamese",  asgn:177,   rev: 7326374,profit: 962793},
                {lang:"Arabic",      asgn:56624, rev: 5405062,profit:1790062},
                {lang:"Farsi",       asgn:23496, rev: 4446536,profit:1046906},
                {lang:"Mandarin",    asgn:18668, rev: 3058973,profit: 544239},
                {lang:"Korean",      asgn:16624, rev: 2269476,profit: 596095},
                {lang:"Russian",     asgn:15269, rev: 2032756,profit: 327379},
                {lang:"Burmese",     asgn:6038,  rev: 1590188,profit: 422412},
                {lang:"Cantonese",   asgn:17876, rev: 1533360,profit: 347662},
                {lang:"Nepali",      asgn:3741,  rev: 1066426,profit: 278016},
                {lang:"Amharic",     asgn:3206,  rev:  657764,profit: 180676},
                {lang:"Japanese",    asgn:4332,  rev:  600663,profit: 109929},
              ].map(r=>(
                <tr key={r.lang} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{r.lang}</td>
                  <td className="px-4 py-2">{r.asgn.toLocaleString()}</td>
                  <td className="px-4 py-2">{r.rev.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0})}</td>
                  <td className="px-4 py-2 font-semibold text-orange-600">{r.profit.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0})}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold border-t-2 border-black/10">
                <td className="px-4 py-2">Total</td>
                <td className="px-4 py-2">909,408</td>
                <td className="px-4 py-2">$133,571,305</td>
                <td className="px-4 py-2 text-orange-600">$32,348,273</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 5 — STAKEHOLDERS
// ─────────────────────────────────────────────────────────────────────────────
function StakeholdersTab() {
  const stakeholderDist = [
    {name:"Partner",   value:154},{name:"Incubatee",value:131},
    {name:"Mentor",    value:107},{name:"COE",      value:49},
    {name:"Member",    value:34 },{name:"Investor", value:17},
  ];
  const mentorByCategory = [
    {cat:"Mentor",cnt:54},{cat:"Chief Mentor",cnt:18},{cat:"Functional Domain",cnt:14},
    {cat:"Strategic Mentor",cnt:10},{cat:"Mentoring",cnt:4},{cat:"Resident Mentor",cnt:3},
  ];
  const partnerByType = [
    {type:"Industry",cnt:62},{type:"Academic",cnt:43},{type:"Funding",cnt:21},
    {type:"Implementation",cnt:15},{type:"Technical",cnt:5},{type:"Knowledge",cnt:2},
  ];
  const investorByType = [
    {type:"Angel Investor",cnt:5},{type:"VC",cnt:4},{type:"PE",cnt:3},
    {type:"Business Angels",cnt:2},{type:"Asset-Based",cnt:1},{type:"Invoice Discounters",cnt:1},
  ];
  const empByCOE = [
    {coe:"Electropreneur Park",emp:17},{coe:"Electroprenuer Pk BBS",emp:6},
    {coe:"FinBlue",emp:6},{coe:"APIARY",emp:4},{coe:"IoT OpenLab",emp:4},
    {coe:"MedTech",emp:3},{coe:"MOTION",emp:3},{coe:"OctaNE",emp:3},
    {coe:"IMAGE",emp:2},{coe:"Neuron",emp:2},
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          {label:"Consultant",value:"1"},   {label:"Member",value:"34"},
          {label:"Mentor",value:"107"},     {label:"Investor",value:"17"},
          {label:"Incubatee",value:"131"},  {label:"Partner",value:"154"},
          {label:"Employee",value:"614"},
        ].map(s=><StatBox key={s.label} label={s.label} value={s.value} color="bg-orange-500" />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Stakeholder Count" subtitle="By category distribution" />
          <div className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stakeholderDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" paddingAngle={2}>
                  {stakeholderDist.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Mentor Count by Category" />
          <div className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mentorByCategory}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="cat" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="cnt" fill={C.blue} radius={[3,3,0,0]} name="Mentors" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Partner Count by Type" />
          <div className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={partnerByType}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="type" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="cnt" fill={C.orange} radius={[3,3,0,0]} name="Partners" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Investor Count by Type" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investorByType}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="type" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="cnt" fill={C.blue} radius={[3,3,0,0]} name="Investors" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Employee Count by COE" subtitle="Top 10 COEs" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={empByCOE} layout="vertical">
                <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="coe" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} width={110} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="emp" fill={C.blue} radius={[0,3,3,0]} name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 6 — INCUBATEES
// ─────────────────────────────────────────────────────────────────────────────
function IncubateesTab() {
  const byCOE = [
    {coe:"Electropreneur Park",cnt:30},{coe:"(Blank)",cnt:28},{coe:"FinBlue",cnt:13},
    {coe:"EP Bhubaneswar",cnt:10},{coe:"MOTION",cnt:10},{coe:"APIARY",cnt:9},
    {coe:"MedTech",cnt:9},{coe:"EP Park 2",cnt:5},{coe:"Neuron",cnt:5},{coe:"IMAGE",cnt:4},
  ];
  const byDomain = [
    {dom:"ESDM",cnt:30},{dom:"FinTech",cnt:13},{dom:"IOT",cnt:10},{dom:"Auto Mobility",cnt:9},
    {dom:"MEDI ELECT",cnt:3},{dom:"IT Health",cnt:1},{dom:"(Blank)",cnt:65},
  ];
  const byProgram = [
    {prog:"Pre Incubation",cnt:37},{prog:"Test Program",cnt:12},{prog:"Pre Incubation 2",cnt:12},
    {prog:"Test-Inc",cnt:4},{prog:"New",cnt:3},{prog:"IoT Lab",cnt:2},{prog:"Pre-inco",cnt:1},
  ];
  const onboardingYoY = [
    {qtr:"2019 Q1",cnt:12},{qtr:"2019 Q2",cnt:7},{qtr:"2019 Q3",cnt:38},{qtr:"2019 Q4",cnt:12},
    {qtr:"2020 Q1",cnt:5},{qtr:"2020 Q2",cnt:15},{qtr:"2020 Q3",cnt:9},{qtr:"2020 Q4",cnt:10},
    {qtr:"2021 Q1",cnt:11},{qtr:"2021 Q2",cnt:7},{qtr:"2021 Q3",cnt:0},{qtr:"2021 Q4",cnt:7},
  ];
  const byTech = [
    {tech:"Animation",cnt:9},{tech:"Gaming",cnt:9},{tech:"Emerging Tech",cnt:6},
    {tech:"IoT Agri",cnt:5},{tech:"Electric Vehicle",cnt:5},{tech:"IOT",cnt:5},
    {tech:"AR",cnt:3},{tech:"FinTech",cnt:2},{tech:"Agritech",cnt:2},
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatBox label="Total Incubatees"  value="131"  color="bg-orange-500" />
        <StatBox label="2019 Onboarded"    value="69"   color="bg-blue-600"   />
        <StatBox label="2020 Onboarded"    value="39"   color="bg-blue-600"   />
        <StatBox label="2021 Onboarded"    value="18"   color="bg-blue-600"   />
        <StatBox label="Exit Incubatees"   value="24"   color="bg-red-500"    />
        <StatBox label="Onboarding Stage"  value="82%"  color="bg-teal-600"   />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By COE donut */}
        <Card>
          <CardHeader title="Incubatee Count by COE" />
          <div className="p-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCOE} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  dataKey="cnt" nameKey="coe" paddingAngle={2}>
                  {byCOE.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend iconSize={8} wrapperStyle={{fontSize:8}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Onboarding YoY */}
        <Card>
          <CardHeader title="Incubatee Onboarding — by Quarter" subtitle="2019–2021" />
          <div className="p-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={onboardingYoY}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="qtr" stroke="#94a3b8" fontSize={7} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="cnt" fill={C.blue} radius={[3,3,0,0]} name="Incubatees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Count by Domain" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byDomain}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="dom" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="cnt" fill={C.orange} radius={[3,3,0,0]} name="Incubatees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Count by Program" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byProgram} layout="vertical">
                <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="prog" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} width={85} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="cnt" fill={C.blue} radius={[0,3,3,0]} name="Incubatees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Count by Technology" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byTech} layout="vertical">
                <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="tech" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} width={80} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="cnt" fill={C.teal} radius={[0,3,3,0]} name="Incubatees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 7 — COHORT ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────
function CohortAnalysisTab() {
  const cohortStatus = [
    {cohort:"(Blank)",    app:2108,short:777, sel:215},
    {cohort:"Session-A",  app:550, short:200, sel:50},
    {cohort:"Session-B",  app:200, short:20,  sel:50},
    {cohort:"Session-C",  app:150, short:50,  sel:20},
    {cohort:"Motion-D",   app:96,  short:10,  sel:30},
    {cohort:"Session-E",  app:89,  short:20,  sel:40},
    {cohort:"Session-F",  app:80,  short:30,  sel:25},
    {cohort:"1st Cohort", app:72,  short:40,  sel:35},
    {cohort:"Session-G",  app:62,  short:25,  sel:35},
    {cohort:"Session-H",  app:50,  short:35,  sel:10},
  ];
  const completedByMonth = [
    {month:"Mar", app:141,short:32,sel:15},  {month:"Jun", app:223,short:103,sel:53},
    {month:"Sep", app:150,short:60, sel:35}, {month:"Nov", app:50, short:35, sel:30},
    {month:"Dec", app:233,short:100,sel:49},
  ];
  const runningCohort = [
    {month:"Jan",inc:911,dec:0,total:911},{month:"Feb",inc:500,dec:0,total:1411},
    {month:"Mar",inc:10, dec:0,total:1421},{month:"Apr",inc:1022,dec:0,total:2443},
    {month:"Total",inc:0,dec:0,total:2443},
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="Total Cohorts"   value="11"    color="bg-orange-500" />
        <StatBox label="Applicants"      value="3,557" color="bg-orange-500" />
        <StatBox label="Short Listed"    value="1,367" color="bg-orange-500" />
        <StatBox label="Selected"        value="579"   color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Cohort Status — Applicants vs Shortlisted vs Selected" />
          <div className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortStatus}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="cohort" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend wrapperStyle={{fontSize:10}} />
                <Bar dataKey="app"   fill={C.blue}   radius={[2,2,0,0]} name="Applicant"    />
                <Bar dataKey="short" fill={C.orange} radius={[2,2,0,0]} name="Short Listed" />
                <Bar dataKey="sel"   fill={C.teal}   radius={[2,2,0,0]} name="Selected"     />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Cohort Status Summary" />
          <div className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {stage:"Applicant",value:4000},{stage:"Short Listed",value:38.43},{stage:"Selected",value:16.28}
              ]} layout="vertical">
                <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="stage" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} width={75} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="value" fill={C.blue} radius={[0,3,3,0]} name="Count / %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Running Cohort" subtitle="Monthly applicant volume" />
          <div className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={runningCohort}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend wrapperStyle={{fontSize:10}} />
                <Bar dataKey="inc"   fill={C.green}  radius={[3,3,0,0]} name="Increase" />
                <Bar dataKey="total" fill={C.blue}   radius={[3,3,0,0]} name="Total"    />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Cohort Completed — by Month" subtitle="Applicant/Shortlisted/Selected pipeline" />
          <div className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completedByMonth}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend wrapperStyle={{fontSize:10}} />
                <Bar dataKey="app"   fill={C.blue}   radius={[2,2,0,0]} name="Applicant"    />
                <Bar dataKey="short" fill={C.orange} radius={[2,2,0,0]} name="Short Listed" />
                <Bar dataKey="sel"   fill={C.teal}   radius={[2,2,0,0]} name="Selected"     />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 8 — MENTORSHIP ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────
function MentorshipTab() {
  const eventByMentorMode = [
    {mentor:"Mentor2",      free:8,paid:0},{mentor:"Mentor3",      free:1,paid:6},
    {mentor:"Prof C.M. Pandey",free:0,paid:6},{mentor:"Mrinal Das",free:2,paid:1},
    {mentor:"Mr Sridhar",   free:1,paid:0},{mentor:"Avneesh B",    free:1,paid:0},
    {mentor:"Dr RK Dhiman", free:0,paid:0},{mentor:"Mr I.S. Paul", free:6,paid:0},
    {mentor:"S. Chakra",    free:1,paid:0},{mentor:"Anil K M",     free:3,paid:0},
  ];
  const mentorCountByCOE = [
    {coe:"Electropreneur Park",cnt:3},{coe:"Electroprenuer Pk",cnt:3},
    {coe:"IMAGE",cnt:3},{coe:"Test1",cnt:3},{coe:"EP Bhubaneswar",cnt:2},
    {coe:"IoT OpenLab",cnt:2},{coe:"MedTech",cnt:2},{coe:"MOTION",cnt:1},
  ];
  const eventByCOE = [
    {coe:"Electropreneur Park",accept:9,draft:4,reject:0},
    {coe:"IMAGE old",accept:4,draft:0,reject:0},
    {coe:"(Blank)",accept:4,draft:3,reject:0},
    {coe:"VARCoE",accept:4,draft:0,reject:0},
    {coe:"MedTech",accept:3,draft:0,reject:0},
    {coe:"APIARY",accept:1,draft:1,reject:0},
  ];
  const eventByCategory = [
    {mentor:"Mentor2",chief:0,func:0,mentor_cat:8},{mentor:"Mentor3",chief:6,func:0,mentor_cat:0},
    {mentor:"Prof C.M. Pandey",chief:0,func:7,mentor_cat:0},{mentor:"Mrinal Das",chief:0,func:0,mentor_cat:3},
    {mentor:"Mr Sridhar",chief:0,func:2,mentor_cat:0},{mentor:"Avneesh B",chief:0,func:0,mentor_cat:1},
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatBox label="Total Mentors"       value="19"   color="bg-orange-500" />
        <StatBox label="Onboarding Stage"    value="78%"  color="bg-blue-600"   />
        <StatBox label="Events Conducted"    value="61"   color="bg-teal-600"   />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Events by Mentor and Mode (Free vs Paid)" />
          <div className="p-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventByMentorMode}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="mentor" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend wrapperStyle={{fontSize:10}} />
                <Bar dataKey="free" fill={C.blue}   radius={[2,2,0,0]} name="Free" />
                <Bar dataKey="paid" fill={C.orange} radius={[2,2,0,0]} name="Paid" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Mentor Count by COE" />
          <div className="p-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mentorCountByCOE} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  dataKey="cnt" nameKey="coe" paddingAngle={2}>
                  {mentorCountByCOE.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Events by Mentor & Category" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventByCategory}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="mentor" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend wrapperStyle={{fontSize:9}} />
                <Bar dataKey="chief"      fill={C.orange} name="Chief-Mentor"       />
                <Bar dataKey="func"       fill={C.blue}   name="Functional Domain"  />
                <Bar dataKey="mentor_cat" fill={C.teal}   name="Mentor"             />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Events by COE — State (Accept / Draft / Reject)" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventByCOE}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="coe" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend wrapperStyle={{fontSize:9}} />
                <Bar dataKey="accept" fill={C.blue}   radius={[2,2,0,0]} name="Accept" />
                <Bar dataKey="draft"  fill={C.orange} radius={[2,2,0,0]} name="Draft"  />
                <Bar dataKey="reject" fill={C.red}    radius={[2,2,0,0]} name="Reject" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 9 — INVESTMENT  |  TAB 10 — BUDGET  |  TAB 11 — SERVICES
// ─────────────────────────────────────────────────────────────────────────────
function InvestmentTab() {
  const invByCOE = [
    {coe:"Electropreneur Park",inv:555000},{coe:"IMAGE old",inv:265000},
    {coe:"(Blank)",inv:0},{coe:"EP Bhubaneswar",inv:0},
  ];
  const topInvestors = [
    {name:"Investor1",inv:820000},{name:"Ashish",inv:0},{name:"Investor2",inv:0},
  ];
  const invType = [
    {type:"Angel Investor",cnt:5},{type:"VC",cnt:4},{type:"PE",cnt:3},
    {type:"Business Angels",cnt:2},{type:"Asset-Based",cnt:1},{type:"Invoice Disc",cnt:1},
  ];
  const coeInvestors = [
    {coe:"Electropreneur Park",cnt:10},{coe:"(Blank)",cnt:3},
    {coe:"EP Bhubaneswar",cnt:1},{coe:"IMAGE old",cnt:1},
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
        <StatBox label="Total Investors"   value="17"        color="bg-orange-500" />
        <StatBox label="Total Investment"  value="820,000"   color="bg-orange-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Investor Count by Type" />
          <div className="p-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={invType} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  dataKey="cnt" nameKey="type" paddingAngle={2}>
                  {invType.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Investment with Highest Funding" />
          <div className="p-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topInvestors}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                  tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}K`:v} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="inv" fill={C.blue} radius={[3,3,0,0]} name="Investment" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Investment Received by COE" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={invByCOE}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="coe" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                  tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}K`:v} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="inv" fill={C.orange} radius={[3,3,0,0]} name="Investment" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="COE with Most Investors Onboarded" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coeInvestors}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="coe" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="cnt" fill={C.blue} radius={[3,3,0,0]} name="Investors" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function BudgetTab() {
  const coeBudget = [
    {coe:"Electropreneur Park",demand:112000,received:284800000},
    {coe:"OctaNE",demand:23500,received:1320000},
    {coe:"FinBlue",demand:0,received:40000000},
    {coe:"IMAGE old",demand:0,received:0},
    {coe:"IoT OpenLab",demand:0,received:0},
    {coe:"MedTech",demand:152600,received:1263000},
    {coe:"(Blank)",demand:2563000,received:43000050},
    {coe:"EP Bhubaneswar",demand:0,received:0},
    {coe:"Test1",demand:0,received:0},
    {coe:"VARCoE",demand:2120,received:132000000},
  ];
  const receivedByCOE = [
    {name:"Electropreneur Park",value:284800000},{name:"VARCoE",value:132000000},
    {name:"OctaNE IoT Agri",value:43000050},{name:"FinBlue",value:40000000},
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatBox label="Demand"   value="USD 6.88M"  color="bg-orange-500" />
        <StatBox label="Proposed" value="USD 871.5K" color="bg-blue-600"   />
        <StatBox label="Received" value="USD 820K"   color="bg-teal-600"   />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="COE Wise Budget Demand vs Received" />
          <div className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coeBudget}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="coe" stroke="#94a3b8" fontSize={7} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false}
                  tickFormatter={v=>v>=1e6?`${(v/1e6).toFixed(0)}M`:v>=1000?`${(v/1000).toFixed(0)}K`:v} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend wrapperStyle={{fontSize:9}} />
                <Bar dataKey="demand"   fill={C.blue}   radius={[2,2,0,0]} name="Declaration Amount" />
                <Bar dataKey="received" fill={C.orange} radius={[2,2,0,0]} name="Received Amount"     />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="COE Wise Received Budget — Distribution" />
          <div className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={receivedByCOE} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                  dataKey="value" nameKey="name" paddingAngle={2}>
                  {receivedByCOE.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}}
                  formatter={(v:number)=>[`${(v/1e6).toFixed(1)}M`,""]} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ServicesTab() {
  const byCOE = [
    {coe:"Electropreneur Park",cnt:10},{coe:"EP Bhubaneswar",cnt:5},
    {coe:"MOTION",cnt:4},{coe:"Test CoE2",cnt:3},
    {coe:"FinBlue",cnt:2},{coe:"IMAGE",cnt:2},
  ];
  const byCategory = [
    {cat:"Internet/Lease",cnt:12},{cat:"All",cnt:11},{cat:"Data Center",cnt:10},
    {cat:"Space",cnt:8},{cat:"Office Space",cnt:2},{cat:"Back Office",cnt:1},
    {cat:"Events",cnt:1},{cat:"Storage",cnt:1},
  ];
  const locationWise = [
    {loc:"(Blank)",cnt:27},{loc:"BBSR",cnt:22},{loc:"GTK",cnt:14},{loc:"AGR",cnt:10},
    {loc:"BERH",cnt:9},{loc:"AZL",cnt:8},{loc:"CHN",cnt:7},{loc:"HYD",cnt:7},
    {loc:"PUNE",cnt:7},{loc:"BBSRC",cnt:6},{loc:"IMPH",cnt:6},{loc:"CHENNAI",cnt:5},
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatBox label="Total Services"     value="48"  color="bg-orange-500" />
        <StatBox label="Service Categories" value="10"  color="bg-blue-600"   />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="COE Wise Service Count" />
          <div className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCOE} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="cnt" nameKey="coe" paddingAngle={2}>
                  {byCOE.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend iconSize={8} wrapperStyle={{fontSize:9}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Category Wise Service Count" />
          <div className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="cat" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Bar dataKey="cnt" fill={C.blue} radius={[3,3,0,0]} name="Services" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader title="Location Wise Service Distribution" subtitle="Top 12 locations" />
        <div className="p-4 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationWise}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="loc" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
              <Bar dataKey="cnt" fill={C.orange} radius={[3,3,0,0]} name="Services" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 12 — EXECUTIVE SUMMARY (Business Performance Report)
// ─────────────────────────────────────────────────────────────────────────────
function ExecutiveSummaryTab() {
  const programTypes = [
    {type:"Outreach",cnt:90},{type:"Training",cnt:49},
    {type:"Other",cnt:46},{type:"Contest",cnt:19},
  ];
  const attendeeByCOE = [
    {coe:"NEURON",stpi:9828,outside:3256},{coe:"EP Bhubaneswar",stpi:9717,outside:2717},
    {coe:"MOTION",stpi:5563,outside:1568},{coe:"APIARY",stpi:2539,outside:395},
    {coe:"FinBlue",stpi:2447,outside:1474},{coe:"MedTech",stpi:2086,outside:1110},
    {coe:"OctaNE",stpi:1696,outside:1887},{coe:"IoT OpenLab",stpi:1319,outside:1499},
    {coe:"VARCoE",stpi:745,outside:789},  {coe:"IMAGE",stpi:452,outside:1499},
  ];
  const attendeeYoY = [
    {year:"2019",APIARY:2,EP_Bhu:1},{year:"2020",FinBlue:5,IMAGE:4,IoT:1,MedTech:7,MOTION:8,NEURON:13,OctaNE:18,VARCoE:3},
    {year:"2021",FinBlue:12,IMAGE:7,IoT:5,MedTech:12,MOTION:18,NEURON:20,OctaNE:27,VARCoE:7},
  ];
  const delegByCOE = [
    {coe:"EP Bhubaneswar",cnt:15},{coe:"FinBlue",cnt:30},{coe:"FinBlue (Blank)",cnt:15},
  ];
  return (
    <div className="space-y-4">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {[
          {l:"COEs",v:"49"},{l:"Consultant",v:"1"},{l:"Member",v:"34"},{l:"Mentor",v:"107"},
          {l:"Investor",v:"17"},{l:"Incubatee",v:"131"},{l:"Partner",v:"154"},{l:"Employee",v:"614"},
        ].map(s=><StatBox key={s.l} label={s.l} value={s.v} color="bg-orange-500" />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Type wise program count */}
        <Card>
          <CardHeader title="Type Wise Program Count" subtitle="Outreach, Training, Other, Contest" />
          <div className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={programTypes} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="cnt" nameKey="type" paddingAngle={2}>
                  {programTypes.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend iconSize={8} wrapperStyle={{fontSize:10}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Delegation count COE wise */}
        <Card>
          <CardHeader title="Delegation Count — COE Wise" />
          <div className="p-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={delegByCOE} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="cnt" nameKey="coe" paddingAngle={2}>
                  {[C.blue,C.orange,C.teal].map((c,i)=><Cell key={i} fill={c}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
                <Legend iconSize={8} wrapperStyle={{fontSize:10}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* CEO wise attendee count — horizontal stacked */}
      <Card>
        <CardHeader title="CEO Wise Attendee Count — STPI vs Outside" subtitle="All COEs" />
        <div className="p-4 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendeeByCOE} layout="vertical">
              <CartesianGrid stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false}
                tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}K`:v} />
              <YAxis type="category" dataKey="coe" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} width={80} />
              <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
              <Legend wrapperStyle={{fontSize:10}} />
              <Bar dataKey="stpi"    fill={C.blue}   name="STPI Attendee"    />
              <Bar dataKey="outside" fill={C.orange} name="Outside Attendee" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Attendee count year on year by COE */}
      <Card>
        <CardHeader title="CEO Wise Attendee Count — Year on Year" subtitle="2019–2021 by COE" />
        <div className="p-4 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              {year:"2019",APIARY:2,EP:1,FinBlue:0,MedTech:0,MOTION:0,NEURON:0,OctaNE:0,VARCoE:0},
              {year:"2020",APIARY:0,EP:0,FinBlue:5,MedTech:7,MOTION:8,NEURON:13,OctaNE:18,VARCoE:3},
              {year:"2021",APIARY:0,EP:0,FinBlue:12,MedTech:12,MOTION:18,NEURON:20,OctaNE:27,VARCoE:7},
            ]}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{background:"white",border:"1px solid #e2e8f0",borderRadius:8,fontSize:11}} />
              <Legend wrapperStyle={{fontSize:9}} />
              {["APIARY","EP","FinBlue","MedTech","MOTION","NEURON","OctaNE","VARCoE"].map((k,i)=>(
                <Bar key={k} dataKey={k} fill={PIE_COLORS[i%PIE_COLORS.length]} stackId="a" />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function BIDashboardPage() {
  const [tab, setTab] = useState<Tab>("Business Analysis");
  const navigate = useNavigate();

  const handleChartClick = (data: Record<string, unknown>, category: string) => {
    if (!data) return;
    const value = (data.lang ?? data.name ?? data.year ?? data.coe ?? data.dept ?? data.cust ?? "segment") as string;
    navigate(`/bi-dashboards/drill/${encodeURIComponent(category)}/${encodeURIComponent(String(value))}`);
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <Badge tone="blue">Business Intelligence</Badge>
          <Badge tone="muted">Senstar Botswana · FY 31.12.22</Badge>
          <Badge tone="muted">Click any chart segment for drill-down ↓</Badge>
        </div>
        <PageHeader
          title="Business Intelligence Dashboards"
          description="Comprehensive BI suite. Click any chart bar or pie slice to drill into detailed data."
          actions={
            <>
              <button className="h-9 px-3 rounded-xl border border-black/10 text-sm flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" /> <span className="hidden sm:inline">Filter</span>
              </button>
              <button className="h-9 px-3 rounded-xl border border-black/10 text-sm flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
              </button>
            </>
          }
        />

        {/* Scrollable tabs */}
        <div className="flex gap-0.5 mb-6 border-b border-black/10 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px flex-shrink-0 ${
                tab === t ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"
              }`}>{t}</button>
          ))}
        </div>

        {tab === "Business Analysis"   && <BusinessAnalysisTab onChartClick={handleChartClick} />}
        {tab === "Performance Report"  && <PerformanceReportTab />}
        {tab === "Finance Analysis"    && <FinanceAnalysisTab onChartClick={handleChartClick} />}
        {tab === "Sales Analysis"      && <SalesAnalysisTab onChartClick={handleChartClick} />}
        {tab === "Stakeholders"        && <StakeholdersTab />}
        {tab === "Incubatees"          && <IncubateesTab />}
        {tab === "Cohort Analysis"     && <CohortAnalysisTab />}
        {tab === "Mentorship"          && <MentorshipTab />}
        {tab === "Investment"          && <InvestmentTab />}
        {tab === "Budget"              && <BudgetTab />}
        {tab === "Services"            && <ServicesTab />}
        {tab === "Executive Summary"   && <ExecutiveSummaryTab />}
      </div>

      <AIAssistantPanel
        agentName="Business Intelligence Agent"
        agentRole="BI analytics — sales, finance, cohort, investment and stakeholder intelligence"
        context="business intelligence and performance analytics"
        color="blue"
        suggestedPrompts={[
          "Which language product has the highest gross profit margin?",
          "Show year-on-year revenue trend analysis",
          "Identify top performing COEs by incubatee count",
          "Compare invoiced vs billed amounts by year",
          "Which customers drive the most profit?",
        ]}
      />
    </AppShell>
  );
}
