/**
 * HumanResourcesPage — Complete HR lifecycle from recruitment to retirement.
 * Covers staff management, performance, payroll, and HR analytics.
 */
import { useState } from "react";
import { AppShell, PageHeader, Card, CardHeader, KpiCard, Badge } from "@/components/AppShell";
import {
  Users, UserPlus, Star, TrendingUp, DollarSign, Calendar, FileText,
  Sparkles, Search, Filter, Download, BarChart3, CheckCircle2, Clock,
  AlertTriangle, Shield, Briefcase, GraduationCap, Heart, Award,
  ChevronRight, ChevronDown, Plus, X, Mail, Phone, MapPin,
} from "lucide-react";

const HR_MODULES = [
  { label: "Recruitment & Hiring",   icon: UserPlus,       desc: "Job postings, applications, interviews, offers",    to: "#recruitment", color: "bg-blue-600"    },
  { label: "Employee Onboarding",    icon: CheckCircle2,   desc: "Induction, contracts, orientation, setup",           to: "#onboarding",  color: "bg-emerald-600" },
  { label: "Staff Records",          icon: FileText,        desc: "Personnel files, contracts, history",               to: "#records",     color: "bg-violet-600"  },
  { label: "Performance Management", icon: Star,            desc: "Appraisals, KPIs, reviews, improvement plans",      to: "#performance", color: "bg-amber-600"   },
  { label: "Payroll & Benefits",     icon: DollarSign,      desc: "Salaries, deductions, allowances, payslips",        to: "#payroll",     color: "bg-[#0f172a]"   },
  { label: "Training & Development", icon: GraduationCap,   desc: "Courses, certifications, skills matrix",            to: "#training",    color: "bg-cyan-600"    },
  { label: "Leave Management",       icon: Calendar,        desc: "Annual, sick, maternity, special leave",            to: "#leave",       color: "bg-pink-600"    },
  { label: "Disciplinary & Grievance",icon: Shield,         desc: "Warnings, hearings, appeals, resolutions",          to: "#discipline",  color: "bg-red-600"     },
  { label: "Health & Wellness",      icon: Heart,           desc: "Occupational health, wellness programmes",          to: "#wellness",    color: "bg-rose-500"    },
  { label: "Retirement & Exit",      icon: Award,           desc: "Resignation, retirement, clearance, handover",      to: "#exit",        color: "bg-gray-600"    },
  { label: "HR Analytics",           icon: BarChart3,       desc: "Headcount, turnover, productivity dashboards",      to: "#analytics",   color: "bg-indigo-600"  },
  { label: "Workforce Planning",     icon: Briefcase,       desc: "Succession, capacity planning, org charts",         to: "#workforce",   color: "bg-teal-600"    },
];

const MOCK_EMPLOYEES = [
  { id: "EMP-001", name: "Tatenda Moyo",     dept: "Procurement",  role: "Senior Procurement Officer",  salary: "USD 3,200", status: "Active",    grade: "D4", joined: "2019-03-15", performance: 87 },
  { id: "EMP-002", name: "Alois Chikwanda",  dept: "Finance",      role: "Finance Officer",              salary: "USD 2,800", status: "Active",    grade: "D3", joined: "2020-07-01", performance: 82 },
  { id: "EMP-003", name: "Loveness Ndlovu",  dept: "Legal",        role: "Legal Officer",                salary: "USD 3,500", status: "Active",    grade: "D4", joined: "2018-11-20", performance: 91 },
  { id: "EMP-004", name: "Rufaro Chikwanda", dept: "Audit",        role: "Internal Auditor",             salary: "USD 2,900", status: "Active",    grade: "D3", joined: "2021-02-10", performance: 78 },
  { id: "EMP-005", name: "Simba Nkosi",      dept: "HR",           role: "HR Manager",                   salary: "USD 3,800", status: "Active",    grade: "D5", joined: "2017-09-05", performance: 93 },
  { id: "EMP-006", name: "Precious Dube",    dept: "ICT",          role: "Systems Analyst",              salary: "USD 3,100", status: "On Leave",  grade: "D4", joined: "2020-04-15", performance: 85 },
  { id: "EMP-007", name: "Fortune Mutanga",  dept: "Stores",       role: "Stores Officer",               salary: "USD 1,900", status: "Active",    grade: "C3", joined: "2022-01-03", performance: 74 },
  { id: "EMP-008", name: "Memory Mpofu",     dept: "Procurement",  role: "Procurement Assistant",        salary: "USD 1,600", status: "Probation", grade: "C2", joined: "2025-09-15", performance: 68 },
];

