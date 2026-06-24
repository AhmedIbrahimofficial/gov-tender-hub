import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppShell, Card, CardHeader, KpiCard } from "@/components/AppShell";
import { toast } from "@/lib/toast";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { Users, TrendingUp, ShieldCheck, FileText, Activity, DollarSign, ArrowLeft } from "lucide-react";

const TIP = { contentStyle: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 } };

const DEPT_DATA: Record<string, {
  name: string; ministry: string; head: string; location: string;
  budget: number; spent: number; committed: number;
  staffCount: number; activeTenders: number; activeContracts: number; complianceScore: number;
  staff: { name: string; role: string; email: string; status: string }[];
  tenders: { id: string; title: string; value: string; status: string }[];
  activity: { time: string; event: string; type: string }[];
  spendTrend: { month: string; spend: number }[];
  performance: { metric: string; value: string; status: string }[];
}> = {
  "clinical-services": {
    name: "Clinical Services", ministry: "Ministry of Health & Child Care",
    head: "Dr. T. Moyo", location: "Kaguvi Building, Harare",
    budget: 280, spent: 186, committed: 42, staffCount: 1820,
    activeTenders: 6, activeContracts: 8, complianceScore: 96,
    staff: [
      { name: "Dr. T. Moyo",   role: "Director — Clinical Services", email: "tmoyo@moh.gov.zw",   status: "Active" },
      { name: "P. Dube",       role: "Chief Procurement Officer",    email: "pdube@moh.gov.zw",   status: "Active" },
      { name: "R. Chikwanda",  role: "Finance Manager",             email: "rchik@moh.gov.zw",   status: "Active" },
      { name: "A. Mpofu",      role: "Procurement Officer",         email: "ampofu@moh.gov.zw",  status: "Active" },
      { name: "J. Banda",      role: "Contracts Manager",           email: "jbanda@moh.gov.zw",  status: "On Leave"},
    ],
    tenders: [
      { id: "ZW-PRA-2026-00183", title: "ARV Medicines Framework",    value: "USD 42.5M", status: "Evaluation" },
      { id: "ZW-PRA-2026-00171", title: "Medical Equipment Supply",   value: "USD 18.2M", status: "Bidding"    },
      { id: "ZW-PRA-2026-00158", title: "Lab Reagents Annual Supply", value: "USD 4.8M",  status: "Awarded"    },
    ],
    activity: [
      { time: "10:32", event: "ARV tender scored — 3 bidders qualified",   type: "info"    },
      { time: "09:14", event: "Medical supplies delivery confirmed — GRN",  type: "success" },
      { time: "08:02", event: "Q3 budget request submitted to Finance",     type: "info"    },
      { time: "07:45", event: "Compliance audit finding closed",            type: "success" },
    ],
    spendTrend: [
      { month:"Jan", spend:28 }, { month:"Feb", spend:31 }, { month:"Mar", spend:34 },
      { month:"Apr", spend:29 }, { month:"May", spend:36 }, { month:"Jun", spend:28 },
    ],
    performance: [
      { metric: "Budget Utilisation",      value: "66.4%",    status: "On Track" },
      { metric: "Procurement Plan Adherence", value: "94%",   status: "Good"     },
      { metric: "Contract Performance",    value: "4.5/5.0",  status: "Good"     },
      { metric: "Open Audit Findings",     value: "2",        status: "Warning"  },
      { metric: "Supplier Rating Avg",     value: "4.2/5.0",  status: "Good"     },
      { metric: "Invoice Payment Avg",     value: "21 days",  status: "On Track" },
    ],
  },
  "infrastructure-division": {
    name: "Infrastructure Division", ministry: "Ministry of Transport & Infrastructure",
    head: "J. Banda", location: "Makombe Complex, Harare",
    budget: 320, spent: 214, committed: 68, staffCount: 1240,
    activeTenders: 8, activeContracts: 12, complianceScore: 89,
    staff: [
      { name: "J. Banda",     role: "Director — Infrastructure",  email: "jbanda@mot.gov.zw",  status: "Active"   },
      { name: "T. Sithole",   role: "Chief Engineer",             email: "tsithole@mot.gov.zw",status: "Active"   },
      { name: "M. Ncube",     role: "Procurement Officer",        email: "mncube@mot.gov.zw",  status: "Active"   },
      { name: "S. Mokoena",   role: "Finance Officer",            email: "smokoena@mot.gov.zw",status: "Active"   },
    ],
    tenders: [
      { id: "ZW-PRA-2026-00181", title: "Beitbridge Highway Sec 4", value: "USD 88.0M", status: "Published" },
      { id: "ZW-PRA-2026-00162", title: "Bridge Rehabilitation",    value: "USD 24.0M", status: "Bidding"   },
    ],
    activity: [
      { time: "11:20", event: "Highway tender advertised — closing Aug 4",    type: "info"    },
      { time: "09:45", event: "Infrastructure spend at 88% — risk warning",   type: "warning" },
      { time: "08:30", event: "Site inspection completed — Section 3",         type: "success" },
    ],
    spendTrend: [
      { month:"Jan", spend:32 }, { month:"Feb", spend:38 }, { month:"Mar", spend:42 },
      { month:"Apr", spend:36 }, { month:"May", spend:44 }, { month:"Jun", spend:22 },
    ],
    performance: [
      { metric: "Budget Utilisation",      value: "88%",      status: "Warning" },
      { metric: "Procurement Plan Adherence", value: "88%",   status: "Warning" },
      { metric: "Contract Performance",    value: "3.9/5.0",  status: "Warning" },
      { metric: "Open Audit Findings",     value: "6",        status: "At Risk" },
      { metric: "Supplier Rating Avg",     value: "3.8/5.0",  status: "Warning" },
      { metric: "Invoice Payment Avg",     value: "34 days",  status: "Warning" },
    ],
  },
};

