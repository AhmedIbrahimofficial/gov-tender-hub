import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppShell, PageHeader, Card, CardHeader, KpiCard } from "@/components/AppShell";
import { toast } from "@/lib/toast";
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { Building2, TrendingUp, ShieldCheck, Users, FileText, Plus, Eye, Activity, DollarSign } from "lucide-react";

const C = ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#ec4899"];
const TIP = { contentStyle: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 } };

const MINISTRY_DATA: Record<string, {
  name: string; badge: string; minister: string; hq: string;
  kpis: { activeTenders:number; activeContracts:number; budgetUtil:number; compliance:number; activeProjects:number; staffCount:number };
  departments: { name:string; head:string; budget:number; spent:number; staff:number; status:string }[];
  tenders: { id:string; title:string; value:string; status:string; closing:string }[];
  entities: { name:string; type:string; budget:string; status:string }[];
  activity: { time:string; event:string; type:string }[];
  spendByDept: { dept:string; spend:number }[];
  tenderStatus: { name:string; value:number }[];
}> = {
  "min-001": {
    name:"Ministry of Health & Child Care", badge:"🏥", minister:"Hon. D. Parirenyatwa", hq:"Kaguvi Building, Harare",
    kpis:{ activeTenders:24, activeContracts:18, budgetUtil:81, compliance:96, activeProjects:6, staffCount:4820 },
    departments:[
      { name:"Clinical Services",      head:"Dr. T. Moyo",    budget:280, spent:186, staff:1820, status:"Active"  },
      { name:"Pharmacy & Medicines",   head:"P. Dube",        budget:180, spent:142, staff:480,  status:"Active"  },
      { name:"District Health",        head:"R. Chikwanda",   budget:220, spent:148, staff:1640, status:"Active"  },
      { name:"Health Financing",       head:"A. Mpofu",       budget:140, spent:66,  staff:280,  status:"At Risk" },
    ],
    tenders:[
      { id:"ZW-PRA-2026-00183", title:"ARV Medicines Framework",    value:"USD 42.5M", status:"Evaluation", closing:"2026-06-12" },
      { id:"ZW-PRA-2026-00177", title:"4 District Hospitals",       value:"USD 56.0M", status:"Draft",      closing:"2026-09-15" },
      { id:"ZW-PRA-2026-00171", title:"Medical Equipment Supply",   value:"USD 18.2M", status:"Bidding",    closing:"2026-07-20" },
    ],
    entities:[
      { name:"Parirenyatwa Hospital",  type:"Public Hospital",   budget:"USD 84M",  status:"Active" },
      { name:"Mpilo Hospital",         type:"Public Hospital",   budget:"USD 62M",  status:"Active" },
      { name:"NatPharm",               type:"SOE",               budget:"USD 42M",  status:"Active" },
    ],
    activity:[
      { time:"10:32", event:"ARV tender evaluation completed — 8 bids scored", type:"success" },
      { time:"09:14", event:"District Hospital design approved by Cabinet",    type:"info"    },
      { time:"08:02", event:"Pharmacy overspend warning: 94% of ceiling",     type:"warning" },
      { time:"07:45", event:"NatPharm delivery confirmed: 2.4M units ARV",    type:"success" },
    ],
    spendByDept:[ { dept:"Clinical", spend:186 }, { dept:"Pharmacy", spend:142 }, { dept:"District", spend:148 }, { dept:"Financing", spend:66 } ],
    tenderStatus:[ { name:"Bidding", value:3 }, { name:"Evaluation", value:4 }, { name:"Awarded", value:12 }, { name:"Draft", value:5 } ],
  },
  "min-002": {
    name:"Ministry of Transport & Infrastructure", badge:"🛣️", minister:"Hon. F. Mhona", hq:"Kaguvi Building, Harare",
    kpis:{ activeTenders:18, activeContracts:12, budgetUtil:75, compliance:91, activeProjects:8, staffCount:2840 },
    departments:[
      { name:"Infrastructure Division", head:"J. Banda",    budget:320, spent:214, staff:1240, status:"At Risk" },
      { name:"Roads Administration",    head:"T. Sithole",  budget:180, spent:98,  staff:860,  status:"Active"  },
      { name:"Rail & Aviation",         head:"M. Ncube",    budget:140, spent:69,  staff:740,  status:"Active"  },
    ],
    tenders:[
      { id:"ZW-PRA-2026-00181", title:"Beitbridge–Harare Highway Sec 4", value:"USD 88.0M", status:"Published", closing:"2026-08-04" },
      { id:"ZW-PRA-2026-00162", title:"Bridge Rehabilitation Programme", value:"USD 24.0M", status:"Bidding",   closing:"2026-07-15" },
    ],
    entities:[
      { name:"ZINARA",      type:"Autonomous", budget:"USD 95M",  status:"Active" },
      { name:"VID",         type:"Govt Dept",  budget:"USD 28M",  status:"Active" },
    ],
    activity:[
      { time:"11:20", event:"Beitbridge tender advertised — 0 bids received yet",  type:"info"    },
      { time:"09:45", event:"Infrastructure Division 88% spend — warning issued",  type:"warning" },
      { time:"08:30", event:"ZINARA revenue collection 90% of monthly target",     type:"info"    },
    ],
    spendByDept:[ { dept:"Infrastructure", spend:214 }, { dept:"Roads", spend:98 }, { dept:"Rail & Aviation", spend:69 } ],
    tenderStatus:[ { name:"Bidding", value:4 }, { name:"Evaluation", value:2 }, { name:"Awarded", value:8 }, { name:"Published", value:4 } ],
  },
};