const LEAVE_REQUESTS = [
  { emp: "T. Moyo",       type: "Annual",    from: "2026-07-14", to: "2026-07-25", days: 8,  status: "Approved"  },
  { emp: "A. Chikwanda",  type: "Medical",   from: "2026-06-28", to: "2026-07-02", days: 3,  status: "Approved"  },
  { emp: "P. Dube",       type: "Annual",    from: "2026-06-20", to: "2026-07-11", days: 15, status: "Active"    },
  { emp: "F. Mutanga",    type: "Maternity", from: "2026-07-01", to: "2026-09-30", days: 90, status: "Approved"  },
  { emp: "M. Mpofu",      type: "Study",     from: "2026-07-18", to: "2026-07-22", days: 3,  status: "Pending"   },
];

const VACANCIES = [
  { title: "Senior Procurement Officer",   dept: "Procurement",  closing: "2026-07-15", applicants: 24, grade: "D4", status: "Open"       },
  { title: "Budget Analyst",               dept: "Finance",      closing: "2026-07-20", applicants: 18, grade: "D3", status: "Open"       },
  { title: "IT Support Specialist",        dept: "ICT",          closing: "2026-06-30", applicants: 31, grade: "C4", status: "Interview"  },
  { title: "Compliance Officer",           dept: "Audit",        closing: "2026-07-10", applicants: 12, grade: "D4", status: "Shortlisted"},
];

const HR_KPIS = [
  { label: "Total Headcount",    value: "1,284", delta: "+12 this month", positive: true  },
  { label: "Vacancies",          value: "47",    delta: "Open positions",  positive: false },
  { label: "Leave This Month",   value: "89",    delta: "Approved",        positive: true  },
  { label: "Avg Performance",    value: "83.4%", delta: "+2.1% vs LY",    positive: true  },
  { label: "Payroll (Monthly)",  value: "USD 3.2M", delta: "This cycle",   positive: true  },
  { label: "Training Hrs (MTD)", value: "2,481", delta: "On target",       positive: true  },
  { label: "Turnover Rate",      value: "4.2%",  delta: "-0.8% vs LY",    positive: true  },
  { label: "Disciplinary Cases", value: "6",     delta: "Active",          positive: false },
];

