// Mock data for the National Procurement Platform — Government of Zimbabwe

export const kpis = {
  totalSpend: { value: "USD 2.84B", delta: "+6.2%", label: "Total Procurement Spend (YTD)" },
  activeTenders: { value: "1,287", delta: "+42", label: "Active Tenders" },
  openEvaluations: { value: "318", delta: "+12", label: "Open Evaluations" },
  contractsInProgress: { value: "964", delta: "+8", label: "Contracts in Progress" },
  procurementSavings: { value: "USD 184M", delta: "+11.4%", label: "Procurement Savings" },
  complianceScore: { value: "94.2%", delta: "+1.8 pts", label: "Compliance Score" },
  fraudAlerts: { value: "23", delta: "-5", label: "Open Fraud Alerts" },
  budgetUtilization: { value: "67.8%", delta: "On track", label: "Budget Utilization" },
};

export const spendTrend = [
  { month: "Jan", spend: 180, savings: 12 },
  { month: "Feb", spend: 210, savings: 14 },
  { month: "Mar", spend: 245, savings: 18 },
  { month: "Apr", spend: 230, savings: 17 },
  { month: "May", spend: 268, savings: 21 },
  { month: "Jun", spend: 290, savings: 24 },
  { month: "Jul", spend: 305, savings: 26 },
  { month: "Aug", spend: 312, savings: 28 },
  { month: "Sep", spend: 340, savings: 31 },
  { month: "Oct", spend: 358, savings: 33 },
  { month: "Nov", spend: 372, savings: 35 },
  { month: "Dec", spend: 390, savings: 38 },
];

export const categorySpend = [
  { name: "Infrastructure", value: 38 },
  { name: "Health & Pharma", value: 22 },
  { name: "ICT & Digital", value: 14 },
  { name: "Agriculture", value: 11 },
  { name: "Education", value: 9 },
  { name: "Other", value: 6 },
];

export const provinceSpend = [
  { province: "Harare", spend: 720, tenders: 312 },
  { province: "Bulawayo", spend: 410, tenders: 188 },
  { province: "Manicaland", spend: 280, tenders: 124 },
  { province: "Mashonaland West", spend: 245, tenders: 102 },
  { province: "Mashonaland East", spend: 220, tenders: 96 },
  { province: "Mashonaland Central", spend: 198, tenders: 88 },
  { province: "Midlands", spend: 235, tenders: 110 },
  { province: "Masvingo", spend: 175, tenders: 74 },
  { province: "Matabeleland North", spend: 142, tenders: 61 },
  { province: "Matabeleland South", spend: 125, tenders: 54 },
];

export type Tender = {
  id: string;
  title: string;
  entity: string;
  category: string;
  value: string;
  method: "Open" | "Restricted" | "Direct" | "Framework" | "RFQ";
  status: "Draft" | "Published" | "Bidding" | "Evaluation" | "Awarded" | "Cancelled";
  closing: string;
  bids: number;
};

export const tenders: Tender[] = [
  { id: "ZW-PRA-2026-00184", title: "Supply & Installation of Solar Mini-Grids — 12 Rural Clinics", entity: "Ministry of Energy", category: "Infrastructure", value: "USD 14,800,000", method: "Open", status: "Bidding", closing: "2026-07-08", bids: 11 },
  { id: "ZW-PRA-2026-00183", title: "Procurement of Antiretroviral Medicines (2-Year Framework)", entity: "Ministry of Health & Child Care", category: "Health & Pharma", value: "USD 42,500,000", method: "Framework", status: "Evaluation", closing: "2026-06-12", bids: 8 },
  { id: "ZW-PRA-2026-00182", title: "National Tax Administration System — Phase II", entity: "ZIMRA", category: "ICT & Digital", value: "USD 9,200,000", method: "Restricted", status: "Bidding", closing: "2026-07-21", bids: 5 },
  { id: "ZW-PRA-2026-00181", title: "Rehabilitation of Beitbridge–Harare Highway (Section 4)", entity: "Ministry of Transport", category: "Infrastructure", value: "USD 88,000,000", method: "Open", status: "Published", closing: "2026-08-04", bids: 0 },
  { id: "ZW-PRA-2026-00180", title: "Supply of Fertiliser — Pfumvudza Programme 2026/27", entity: "Ministry of Agriculture", category: "Agriculture", value: "USD 31,400,000", method: "Open", status: "Awarded", closing: "2026-05-30", bids: 14 },
  { id: "ZW-PRA-2026-00179", title: "Provision of External Audit Services (3 Years)", entity: "Office of the Auditor-General", category: "Services", value: "USD 1,850,000", method: "Open", status: "Evaluation", closing: "2026-06-18", bids: 9 },
  { id: "ZW-PRA-2026-00178", title: "School Textbooks — Primary Grades 1–7", entity: "Ministry of Primary & Secondary Education", category: "Education", value: "USD 6,700,000", method: "Open", status: "Bidding", closing: "2026-07-02", bids: 12 },
  { id: "ZW-PRA-2026-00177", title: "Construction of 4 District Hospitals", entity: "Ministry of Health & Child Care", category: "Infrastructure", value: "USD 56,000,000", method: "Open", status: "Draft", closing: "2026-09-15", bids: 0 },
];

