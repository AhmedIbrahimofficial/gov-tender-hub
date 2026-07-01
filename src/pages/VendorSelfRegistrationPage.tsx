/**
 * VendorSelfRegistrationPage — Self-service vendor/supplier registration.
 * Vendors fill this form themselves and submit as an application.
 * Admin reviews and approves/rejects.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2, ShieldCheck, Upload, Sparkles, X, ChevronRight,
  Building2, Mail, Phone, MapPin, FileText, Globe2, User,
  AlertTriangle, Info, Plus, Trash2,
} from "lucide-react";
import { pushNotification } from "@/lib/local-store";

// Supplier category codes from documents
const SERVICE_CODES = [
  { code: "100", label: "Security Services" }, { code: "101", label: "Hotel and Catering Services" },
  { code: "102", label: "Tourism and Travel" }, { code: "103", label: "Hazardous Material Disposal" },
  { code: "104", label: "Maintenance of Vehicles & Machinery" }, { code: "111", label: "Maintenance of Vehicles Related Equipment" },
  { code: "112", label: "Maintenance of Medical Equipment" }, { code: "113", label: "Aircraft Maintenance" },
  { code: "115", label: "Office Equipment Maintenance" }, { code: "116", label: "Broadcasting & Audio Visual" },
  { code: "118", label: "Telecommunication Services" }, { code: "119", label: "Postal and Courier Services" },
  { code: "120", label: "ICT Technical Support" }, { code: "127", label: "Insurance & Pension" },
  { code: "128", label: "Media Services" }, { code: "129", label: "Passenger Transport" },
  { code: "130", label: "Freight Services" }, { code: "131", label: "Rental Services" },
  { code: "132", label: "Cleaning Services" }, { code: "133", label: "Public Utilities" },
  { code: "134", label: "Health Services" }, { code: "135", label: "Customs & Shipping" },
  { code: "136", label: "Auctioneering Services" }, { code: "137", label: "Gardening & Landscaping" },
  { code: "138", label: "Marketing & Public Relations" }, { code: "139", label: "Miscellaneous Services" },
  { code: "140", label: "Calibration Services" }, { code: "141", label: "Language & Interpretation" },
  { code: "142", label: "Aviation Services" }, { code: "143", label: "Human Resources Services" },
  { code: "144", label: "Training Services" }, { code: "145", label: "Safety Health & Environment" },
];
const SUPPLY_CODES = [
  { code: "200", label: "Agriculture Products & Equipment" }, { code: "201", label: "Printed Matter & Equipment" },
  { code: "202", label: "Medical Supplies & Equipment" }, { code: "203", label: "Electrical, Electronic & ICT" },
  { code: "207", label: "Food Supplies" }, { code: "208", label: "Transport Equipment & Accessories" },
  { code: "211", label: "General Supplies" }, { code: "212", label: "Manufacturers — Agricultural" },
  { code: "213", label: "General Manufacturers/Producers" }, { code: "214", label: "Petroleum Products" },
  { code: "216", label: "Gases" }, { code: "217", label: "Media Supplies" },
  { code: "218", label: "Psychosocial Material" }, { code: "219", label: "Defence Supplies" },
];
const CONSULTANT_CODES = [
  { code: "301", label: "Architecture Services" }, { code: "302", label: "Quantity Surveying" },
  { code: "303", label: "Civil Engineering" }, { code: "304", label: "Electrical Engineering" },
  { code: "305", label: "Mechanical Engineering" }, { code: "306", label: "Water Engineering" },
  { code: "307", label: "Mining Engineering" }, { code: "308", label: "Building Engineering" },
  { code: "311", label: "Project Management" }, { code: "313", label: "Environmental Services" },
  { code: "314", label: "Finance Related Services" }, { code: "315", label: "Human Resource Services" },
  { code: "317", label: "Other Consultancy Services" }, { code: "318", label: "Legal Services" },
  { code: "319", label: "ICT Consultancy" }, { code: "320", label: "Town & Regional Planning" },
  { code: "321", label: "Dispute Resolution" }, { code: "322", label: "Healthcare Consulting" },
  { code: "323", label: "Energy Management" },
];
const WORKS_CODES = [
  { code: "01", label: "Building Construction & Maintenance" }, { code: "02", label: "Electrical Engineering Works" },
  { code: "03", label: "Civil Engineering Works" }, { code: "04", label: "Works Maintenance" },
  { code: "05", label: "Water & Sewage Treatment" }, { code: "06", label: "Specialized Construction" },
  { code: "08", label: "Mechanical Engineering Works" }, { code: "09", label: "Drilling Works" },
  { code: "10", label: "Water Engineering Works" }, { code: "13", label: "Fencing Works" },
  { code: "14", label: "Roads — Ancillary Works" }, { code: "15", label: "Civil Aviation/Met Electronics" },
];

const STEPS = ["Company Details", "Ownership & Category", "Business Codes", "Directors & Shareholders", "Banking Details", "Documents", "Review & Submit"];

type Director = { name: string; middleName: string; surname: string; idNumber: string; nationality: string; gender: string; shareholding: string; youth: boolean; disabled: boolean };
type BankAccount = { accountName: string; bankName: string; accountNumber: string; branchName: string; accountType: string; branchCode: string; swiftCode: string };

function CodePicker({ codes, selected, onToggle, label }: {
  codes: { code: string; label: string }[];
  selected: string[];
  onToggle: (code: string) => void;
  label: string;
}) {
  const [search, setSearch] = useState("");
  const filtered = codes.filter(c =>
    c.code.includes(search) || c.label.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="border border-black/10" style={{ borderRadius: 0 }}>
      <div className="bg-[#0f172a] text-white text-xs font-semibold px-3 py-2">{label}</div>
      <div className="p-2 border-b border-black/8">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search codes…"
          className="w-full h-7 px-2 text-xs border border-black/10 focus:outline-none" style={{ borderRadius: 0 }} />
      </div>
      <div className="max-h-48 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
        {filtered.map(c => (
          <label key={c.code} className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer text-xs transition-colors ${selected.includes(c.code) ? "bg-blue-50 border border-blue-200 font-semibold text-blue-800" : "hover:bg-[#EAF1F8] border border-transparent"}`} style={{ borderRadius: 0 }}>
            <input type="checkbox" checked={selected.includes(c.code)} onChange={() => onToggle(c.code)} className="h-3 w-3" />
            <span className="font-mono text-[10px] text-black/40 flex-shrink-0">{c.code}</span>
            <span className="truncate">{c.label}</span>
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="px-3 py-2 border-t border-black/8 flex flex-wrap gap-1">
          {selected.map(code => {
            const item = codes.find(c => c.code === code);
            return item ? (
              <span key={code} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-semibold" style={{ borderRadius: 0 }}>
                {code} — {item.label}
                <button onClick={() => onToggle(code)} className="ml-0.5 text-blue-600 hover:text-blue-900"><X className="h-2.5 w-2.5" /></button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

export default function VendorSelfRegistrationPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const appRef = `VEN-APP-${new Date().getFullYear()}-${String(Math.floor(Math.random()*90000+10000))}`;

  // Form state
  const [applicationType, setApplicationType] = useState<"new" | "change">("new");
  const [ownership, setOwnership] = useState<string[]>([]);
  const [companyCategory, setCompanyCategory] = useState<string[]>([]);
  const [sector, setSector] = useState<string[]>([]);
  const [industry, setIndustry] = useState<string[]>([]);
  const [worksSize, setWorksSize] = useState<string[]>([]);
  const [serviceCodes, setServiceCodes] = useState<string[]>([]);
  const [supplyCodes, setSupplyCodes] = useState<string[]>([]);
  const [consultantCodes, setConsultantCodes] = useState<string[]>([]);
  const [worksCodes, setWorksCodes] = useState<string[]>([]);
  const [directors, setDirectors] = useState<Director[]>([{ name: "", middleName: "", surname: "", idNumber: "", nationality: "Zimbabwean", gender: "", shareholding: "", youth: false, disabled: false }]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([{ accountName: "", bankName: "", accountNumber: "", branchName: "", accountType: "", branchCode: "", swiftCode: "" }]);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "", companyReg: "", dateReg: "", taxTin: "", vatNumber: "",
    subsidiaries: "", physicalAddress: "", postalAddress: "",
    contactName: "", contactCell: "", contactEmail: "", contactPhone: "", contactFax: "",
    altName: "", altCell: "", altEmail: "",
    website: "", yearsInBusiness: "",
  });

  const setCI = (k: string, v: string) => setCompanyInfo(f => ({ ...f, [k]: v }));

  const toggleOwnership = (v: string) => setOwnership(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const toggleCompCat = (v: string) => setCompanyCategory(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const toggleSector = (v: string) => setSector(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const toggleIndustry = (v: string) => setIndustry(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const toggleWorksSize = (v: string) => setWorksSize(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const toggleServiceCode = (c: string) => setServiceCodes(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const toggleSupplyCode = (c: string) => setSupplyCodes(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const toggleConsultantCode = (c: string) => setConsultantCodes(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const toggleWorksCode = (c: string) => setWorksCodes(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  const addDirector = () => setDirectors(p => [...p, { name: "", middleName: "", surname: "", idNumber: "", nationality: "Zimbabwean", gender: "", shareholding: "", youth: false, disabled: false }]);
  const updateDirector = (i: number, k: keyof Director, v: any) => setDirectors(p => p.map((d, idx) => idx === i ? { ...d, [k]: v } : d));
  const removeDirector = (i: number) => setDirectors(p => p.filter((_, idx) => idx !== i));

  const addBankAccount = () => setBankAccounts(p => [...p, { accountName: "", bankName: "", accountNumber: "", branchName: "", accountType: "", branchCode: "", swiftCode: "" }]);
  const updateBank = (i: number, k: keyof BankAccount, v: string) => setBankAccounts(p => p.map((b, idx) => idx === i ? { ...b, [k]: v } : b));
  const removeBank = (i: number) => setBankAccounts(p => p.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    pushNotification(`Vendor application submitted: ${companyInfo.companyName || "New Vendor"} — Ref: ${appRef}`, "success");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#EAF1F8] flex flex-col items-center justify-center p-6">
        <div className="bg-white border border-black/10 w-full max-w-md p-8 text-center" style={{ borderRadius: 0 }}>
          <div className="h-16 w-16 bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-[#0f172a] mb-2">Application Submitted!</h2>
          <p className="text-sm text-black/60 mb-4">Your vendor registration application has been submitted for review. Admin will review and approve your application.</p>
          <div className="bg-[#EAF1F8] p-3 text-left text-xs mb-4 space-y-1">
            <div><span className="text-black/50">Reference: </span><strong className="font-mono">{appRef}</strong></div>
            <div><span className="text-black/50">Company: </span><strong>{companyInfo.companyName || "Your Company"}</strong></div>
            <div><span className="text-black/50">Status: </span><span className="text-amber-700 font-semibold">Pending Admin Review</span></div>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800 text-left mb-4">
            <strong>What happens next?</strong> Our procurement team will review your application within 5–10 business days. You will be notified via email once your application is approved or if additional information is required.
          </div>
          <Link to="/" className="block w-full text-center bg-[#0f172a] text-white py-3 text-sm font-semibold hover:bg-black/80 transition-colors" style={{ borderRadius: 0 }}>
            Return to Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAF1F8] flex flex-col">
      {/* Header */}
      <div className="bg-[#0f172a] text-white px-4 py-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full ai-logo-gradient ai-logo-glow flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-base">APPOIS — Supplier Registration</div>
          <div className="text-blue-300 text-xs">AI-Powered Electronic Public Procurement & Oversight Intelligence System</div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/supplier-registration"
            className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-colors">
            <FileText className="h-3.5 w-3.5" /> Official Paper Form
          </Link>
          <Link to="/" className="text-white/60 hover:text-white text-sm">← Back to Portal</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-6 flex-1">
        {/* Title */}
        <div className="bg-white border border-black/10 p-5 mb-4" style={{ borderRadius: 0 }}>
          <h1 className="text-lg font-bold text-[#0f172a] mb-1">SUPPLIER REGISTRATION FORM</h1>
          <p className="text-sm text-black/60">Complete this form to register as a supplier. Your application will be reviewed and approved by the Procurement Department.</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={applicationType === "new"} onChange={() => setApplicationType("new")} className="accent-[#0f172a]" />
              <span className="font-semibold">NEW APPLICATION</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={applicationType === "change"} onChange={() => setApplicationType("change")} className="accent-[#0f172a]" />
              <span className="font-semibold">NOTIFICATION OF CHANGE OF STATUS</span>
            </label>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center mb-4 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold cursor-pointer transition-colors
                ${step === i + 1 ? "bg-[#0f172a] text-white" : i + 1 < step ? "bg-emerald-600 text-white" : "bg-white border border-black/20 text-black/50"}`}
                style={{ borderRadius: 0 }} onClick={() => i + 1 <= step && setStep(i + 1)}>
                {i + 1 < step ? <CheckCircle2 className="h-3 w-3" /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-4 h-0.5 flex-shrink-0 ${i + 1 < step ? "bg-emerald-400" : "bg-black/10"}`} />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white border border-black/10 p-6" style={{ borderRadius: 0 }}>

          {/* STEP 1 — Company Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-[#0f172a] border-b border-black/10 pb-2">Step 1: Company Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { k: "companyName", label: "Company Names *", ph: "Full registered company name" },
                  { k: "companyReg", label: "Company Registration No. *", ph: "e.g. 12345/2024" },
                  { k: "dateReg", label: "Date of Registration", ph: "", type: "date" },
                  { k: "taxTin", label: "Tax TIN Number *", ph: "e.g. 1234567890" },
                  { k: "vatNumber", label: "VAT Number", ph: "If applicable" },
                  { k: "subsidiaries", label: "Subsidiaries", ph: "List any subsidiary companies" },
                  { k: "yearsInBusiness", label: "Years in Business", ph: "e.g. 5" },
                  { k: "website", label: "Website", ph: "https://www.company.co.zw" },
                ].map(({ k, label, ph, type }) => (
                  <div key={k}>
                    <label className="text-[10px] font-bold text-black/50 uppercase tracking-wider">{label}</label>
                    <input type={type || "text"} value={(companyInfo as any)[k]} onChange={e => setCI(k, e.target.value)}
                      placeholder={ph} className="mt-1 w-full h-9 px-3 text-sm border border-black/15 focus:outline-none focus:ring-2 focus:ring-blue-500/20" style={{ borderRadius: 0 }} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-black/50 uppercase tracking-wider">Physical Address *</label>
                  <textarea value={companyInfo.physicalAddress} onChange={e => setCI("physicalAddress", e.target.value)}
                    placeholder="Full physical address" rows={3}
                    className="mt-1 w-full px-3 py-2 text-sm border border-black/15 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20" style={{ borderRadius: 0 }} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-black/50 uppercase tracking-wider">Postal Address</label>
                  <textarea value={companyInfo.postalAddress} onChange={e => setCI("postalAddress", e.target.value)}
                    placeholder="Postal / PO Box address" rows={3}
                    className="mt-1 w-full px-3 py-2 text-sm border border-black/15 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20" style={{ borderRadius: 0 }} />
                </div>
              </div>
              {/* Contact person */}
              <div className="border border-black/10 p-3" style={{ borderRadius: 0 }}>
                <div className="text-[10px] font-bold text-black/50 uppercase tracking-wider mb-3">Contact Person</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { k: "contactName", label: "Name", ph: "Full name" },
                    { k: "contactCell", label: "Cell (C)", ph: "+263 77 000 0000" },
                    { k: "contactEmail", label: "Email (@)", ph: "contact@company.co.zw" },
                    { k: "contactPhone", label: "Telephone (T)", ph: "+263 242 000000" },
                    { k: "contactFax", label: "Fax (F)", ph: "+263 242 000000" },
                  ].map(({ k, label, ph }) => (
                    <div key={k}>
                      <label className="text-[10px] font-medium text-black/40">{label}</label>
                      <input value={(companyInfo as any)[k]} onChange={e => setCI(k, e.target.value)} placeholder={ph}
                        className="mt-0.5 w-full h-8 px-2 text-xs border border-black/10 focus:outline-none" style={{ borderRadius: 0 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Ownership & Category */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-[#0f172a] border-b border-black/10 pb-2">Step 2: Company Ownership Structure & Category</h2>
              <div>
                <div className="text-xs font-semibold text-black/60 mb-2">Company Ownership Structure: <span className="text-red-500">*</span></div>
                <div className="flex flex-wrap gap-3">
                  {["Citizen Owned", "Foreign Owned", "Joint Venture", "NGO"].map(v => (
                    <label key={v} className={`flex items-center gap-2 px-3 py-2 border cursor-pointer text-sm transition-colors ${ownership.includes(v) ? "bg-[#0f172a] text-white border-[#0f172a]" : "bg-white border-black/20 hover:bg-[#EAF1F8]"}`} style={{ borderRadius: 0 }}>
                      <input type="checkbox" checked={ownership.includes(v)} onChange={() => toggleOwnership(v)} className="hidden" />{v}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-black/60 mb-2">Company Category: <span className="text-black/40 font-normal">(Select all that apply — attach supporting documents)</span></div>
                <div className="flex flex-wrap gap-2">
                  {["Youth", "Women", "PLD (Persons Living with Disability)", "Rural Location", "EDD (Economic Diversification Drive)", "Retired Public Officers", "OVCs (Orphans & Vulnerable Children)"].map(v => (
                    <label key={v} className={`flex items-center gap-2 px-2 py-1.5 border cursor-pointer text-xs transition-colors ${companyCategory.includes(v) ? "bg-blue-600 text-white border-blue-600" : "bg-white border-black/15 hover:bg-blue-50"}`} style={{ borderRadius: 0 }}>
                      <input type="checkbox" checked={companyCategory.includes(v)} onChange={() => toggleCompCat(v)} className="hidden" />{v}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-black/60 mb-2">Sector: <span className="text-red-500">*</span></div>
                <div className="flex flex-wrap gap-2">
                  {["SUPPLIES", "SERVICES", "CONTRACTOR"].map(v => (
                    <label key={v} className={`flex items-center gap-2 px-3 py-2 border cursor-pointer text-sm font-semibold transition-colors ${sector.includes(v) ? "bg-[#0f172a] text-white border-[#0f172a]" : "bg-white border-black/20 hover:bg-[#EAF1F8]"}`} style={{ borderRadius: 0 }}>
                      <input type="checkbox" checked={sector.includes(v)} onChange={() => toggleSector(v)} className="hidden" />{v}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-black/60 mb-2">Industry:</div>
                <div className="flex flex-wrap gap-2">
                  {["Manufacturing", "Mining", "Agriculture", "Other"].map(v => (
                    <label key={v} className={`flex items-center gap-2 px-3 py-2 border cursor-pointer text-sm transition-colors ${industry.includes(v) ? "bg-emerald-600 text-white border-emerald-600" : "bg-white border-black/20 hover:bg-[#EAF1F8]"}`} style={{ borderRadius: 0 }}>
                      <input type="checkbox" checked={industry.includes(v)} onChange={() => toggleIndustry(v)} className="hidden" />{v}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-black/60 mb-2">Works Contractor Size (if applicable):</div>
                <div className="flex flex-wrap gap-2">
                  {["E-Class", "D-Class", "C-Class", "B-Class", "O-C Class"].map(v => (
                    <label key={v} className={`flex items-center gap-2 px-3 py-2 border cursor-pointer text-sm transition-colors ${worksSize.includes(v) ? "bg-amber-600 text-white border-amber-600" : "bg-white border-black/20 hover:bg-[#EAF1F8]"}`} style={{ borderRadius: 0 }}>
                      <input type="checkbox" checked={worksSize.includes(v)} onChange={() => toggleWorksSize(v)} className="hidden" />{v}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Business Codes */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-[#0f172a] border-b border-black/10 pb-2">Step 3: Business Activity Codes</h2>
              <div className="bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800 flex gap-2" style={{ borderRadius: 0 }}>
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Select the codes that describe your business activities. Once approved, you will only receive tender notifications and be eligible to bid for tenders matching your selected codes.</span>
              </div>
              <CodePicker codes={SERVICE_CODES} selected={serviceCodes} onToggle={toggleServiceCode} label="Services (Codes 100–145)" />
              <CodePicker codes={SUPPLY_CODES} selected={supplyCodes} onToggle={toggleSupplyCode} label="Supplies (Codes 200–219)" />
              <CodePicker codes={CONSULTANT_CODES} selected={consultantCodes} onToggle={toggleConsultantCode} label="Consultants (Codes 301–323)" />
              <CodePicker codes={WORKS_CODES} selected={worksCodes} onToggle={toggleWorksCode} label="Works Contractors (Codes 01–15)" />
              <div className="text-xs text-black/40 p-2 border border-black/8 bg-[#F9F9F9]">
                Total selected codes: <strong>{serviceCodes.length + supplyCodes.length + consultantCodes.length + worksCodes.length}</strong>
              </div>
            </div>
          )}

          {/* STEP 4 — Directors & Shareholders */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-[#0f172a] border-b border-black/10 pb-2">Step 4: List of Directors / Partners / Members / Owners</h2>
              <div className="bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex gap-2" style={{ borderRadius: 0 }}>
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>All column fields will be compared to various databases and flag anomalies (such as blacklisted individuals) and generate a report.</span>
              </div>
              {directors.map((d, i) => (
                <div key={i} className="border border-black/10 p-4 relative" style={{ borderRadius: 0 }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-black/60">Director / Partner {i + 1}</span>
                    {directors.length > 1 && (
                      <button onClick={() => removeDirector(i)} className="h-6 w-6 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 transition-colors" style={{ borderRadius: 0 }}>
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { k: "name" as keyof Director, label: "First Name" },
                      { k: "middleName" as keyof Director, label: "Middle Name" },
                      { k: "surname" as keyof Director, label: "Surname" },
                      { k: "idNumber" as keyof Director, label: "ID Number" },
                      { k: "nationality" as keyof Director, label: "Nationality" },
                      { k: "shareholding" as keyof Director, label: "Shareholding %" },
                    ].map(({ k, label }) => (
                      <div key={k}>
                        <label className="text-[10px] font-medium text-black/40">{label}</label>
                        <input value={d[k] as string} onChange={e => updateDirector(i, k, e.target.value)}
                          className="mt-0.5 w-full h-8 px-2 text-xs border border-black/10 focus:outline-none" style={{ borderRadius: 0 }} />
                      </div>
                    ))}
                    <div>
                      <label className="text-[10px] font-medium text-black/40">Gender</label>
                      <select value={d.gender} onChange={e => updateDirector(i, "gender", e.target.value)}
                        className="mt-0.5 w-full h-8 px-2 text-xs border border-black/10 focus:outline-none bg-white" style={{ borderRadius: 0 }}>
                        <option value="">Select…</option>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                    <div className="flex gap-3 items-center pt-4">
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input type="checkbox" checked={d.youth} onChange={e => updateDirector(i, "youth", e.target.checked)} className="accent-blue-600" /> Youth
                      </label>
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input type="checkbox" checked={d.disabled} onChange={e => updateDirector(i, "disabled", e.target.checked)} className="accent-blue-600" /> Disabled
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addDirector} className="flex items-center gap-2 px-3 py-2 border border-dashed border-black/25 text-sm text-black/60 hover:bg-[#EAF1F8] transition-colors" style={{ borderRadius: 0 }}>
                <Plus className="h-4 w-4" /> Add Director / Partner
              </button>
            </div>
          )}

          {/* STEP 5 — Banking Details */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-[#0f172a] border-b border-black/10 pb-2">Step 5: Payment Details — Supplier Banking Information</h2>
              <div className="bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex gap-2" style={{ borderRadius: 0 }}>
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>All banking details will be verified and compared to financial databases to detect anomalies.</span>
              </div>
              {bankAccounts.map((b, i) => (
                <div key={i} className="border border-black/10 p-4" style={{ borderRadius: 0 }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-black/60">Bank Account {i + 1}</span>
                    {bankAccounts.length > 1 && (
                      <button onClick={() => removeBank(i)} className="h-6 w-6 flex items-center justify-center bg-red-50 text-red-600" style={{ borderRadius: 0 }}>
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { k: "accountName" as keyof BankAccount, label: "Account Name" },
                      { k: "bankName" as keyof BankAccount, label: "Bank Name" },
                      { k: "accountNumber" as keyof BankAccount, label: "Account Number" },
                      { k: "branchName" as keyof BankAccount, label: "Branch Name" },
                      { k: "accountType" as keyof BankAccount, label: "Account Type" },
                      { k: "branchCode" as keyof BankAccount, label: "Branch Code" },
                      { k: "swiftCode" as keyof BankAccount, label: "SWIFT Code" },
                    ].map(({ k, label }) => (
                      <div key={k}>
                        <label className="text-[10px] font-medium text-black/40">{label}</label>
                        <input value={b[k]} onChange={e => updateBank(i, k, e.target.value)}
                          className="mt-0.5 w-full h-8 px-2 text-xs border border-black/10 focus:outline-none" style={{ borderRadius: 0 }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={addBankAccount} className="flex items-center gap-2 px-3 py-2 border border-dashed border-black/25 text-sm text-black/60 hover:bg-[#EAF1F8]" style={{ borderRadius: 0 }}>
                <Plus className="h-4 w-4" /> Add Bank Account
              </button>
            </div>
          )}

          {/* STEP 6 — Documents */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-[#0f172a] border-b border-black/10 pb-2">Step 6: Required Attachments & Supporting Documents</h2>
              {[
                { label: "All Company Forms certified by issuing authority", required: true },
                { label: "Certified Share Certificates", required: true },
                { label: "Trading License certified by issuing office", required: true },
                { label: "Tax Clearance Certificate or Exemption", required: true },
                { label: "PRAZ Registration Certificate", required: true },
                { label: "Product Catalogue", required: false },
                { label: "Certified copies of ID (Directors/Partners)", required: true },
              ].map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-black/10 hover:bg-[#F9F9F9] transition-colors" style={{ borderRadius: 0 }}>
                  <FileText className="h-4 w-4 text-black/40 flex-shrink-0" />
                  <span className="flex-1 text-sm text-[#0f172a]">{doc.label}</span>
                  {doc.required && <span className="text-[10px] text-red-600 font-semibold">Required</span>}
                  <button className="h-8 px-3 bg-[#0f172a] text-white text-xs flex items-center gap-1.5 hover:bg-black/80 appois-glow-on-hover" style={{ borderRadius: 0 }}>
                    <Upload className="h-3 w-3" /> Upload
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* STEP 7 — Review & Submit */}
          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-[#0f172a] border-b border-black/10 pb-2">Step 7: Review & Submit Application</h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "Company Name", value: companyInfo.companyName || "—" },
                  { label: "Registration No.", value: companyInfo.companyReg || "—" },
                  { label: "Tax TIN", value: companyInfo.taxTin || "—" },
                  { label: "Ownership", value: ownership.join(", ") || "—" },
                  { label: "Sector", value: sector.join(", ") || "—" },
                  { label: "Service Codes", value: serviceCodes.length > 0 ? `${serviceCodes.length} selected` : "None" },
                  { label: "Supply Codes", value: supplyCodes.length > 0 ? `${supplyCodes.length} selected` : "None" },
                  { label: "Works Codes", value: worksCodes.length > 0 ? `${worksCodes.length} selected` : "None" },
                  { label: "Directors", value: `${directors.length} added` },
                  { label: "Bank Accounts", value: `${bankAccounts.length} added` },
                ].map(({ label, value }) => (
                  <div key={label} className="p-2 bg-[#F9F9F9] border border-black/8">
                    <div className="text-black/40 text-[9px] font-bold uppercase">{label}</div>
                    <div className="font-semibold text-[#0f172a] mt-0.5">{value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-violet-50 border border-violet-200 p-3 text-xs text-violet-800 flex gap-2" style={{ borderRadius: 0 }}>
                <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>AI Compliance Check: All required fields are validated. Your application will be reviewed by our Procurement and Risk teams within 5–10 business days.</span>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-0.5 accent-[#0f172a]" />
                <span className="text-xs text-black/70">I declare that all information provided is true and accurate. I understand that providing false information may result in disqualification and legal action.</span>
              </label>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4 bg-white border border-black/10 p-4" style={{ borderRadius: 0 }}>
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
            className="h-9 px-5 border border-black/20 text-sm font-medium text-[#0f172a] hover:bg-[#EAF1F8] disabled:opacity-40 appois-glow-on-hover transition-all" style={{ borderRadius: 0 }}>
            ← Back
          </button>
          <span className="text-xs text-black/40">Step {step} of {STEPS.length}</span>
          {step < STEPS.length ? (
            <button onClick={() => setStep(s => s + 1)}
              className="h-9 px-5 bg-[#0f172a] text-white text-sm font-semibold flex items-center gap-2 appois-glow-on-hover transition-all" style={{ borderRadius: 0 }}>
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="h-9 px-5 bg-emerald-600 text-white text-sm font-semibold flex items-center gap-2 appois-glow-on-hover transition-all" style={{ borderRadius: 0 }}>
              <CheckCircle2 className="h-4 w-4" /> Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