// Fallback for unknown ministry IDs
const DEFAULT_MINISTRY = MINISTRY_DATA["min-001"];

const STATUS_COLORS: Record<string,string> = {
  Bidding:"bg-blue-100 text-blue-700", Evaluation:"bg-amber-100 text-amber-700",
  Awarded:"bg-emerald-100 text-emerald-700", Draft:"bg-gray-100 text-gray-600",
  Published:"bg-violet-100 text-violet-700", "At Risk":"bg-red-100 text-red-700",
  Active:"bg-emerald-100 text-emerald-700",
};

export default function MinistryDashboardPage() {
  const { ministryId } = useParams<{ ministryId: string }>();
  const navigate = useNavigate();
  const ministry = (ministryId && MINISTRY_DATA[ministryId]) ? MINISTRY_DATA[ministryId] : DEFAULT_MINISTRY;
  const [activeSection, setActiveSection] = useState<"overview"|"tenders"|"budget"|"projects">("overview");

  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="h-14 w-14 rounded-2xl bg-black text-white text-2xl flex items-center justify-center flex-shrink-0">{ministry.badge}</div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-black">{ministry.name}</h1>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <span className="text-sm text-black/50">Minister: {ministry.minister}</span>
            <span className="text-sm text-black/50">HQ: {ministry.hq}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Active</span>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={()=>navigate("/tenders")} className="h-8 px-3 rounded-lg bg-black text-white text-xs hover:bg-gray-800 flex items-center gap-1.5"><Plus className="h-3.5 w-3.5"/>New Tender</button>
          <button onClick={()=>navigate("/contracts")} className="h-8 px-3 rounded-lg border border-black/10 text-xs hover:bg-gray-50 flex items-center gap-1.5"><FileText className="h-3.5 w-3.5"/>New Contract</button>
          <button onClick={()=>navigate("/budget")} className="h-8 px-3 rounded-lg border border-black/10 text-xs hover:bg-gray-50 flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5"/>Budget Request</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <KpiCard label="Active Tenders"    value={String(ministry.kpis.activeTenders)}   icon={FileText}    color="blue"   />
        <KpiCard label="Active Contracts"  value={String(ministry.kpis.activeContracts)}  icon={Activity}   color="green"  />
        <KpiCard label="Budget Util %"     value={`${ministry.kpis.budgetUtil}%`}          icon={TrendingUp} color={ministry.kpis.budgetUtil>=85?"red":"amber"} />
        <KpiCard label="Compliance Score"  value={`${ministry.kpis.compliance}%`}          icon={ShieldCheck}color="cyan"   />
        <KpiCard label="Active Projects"   value={String(ministry.kpis.activeProjects)}   icon={Building2}  color="violet" />
        <KpiCard label="Staff Count"       value={ministry.kpis.staffCount.toLocaleString()} icon={Users}   color="blue"   />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-black/5 mb-6">
        {(["overview","tenders","budget","projects"] as const).map(s=>(
          <button key={s} onClick={()=>setActiveSection(s)}
            className={`h-9 px-4 text-sm font-medium capitalize border-b-2 transition-colors ${activeSection===s?"border-black text-black":"border-transparent text-black/40 hover:text-black/70"}`}>
            {s}
          </button>
        ))}
      </div>

      {activeSection === "overview" && (
        <div className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Spend by Department" subtitle="YTD (USD M)" />
              <div className="p-4 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ministry.spendByDept}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="dept" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v=>`$${v}M`} />
                    <Tooltip {...TIP} formatter={(v:number)=>[`USD ${v}M`]} />
                    <Bar dataKey="spend" fill="#3b82f6" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <CardHeader title="Tender Status Distribution" subtitle="All ministry tenders" />
              <div className="p-4 h-[220px] flex flex-col gap-3">
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={ministry.tenderStatus} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" nameKey="name">
                        {ministry.tenderStatus.map((_,i)=><Cell key={i} fill={C[i%C.length]}/>)}
                      </Pie>
                      <Tooltip {...TIP} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {ministry.tenderStatus.map((d,i)=>(
                    <div key={d.name} className="flex items-center gap-1.5 text-xs">
                      <span className="h-2 w-2 rounded-full" style={{backgroundColor:C[i%C.length]}}/>
                      <span className="text-black/60">{d.name}</span>
                      <span className="font-semibold text-black ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Departments + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Department Performance" subtitle="Budget utilisation & staff" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-black/40 uppercase">
                    <tr>{["Department","Head","Budget (M)","Spent (M)","Staff","Status"].map(h=><th key={h} className="px-4 py-2.5 text-left font-medium whitespace-nowrap">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {ministry.departments.map(d=>(
                      <tr key={d.name} className="hover:bg-gray-50/60 cursor-pointer" onClick={()=>navigate(`/ministry/${ministryId}/department/${d.name.toLowerCase().replace(/\s+/g,"-")}`)}>
                        <td className="px-4 py-3 font-medium text-black">{d.name}</td>
                        <td className="px-4 py-3 text-xs text-black/60">{d.head}</td>
                        <td className="px-4 py-3 text-black/70">{d.budget}</td>
                        <td className="px-4 py-3 text-black/70">{d.spent}</td>
                        <td className="px-4 py-3 text-black/60">{d.staff.toLocaleString()}</td>
                        <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${STATUS_COLORS[d.status]||"bg-gray-100 text-gray-600"}`}>{d.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card>
              <CardHeader title="Recent Activity" subtitle="Ministry activity feed" />
              <div className="divide-y divide-black/5">
                {ministry.activity.map((a,i)=>(
                  <div key={i} className="px-5 py-3 flex items-start gap-3">
                    <span className="text-xs text-black/30 font-mono mt-0.5 whitespace-nowrap">{a.time}</span>
                    <div className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${a.type==="success"?"bg-emerald-500":a.type==="warning"?"bg-amber-500":"bg-blue-500"}`}/>
                    <span className="text-sm text-black/70">{a.event}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* State entities */}
          <Card>
            <CardHeader title="State Entities Under This Ministry" subtitle="Parastatals, SOEs and autonomous bodies" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-black/40 uppercase">
                  <tr>{["Entity","Type","Budget (Annual)","Status",""].map(h=><th key={h} className="px-4 py-2.5 text-left font-medium">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {ministry.entities.map(e=>(
                    <tr key={e.name} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3 font-medium text-black">{e.name}</td>
                      <td className="px-4 py-3 text-xs text-black/60">{e.type}</td>
                      <td className="px-4 py-3 font-semibold text-black">{e.budget}</td>
                      <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${STATUS_COLORS[e.status]||"bg-gray-100 text-gray-600"}`}>{e.status}</span></td>
                      <td className="px-4 py-3"><button onClick={()=>toast(`Opening ${e.name} dashboard`,"info")} className="h-6 px-2 rounded border border-black/10 text-[11px] hover:bg-gray-50 flex items-center gap-1"><Eye className="h-3 w-3"/>View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeSection === "tenders" && (
        <Card>
          <CardHeader title="Ministry Tenders" subtitle="All tenders for this ministry">
            <button onClick={()=>navigate("/tenders")} className="h-7 px-3 rounded-lg bg-black text-white text-xs hover:bg-gray-800 flex items-center gap-1"><Plus className="h-3.5 w-3.5"/>New Tender</button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-black/40 uppercase">
                <tr>{["ID","Title","Value","Status","Closing Date",""].map(h=><th key={h} className="px-4 py-2.5 text-left font-medium whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {ministry.tenders.map(t=>(
                  <tr key={t.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-mono text-[11px] text-black/40">{t.id}</td>
                    <td className="px-4 py-3 font-medium text-black">{t.title}</td>
                    <td className="px-4 py-3 font-semibold text-black">{t.value}</td>
                    <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${STATUS_COLORS[t.status]||"bg-gray-100"}`}>{t.status}</span></td>
                    <td className="px-4 py-3 text-xs text-black/50">{t.closing}</td>
                    <td className="px-4 py-3"><button onClick={()=>navigate("/tenders")} className="h-6 px-2 rounded border border-black/10 text-[11px] hover:bg-gray-50">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeSection === "budget" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Approved Budget"  value="USD 820M" icon={DollarSign} color="blue"  />
            <KpiCard label="Spent YTD"        value="USD 542M" delta="66%"       icon={TrendingUp} color="green" />
            <KpiCard label="Committed"        value="USD 124M" delta="15%"       icon={Activity} color="amber" />
            <KpiCard label="Available"        value="USD 154M" delta="Remaining" icon={DollarSign} color="cyan" />
          </div>
          <Card>
            <CardHeader title="Department Budget Utilisation" />
            <div className="divide-y divide-black/5">
              {ministry.departments.map(d=>{
                const pct = Math.round((d.spent/d.budget)*100);
                return (
                  <div key={d.name} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-black">{d.name}</span>
                      <span className="text-xs font-bold text-black/60">USD {d.spent}M / {d.budget}M — {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full rounded-full ${pct>=85?"bg-amber-500":"bg-blue-500"}`} style={{width:`${pct}%`}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeSection === "projects" && (
        <Card>
          <CardHeader title="Active Projects" subtitle="Capital and development projects" />
          <div className="divide-y divide-black/5">
            {[
              { name:"National Hospital Information System", phase:"UAT & Training", budget:"USD 24M", progress:76, risk:"Low" },
              { name:"4 District Hospitals Construction",    phase:"Design & Approvals", budget:"USD 56M", progress:3,  risk:"Medium" },
            ].map(p=>(
              <div key={p.name} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-black">{p.name}</div>
                    <div className="text-xs text-black/40 mt-0.5">Phase: {p.phase} · Budget: {p.budget}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{width:`${p.progress}%`}}/>
                      </div>
                      <span className="text-xs font-bold text-black/60">{p.progress}%</span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${p.risk==="Low"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{p.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </AppShell>
  );
}