export const aiAgents = [
  { name: "Supplier Verification Agent", status: "Active", confidence: 96, actions: 1284, pending: 4 },
  { name: "Tender Drafting Copilot", status: "Active", confidence: 92, actions: 318, pending: 7 },
  { name: "Compliance Checker", status: "Active", confidence: 98, actions: 2104, pending: 2 },
  { name: "Fraud Detection Agent", status: "Active", confidence: 89, actions: 412, pending: 23 },
  { name: "Technical Evaluation Agent", status: "Active", confidence: 91, actions: 264, pending: 18 },
  { name: "Financial Evaluation Agent", status: "Active", confidence: 94, actions: 241, pending: 9 },
  { name: "Award Recommendation Agent", status: "Active", confidence: 90, actions: 138, pending: 6 },
  { name: "Contract Intelligence Agent", status: "Active", confidence: 93, actions: 587, pending: 11 },
  { name: "Vendor Performance Agent", status: "Active", confidence: 95, actions: 921, pending: 3 },
  { name: "Procurement Auditor Agent", status: "Standby", confidence: 88, actions: 76, pending: 1 },
  { name: "Executive AI Advisor", status: "Active", confidence: 92, actions: 154, pending: 0 },
];

export const vendors = [
  { id: "VEN-00482", name: "Highveld Engineering (Pvt) Ltd", category: "Infrastructure", rating: 4.7, contracts: 18, status: "Approved", risk: "Low" },
  { id: "VEN-00481", name: "Zimbabwe Pharma Holdings", category: "Health & Pharma", rating: 4.5, contracts: 24, status: "Approved", risk: "Low" },
  { id: "VEN-00480", name: "Sable ICT Solutions", category: "ICT & Digital", rating: 4.2, contracts: 11, status: "Approved", risk: "Medium" },
  { id: "VEN-00479", name: "Mashonaland Agri Supplies", category: "Agriculture", rating: 4.4, contracts: 16, status: "Approved", risk: "Low" },
  { id: "VEN-00478", name: "Bulawayo Civil Works", category: "Infrastructure", rating: 3.9, contracts: 9, status: "Under Review", risk: "Medium" },
  { id: "VEN-00477", name: "Eastern Highlands Logistics", category: "Logistics", rating: 4.1, contracts: 7, status: "Approved", risk: "Low" },
  { id: "VEN-00476", name: "Granite Construction Group", category: "Infrastructure", rating: 2.8, contracts: 4, status: "Blacklisted", risk: "High" },
];

export const contracts = [
  { id: "CN-2026-0418", title: "ARV Medicines Framework", vendor: "Zimbabwe Pharma Holdings", value: "USD 42.5M", progress: 38, status: "On Track", end: "2028-03-31" },
  { id: "CN-2026-0411", title: "Beitbridge Highway Section 3", vendor: "Highveld Engineering", value: "USD 71.0M", progress: 64, status: "On Track", end: "2026-12-15" },
  { id: "CN-2026-0404", title: "ZIMRA Tax System Phase I", vendor: "Sable ICT Solutions", value: "USD 7.8M", progress: 82, status: "At Risk", end: "2026-08-30" },
  { id: "CN-2026-0399", title: "Pfumvudza Fertiliser 2025/26", vendor: "Mashonaland Agri Supplies", value: "USD 28.4M", progress: 100, status: "Completed", end: "2026-05-30" },
  { id: "CN-2026-0388", title: "Primary School Textbooks 2025", vendor: "Sable Press Ltd", value: "USD 5.2M", progress: 47, status: "On Track", end: "2026-11-01" },
];

export const roles = [
  "Chief Procurement Officer", "Procurement Officer", "Evaluation Officer", "Adjudication Officer",
  "Finance Officer", "Project Manager", "Contract Manager", "Audit Officer",
  "Anti-Corruption Officer", "Compliance Officer", "Legal Officer", "Stores Officer",
  "Records Officer", "Executive Director", "Board Member", "Regulator",
  "System Administrator", "AI Governance Officer", "Data Analytics Officer", "Risk Officer",
  "Ethics Officer", "Quality Assurance Officer", "Inspection Officer", "Asset Manager",
  "Budget Officer", "Treasury Officer", "End User", "SME Supplier",
  "Contract Officer", "Vendor User", "Citizen", "Public Auditor",
];