export default function HumanResourcesPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  const filtered = MOCK_EMPLOYEES.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.dept.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<string, string> = {
    Active:    "bg-emerald-100 text-emerald-700",
    "On Leave":"bg-amber-100 text-amber-700",
    Probation: "bg-blue-100 text-blue-700",
    Resigned:  "bg-red-100 text-red-700",
  };

  const perfColor = (p: number) => p >= 90 ? "text-emerald-600" : p >= 75 ? "text-amber-600" : "text-red-500";

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* AI Header */}
        <div className="bg-[#0f172a] text-white px-5 py-4 flex items-center gap-3" style={{ borderRadius: 0 }}>
          <div className="h-10 w-10 rounded-full ai-logo-gradient ai-logo-glow flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-bold">Human Resources Management</h1>
            <p className="text-blue-300 text-xs">Complete HR lifecycle — Recruitment to Retirement · AI-Powered</p>
          </div>
          <button onClick={() => setShowAddEmployee(true)}
            className="h-8 px-4 bg-blue-600 text-white text-xs font-semibold flex items-center gap-2 hover:bg-blue-500 appois-glow-on-hover transition-all" style={{ borderRadius: 0 }}>
            <UserPlus className="h-3.5 w-3.5" /> New Employee
          </button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {HR_KPIS.map(k => (
            <div key={k.label} className="bg-white border border-black/10 p-3 dashboard-tile cursor-pointer">
              <div className="text-[9px] text-black/40 uppercase tracking-wider mb-1">{k.label}</div>
              <div className="text-lg font-bold text-[#0f172a]">{k.value}</div>
              <div className={`text-[10px] font-medium mt-0.5 ${k.positive ? "text-emerald-600" : "text-red-500"}`}>{k.delta}</div>
            </div>
          ))}
        </div>

        {/* Module Grid */}
        <div>
          <h2 className="text-sm font-bold text-[#0f172a] mb-3 flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> HR Modules
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {HR_MODULES.map(m => {
              const Icon = m.icon;
              const isActive = activeModule === m.to;
              return (
                <button key={m.to} onClick={() => setActiveModule(isActive ? null : m.to)}
                  className={`flex flex-col items-start gap-2 p-4 border text-left transition-all dashboard-tile ${isActive ? "bg-[#0f172a] text-white border-[#0f172a]" : "bg-white border-black/10 hover:border-black/30"}`}
                  style={{ borderRadius: 0 }}>
                  <div className={`h-8 w-8 flex items-center justify-center ${isActive ? "bg-white/20" : m.color}`} style={{ borderRadius: 0 }}>
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-white"}`} />
                  </div>
                  <div className={`text-xs font-bold ${isActive ? "text-white" : "text-[#0f172a]"}`}>{m.label}</div>
                  <div className={`text-[10px] leading-tight ${isActive ? "text-white/70" : "text-black/40"}`}>{m.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Employee Directory */}
        <Card>
          <CardHeader title="Employee Directory" subtitle={`${filtered.length} employees`}
            action={
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees…"
                    className="h-8 pl-8 pr-3 text-xs border border-black/10 focus:outline-none" style={{ borderRadius: 0, width: "160px" }} />
                </div>
                <button className="h-8 px-3 bg-[#0f172a] text-white text-xs flex items-center gap-1.5 hover:bg-black/80 appois-glow-on-hover" style={{ borderRadius: 0 }}>
                  <Download className="h-3 w-3" /> Export
                </button>
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0f172a] text-white">
                <tr>
                  {["ID", "Name", "Department", "Role", "Grade", "Salary", "Performance", "Status", "Joined"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-[#F9F9F9] cursor-pointer transition-colors vendor-row">
                    <td className="px-3 py-2.5 text-[10px] font-mono text-black/50">{e.id}</td>
                    <td className="px-3 py-2.5 text-xs font-semibold text-[#0f172a]">{e.name}</td>
                    <td className="px-3 py-2.5 text-xs text-black/70">{e.dept}</td>
                    <td className="px-3 py-2.5 text-xs text-black/70">{e.role}</td>
                    <td className="px-3 py-2.5 text-[10px] font-bold text-black/60">{e.grade}</td>
                    <td className="px-3 py-2.5 text-xs font-semibold text-emerald-700">{e.salary}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-black/8 h-1.5 overflow-hidden" style={{ borderRadius: 0 }}>
                          <div className={`h-full ${e.performance >= 90 ? "bg-emerald-500" : e.performance >= 75 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${e.performance}%` }} />
                        </div>
                        <span className={`text-[10px] font-bold ${perfColor(e.performance)}`}>{e.performance}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 ${statusColor[e.status] ?? "bg-gray-100 text-gray-600"}`} style={{ borderRadius: 0 }}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[10px] text-black/40 whitespace-nowrap">{e.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Vacancies */}
          <Card>
            <CardHeader title="Open Vacancies" subtitle={`${VACANCIES.length} positions`}
              action={<button className="h-7 px-2.5 bg-[#0f172a] text-white text-[10px] flex items-center gap-1 hover:bg-black/80" style={{ borderRadius: 0 }}><Plus className="h-3 w-3" /> Post</button>} />
            <div className="divide-y divide-black/5">
              {VACANCIES.map((v, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9F9F9] cursor-pointer transition-colors">
                  <div className="h-8 w-8 bg-[#0f172a] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0" style={{ borderRadius: 0 }}>
                    {v.grade}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#0f172a] truncate">{v.title}</div>
                    <div className="text-[10px] text-black/40">{v.dept} · Closes {v.closing}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-blue-700">{v.applicants}</div>
                    <div className="text-[9px] text-black/30">applicants</div>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 flex-shrink-0 ${v.status === "Open" ? "bg-blue-100 text-blue-700" : v.status === "Interview" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`} style={{ borderRadius: 0 }}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Leave Requests */}
          <Card>
            <CardHeader title="Leave Requests" subtitle="Current & upcoming" />
            <div className="divide-y divide-black/5">
              {LEAVE_REQUESTS.map((l, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="h-8 w-8 bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0" style={{ borderRadius: 0 }}>
                    {l.emp.split(" ").map(x => x[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#0f172a]">{l.emp}</div>
                    <div className="text-[10px] text-black/40">{l.type} · {l.from} → {l.to} · {l.days} days</div>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 ${l.status === "Approved" ? "bg-emerald-100 text-emerald-700" : l.status === "Active" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`} style={{ borderRadius: 0 }}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI HR Assistant */}
        <div className="bg-violet-50 border border-violet-200 p-4 flex items-start gap-3" style={{ borderRadius: 0 }}>
          <div className="h-8 w-8 rounded-full ai-logo-gradient ai-logo-glow flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-violet-800 mb-1">AI HR Assistant</div>
            <p className="text-xs text-violet-700">There are 47 open vacancies. Turnover rate improved to 4.2% (down 0.8%). 8 employees on probation have appraisals due this month. 12 training certificates expire within 30 days. Employee #EMP-008 (M. Mpofu) is on probation — 3-month review due 15 December 2025.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
