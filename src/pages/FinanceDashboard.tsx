import { useState } from "react";
import { AppShell, PageHeader, Card, CardHeader, Badge, KpiCard } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import TodayActivity from "@/components/TodayActivity";
import { useInvoices } from "@/hooks/use-store";
import { pushNotification } from "@/lib/local-store";
import { generateDailyReportPDF } from "@/lib/pdf-report";
import { DollarSign, Clock, CheckCircle2, AlertTriangle, Sparkles, Plus, Download } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const TABS = ["Invoice Queue", "Payments", "Budget", "AI Insights", "Today"] as const;
type Tab = typeof TABS[number];

const PAYMENT_DATA = [
  { month: "Jan", invoices: 420, payments: 380 },
  { month: "Feb", invoices: 510, payments: 490 },
  { month: "Mar", invoices: 580, payments: 560 },
  { month: "Apr", invoices: 490, payments: 470 },
  { month: "May", invoices: 620, payments: 595 },
  { month: "Jun", invoices: 540, payments: 510 },
];

export default function FinanceDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("Invoice Queue");
  const { invoices, update: updateInvoice, refresh } = useInvoices();
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [newInv, setNewInv] = useState({ vendor: "", amount: "", poRef: "" });

  const handleApprove = (id: string) => {
    updateInvoice(id, { status: "Approved" });
    pushNotification(`Invoice ${id} approved`, "success");
    refresh();
  };

  const handleAddInvoice = () => {
    if (!newInv.vendor || !newInv.amount) return;
    const inv = {
      id: `INV-2026-${Date.now()}`,
      vendor: newInv.vendor,
      amount: `USD ${Number(newInv.amount).toLocaleString()}`,
      status: "Pending",
      submittedDate: new Date().toISOString().split("T")[0],
      poRef: newInv.poRef || "—",
      submittedBy: user?.name ?? "Finance",
    };
    pushNotification(`Invoice submitted: ${inv.id}`, "success");
    setShowAddInvoice(false);
    setNewInv({ vendor: "", amount: "", poRef: "" });
    refresh();
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <PageHeader title={`Finance: ${user?.name}`} description="Invoice & Payment Management · Ministry of Finance"
          actions={
            <div className="flex gap-2">
              <button onClick={() => user && generateDailyReportPDF(user)}
                className="h-9 px-4 rounded-xl border border-black/10 bg-white text-sm font-medium hover:bg-[#F5F5F5] flex items-center gap-1.5 transition-colors">
                <Download className="h-4 w-4" /> Daily Report
              </button>
              <button onClick={() => setShowAddInvoice(!showAddInvoice)}
                className="h-9 px-4 rounded-xl bg-black text-white text-sm font-medium flex items-center gap-1.5 hover:bg-gray-800 transition-colors">
                <Plus className="h-4 w-4" /> Submit Invoice
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KpiCard label="Invoices This Month" value={String(invoices.length + 2840)} delta="+142 new" icon={DollarSign} color="blue" />
          <KpiCard label="Awaiting Approval" value={String(invoices.filter(i => i.status === "Pending" || i.status === "Matching").length)} delta="Review needed" positive={false} icon={Clock} color="amber" />
          <KpiCard label="Paid This Month" value="USD 124.6M" delta="+8.4%" icon={CheckCircle2} color="green" />
          <KpiCard label="Exceptions" value="23" delta="Needs review" positive={false} icon={AlertTriangle} color="red" />
        </div>

        {showAddInvoice && (
          <Card className="mb-4 p-5">
            <div className="text-sm font-semibold text-black mb-4">Submit New Invoice</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div><label className="text-xs font-medium text-black/40 uppercase tracking-wider">Vendor Name</label>
                <input value={newInv.vendor} onChange={e => setNewInv(n => ({ ...n, vendor: e.target.value }))} placeholder="Vendor name" className="mt-1 w-full h-9 px-3 rounded-lg border border-black/10 bg-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-black/10" /></div>
              <div><label className="text-xs font-medium text-black/40 uppercase tracking-wider">Amount (USD)</label>
                <input type="number" value={newInv.amount} onChange={e => setNewInv(n => ({ ...n, amount: e.target.value }))} placeholder="0.00" className="mt-1 w-full h-9 px-3 rounded-lg border border-black/10 bg-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-black/10" /></div>
              <div><label className="text-xs font-medium text-black/40 uppercase tracking-wider">PO Reference</label>
                <input value={newInv.poRef} onChange={e => setNewInv(n => ({ ...n, poRef: e.target.value }))} placeholder="PO-2026-XXXX" className="mt-1 w-full h-9 px-3 rounded-lg border border-black/10 bg-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-black/10" /></div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddInvoice} className="h-9 px-4 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors">Submit Invoice</button>
              <button onClick={() => setShowAddInvoice(false)} className="h-9 px-4 rounded-xl border border-black/10 text-sm hover:bg-[#F5F5F5] transition-colors">Cancel</button>
            </div>
          </Card>
        )}

        <div className="flex gap-1 mb-6 border-b border-black/10 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"}`}>{t}</button>
          ))}
        </div>

        {tab === "Invoice Queue" && (
          <Card>
            <CardHeader title="Invoice Queue — 3-Way Matching" action={<Badge>Live</Badge>} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F5F5F5] text-xs text-black/40">
                  <tr>{["Invoice ID","Vendor","PO Ref","Amount","Submitted","Status","Action"].map(h => <th key={h} className="text-left font-medium px-5 py-2.5 whitespace-nowrap">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-[#F5F5F5]/50">
                      <td className="px-5 py-3 font-mono text-[11px] text-black/40">{inv.id}</td>
                      <td className="px-5 py-3 font-medium text-black">{inv.vendor}</td>
                      <td className="px-5 py-3 font-mono text-[11px] text-black/40">{inv.poRef}</td>
                      <td className="px-5 py-3 font-semibold text-black">{inv.amount}</td>
                      <td className="px-5 py-3 text-black/60 whitespace-nowrap">{inv.submittedDate}</td>
                      <td className="px-5 py-3"><Badge tone={inv.status === "Approved" ? "green" : inv.status === "Paid" ? "green" : inv.status === "Exception" ? "red" : "amber"}>{inv.status}</Badge></td>
                      <td className="px-5 py-3">
                        {inv.status === "Pending" || inv.status === "Matching"
                          ? <button onClick={() => handleApprove(inv.id)} className="h-7 px-2.5 rounded-lg bg-black text-white text-xs hover:bg-gray-800 transition-colors">Approve</button>
                          : inv.status === "Approved" ? <button className="h-7 px-2.5 rounded-lg border border-black/10 text-xs hover:bg-[#F5F5F5] transition-colors">Schedule Pay</button>
                          : <span className="text-xs text-black/30">—</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === "Payments" && (
          <Card>
            <CardHeader title="Payment Schedule" subtitle="Invoices vs Payments" />
            <div className="p-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PAYMENT_DATA}>
                  <CartesianGrid stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#aaa" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#aaa" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #eee", borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="invoices" fill="#111" radius={[3,3,0,0]} name="Invoices" />
                  <Bar dataKey="payments" fill="#888" radius={[3,3,0,0]} name="Payments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {tab === "Budget" && (
          <div className="space-y-3">
            {[
              { cat: "Infrastructure", budget: "USD 840M", spent: "USD 612M", pct: 73, color: "bg-blue-500" },
              { cat: "Health & Pharma", budget: "USD 420M", spent: "USD 318M", pct: 76, color: "bg-emerald-500" },
              { cat: "ICT & Digital",   budget: "USD 210M", spent: "USD 148M", pct: 70, color: "bg-violet-500" },
              { cat: "Agriculture",     budget: "USD 380M", spent: "USD 272M", pct: 72, color: "bg-amber-500" },
              { cat: "Education",       budget: "USD 180M", spent: "USD 124M", pct: 69, color: "bg-pink-500" },
            ].map(b => (
              <div key={b.cat} className="bg-white border border-black/10 rounded-2xl px-5 py-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-black">{b.cat}</span>
                  <span className="text-sm text-black/50">{b.spent} / {b.budget} · <span className="font-semibold text-black">{b.pct}%</span></span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${b.color} transition-all`} style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "AI Insights" && (
          <div className="space-y-3">
            {[
              { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50", title: "Overpricing Detected", body: "INV-2026-4819 — Sable ICT Solutions billed 18% above contract rate for Phase 1 deliverables.", action: "Flag for Review", actionFn: () => { pushNotification("INV-2026-4819 flagged for overpricing review", "warning"); alert("✅ Invoice INV-2026-4819 has been flagged. Procurement officer notified."); } },
              { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", title: "3-Way Match Passed", body: "INV-2026-4821 — Highveld Engineering PO, GRN, and invoice match confirmed. Ready for payment.", action: "Approve Payment", actionFn: () => { updateInvoice("INV-2026-4821", { status: "Approved" }); pushNotification("INV-2026-4821 approved for payment", "success"); alert("✅ Payment approved! INV-2026-4821 — USD 2,840,000 scheduled for disbursement."); refresh(); } },
              { icon: Sparkles, color: "text-blue-500", bg: "bg-blue-50", title: "Payment Forecast", body: "USD 48.2M due in next 14 days across 12 vendors. Recommend scheduling treasury transfer this week.", action: "View Schedule", actionFn: () => alert("📊 Payment Schedule:\n\nWeek 1 (Jun 24–28):\n• Highveld Engineering — USD 2.84M\n• Zimbabwe Pharma — USD 1.2M\n\nWeek 2 (Jul 1–5):\n• Sable ICT — USD 680K\n• Mashonaland Agri — USD 3.1M\n\nTotal: USD 48.2M across 12 vendors") },
              { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", title: "Duplicate Invoice Risk", body: "INV-2026-4817 shares amount and vendor with INV-2026-4802 submitted last month. Review required.", action: "Investigate", actionFn: () => { pushNotification("Duplicate invoice investigation opened", "warning"); alert("⚠️ Investigation opened.\n\nINV-2026-4817 vs INV-2026-4802:\n• Same vendor: Eastern Highlands Logistics\n• Same amount: USD 440,000\n• 31-day gap\n\nAI confidence: 87% duplicate risk. Payment held pending review."); } },
            ].map((a, i) => (
              <div key={i} className={`${a.bg} border border-black/5 rounded-2xl px-5 py-4 flex items-center justify-between gap-4`}>
                <div className="flex items-start gap-3">
                  <a.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${a.color}`} />
                  <div>
                    <div className="text-sm font-semibold text-black">{a.title}</div>
                    <div className="text-xs text-black/60 mt-0.5">{a.body}</div>
                  </div>
                </div>
                <button onClick={a.actionFn} className="h-8 px-3 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors flex-shrink-0">{a.action}</button>
              </div>
            ))}
          </div>
        )}

        {tab === "Today" && <TodayActivity />}
      </div>
      <AIAssistantPanel agentName="Payment AI" agentRole="Invoice validation, fraud detection, payment risk" context="finance dashboard" color="blue"
        suggestedPrompts={["Check for duplicate invoices","Validate 3-way match","Forecast cash flow","Flag overpriced invoices"]} />
    </AppShell>
  );
}