import { Users, Activity, DollarSign, type LucideIcon } from "lucide-react";

export const monthlyTransactions = [
  { month: "Jan", volume: 1200000, share: 32 },
  { month: "Feb", volume: 1540000, share: 28 },
  { month: "Mar", volume: 1820000, share: 31 },
  { month: "Apr", volume: 1480000, share: 25 },
  { month: "May", volume: 2100000, share: 33 },
  { month: "Jun", volume: 1960000, share: 22 },
  { month: "Jul", volume: 2340000, share: 27 },
  { month: "Aug", volume: 2180000, share: 20 },
  { month: "Sep", volume: 2640000, share: 35 },
  { month: "Oct", volume: 2480000, share: 29 },
  { month: "Nov", volume: 2820000, share: 31 },
  { month: "Dec", volume: 3100000, share: 38 },
];

export const dailyReport: { label: string; today: string; total: string; color: string; icon: LucideIcon }[] = [
  { label: "Customers (T+1)", today: "248", total: "325,678", color: "#f59e0b", icon: Users },
  { label: "Transactions (T+1)", today: "664,657", total: "5,691,234", color: "#3b82f6", icon: Activity },
  { label: "Commission (T+1)", today: "912", total: "6,312", color: "#10b981", icon: DollarSign },
];

export const riskLoanData = [
  { type: "Housing loan", risk: "7.31%", amount: 280 },
  { type: "Second-hand", risk: "7.65%", amount: 310 },
  { type: "Other loans", risk: "9.97%", amount: 420 },
  { type: "House net worth", risk: "10.42%", amount: 380 },
  { type: "Mixed interest", risk: "12.05%", amount: 510 },
];

export const hrTurnoverData = {
  projectNumbers: [
    { projects: 2, turnover: 1567 },
    { projects: 3, turnover: 72 },
    { projects: 4, turnover: 409 },
    { projects: 5, turnover: 612 },
    { projects: 6, turnover: 655 },
    { projects: 7, turnover: 256 },
  ],
  positions: [
    { pos: "hr", rate: 15, count: 800 },
    { pos: "accounting", rate: 12, count: 600 },
    { pos: "technical", rate: 8, count: 1200 },
    { pos: "support", rate: 18, count: 400 },
    { pos: "sales", rate: 22, count: 1400 },
    { pos: "marketing", rate: 14, count: 700 },
    { pos: "IT", rate: 9, count: 900 },
  ],
};

export const navSections = [
  {
    label: "Command",
    items: [
      { to: "/dashboard", label: "Command Center", icon: "LayoutDashboard" },
      { to: "/analytics", label: "Analytics & BI", icon: "BarChart3" },
      { to: "/ai-agents", label: "AI Operations", icon: "Sparkles" },
    ],
  },
  {
    label: "Procurement Instruments",
    items: [
      { to: "/tenders-lifecycle", label: "Tender Management", icon: "FileText" },
      { to: "/rfq", label: "RFQ Management", icon: "ShoppingCart" },
      { to: "/rfp-eoi", label: "RFP & EOI", icon: "BarChart3" },
      { to: "/auctions", label: "Live Auctions", icon: "Gavel" },
    ],
  },
  {
    label: "Procurement Lifecycle",
    items: [
      { to: "/planning", label: "Planning & Demand", icon: "ClipboardList" },
      { to: "/tenders", label: "Tenders Register", icon: "FileText" },
      { to: "/evaluations", label: "Evaluations", icon: "ScaleIcon" },
      { to: "/awards", label: "Awards & Appeals", icon: "Trophy" },
    ],
  },
  {
    label: "Suppliers & Contracts",
    items: [
      { to: "/vendors", label: "Vendor Management", icon: "Building2" },
      { to: "/contracts", label: "Contract Management", icon: "FileSignature" },
      { to: "/performance", label: "Vendor Performance", icon: "TrendingUp" },
    ],
  },
  {
    label: "Finance & Audit",
    items: [
      { to: "/finance", label: "Invoices & Payments", icon: "Wallet" },
      { to: "/audit", label: "Audit & Compliance", icon: "ShieldCheck" },
      { to: "/anti-corruption", label: "Anti-Corruption", icon: "AlertOctagon" },
    ],
  },
  {
    label: "Governance",
    items: [
      { to: "/governance", label: "Governance & Master Data", icon: "Landmark" },
      { to: "/roles", label: "Role Management", icon: "UsersRound" },
      { to: "/portal", label: "Public Transparency", icon: "Globe2" },
    ],
  },
];