const DEFAULT_DEPT = DEPT_DATA["clinical-services"];

const STATUS_COLORS: Record<string, string> = {
  "On Track":"bg-emerald-100 text-emerald-700", Good:"bg-emerald-100 text-emerald-700",
  Warning:"bg-amber-100 text-amber-700", "At Risk":"bg-red-100 text-red-700",
  Active:"bg-emerald-100 text-emerald-700", "On Leave":"bg-amber-100 text-amber-700",
  Evaluation:"bg-amber-100 text-amber-700", Bidding:"bg-blue-100 text-blue-700",
  Awarded:"bg-emerald-100 text-emerald-700", Published:"bg-violet-100 text-violet-700",
};

export default function DepartmentDashboardPage() {
  const { ministryId, deptId } = useParams<{ ministryId: string; deptId: string }>();
  const navigate = useNavigate();
  const dept = (deptId && DEPT_DATA[deptId]) ? DEPT_DATA[deptId] : DEFAULT_DEPT;
  const pct = Math.round((dept.spent / dept.budget) * 100);

  return (
    <AppShell>
      {/* Back button */}
      <button onClick={()=>navigate(`/ministry/${ministryId}/dashboard`)} className="flex items-center gap-2 text-sm text-black/50 hover:text-black mb-4 transition-colors">
        <ArrowLeft className="h-4 w-4"/>Back to Ministry Dashboard
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-black text-white text-lg flex items-center justify-center flex-shrink-0">🏢</div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-black">{dept.name}</h1>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <span className="text-sm text-black/50">{dept.ministry}</span>
            <span className="text-sm text-black/50">Head: {dept.head}</span>
            <span className="text-sm text-black/50">{dept.location}</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <KpiCard label="Budget (M)"        value={`USD ${dept.budget}M`}          icon={DollarSign}  color="blue"   />
        <KpiCard label="Spent (M)"         value={`USD ${dept.spent}M`} delta={`${pct}%`} icon={TrendingUp} color={pct>=85?"amber":"green"} />
        <KpiCard label="Committed (M)"     value={`USD ${dept.committed}M`}        icon={Activity}    color="amber"  />
        <KpiCard label="Staff Count"       value={dept.staffCount.toLocaleString()} icon={Users}      color="cyan"   />
        <KpiCard label="Active Tenders"    value={String(dept.activeTenders)}       icon={FileText}   color="violet" />
        <KpiCard label="Compliance Score"  value={`${dept.complianceScore}%`}       icon={ShieldCheck}color="green"  />
      </div>

      {/* Charts + Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader title="Monthly Expenditure Trend" subtitle="USD M" />
          <div className="p-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dept.spendTrend}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v=>`$${v}M`} />
                <Tooltip {...TIP} formatter={(v:number)=>[`USD ${v}M`]} />
                <Area type="monotone" dataKey="spend" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Performance Metrics" subtitle="Departmental KPIs" />
          <div className="divide-y divide-black/5">
            {dept.performance.map(p=>(
              <div key={p.metric} className="px-5 py-2.5 flex items-center justify-between">
                <span className="text-sm text-black/70">{p.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-black">{p.value}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${STATUS_COLORS[p.status]||"bg-gray-100 text-gray-600"}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Staff + Tenders + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader title="Department Staff" subtitle="Key personnel" />
          <div className="divide-y divide-black/5">
            {dept.staff.map(s=>(
              <div key={s.name} className="px-5 py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-black/50">
                    {s.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-black">{s.name}</div>
                    <div className="text-xs text-black/40">{s.role}</div>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${STATUS_COLORS[s.status]||"bg-gray-100 text-gray-600"}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Active Tenders" />
          <div className="divide-y divide-black/5">
            {dept.tenders.map(t=>(
              <div key={t.id} className="px-5 py-3">
                <div className="text-sm font-medium text-black">{t.title}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-bold text-black/60">{t.value}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${STATUS_COLORS[t.status]||"bg-gray-100"}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Activity Log" />
          <div className="divide-y divide-black/5">
            {dept.activity.map((a,i)=>(
              <div key={i} className="px-5 py-3 flex items-start gap-2">
                <span className="text-xs text-black/30 font-mono mt-0.5 whitespace-nowrap">{a.time}</span>
                <div className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${a.type==="success"?"bg-emerald-500":a.type==="warning"?"bg-amber-500":"bg-blue-500"}`}/>
                <span className="text-xs text-black/70 leading-relaxed">{a.event}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Budget allocation */}
      <Card>
        <CardHeader title="Budget Allocation & Utilisation" subtitle={`FY2026 — ${dept.name}`} />
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-black">Approved Budget: USD {dept.budget}M</span>
            <span className="text-sm font-bold text-black">{pct}% utilised</span>
          </div>
          <div className="h-4 rounded-full bg-gray-100 overflow-hidden mb-4">
            <div className={`h-full rounded-full transition-all ${pct>=85?"bg-amber-500":"bg-blue-500"}`} style={{width:`${Math.min(pct,100)}%`}}/>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[["Spent",dept.spent,"USD M","text-blue-600"],["Committed",dept.committed,"USD M","text-amber-600"],["Available",dept.budget-dept.spent-dept.committed,"USD M","text-emerald-600"]].map(([label,val,unit,cls])=>(
              <div key={label as string} className="p-3 rounded-xl bg-gray-50">
                <div className={`text-xl font-bold ${cls}`}>{val}</div>
                <div className="text-xs text-black/40 mt-0.5">{label} ({unit})</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
