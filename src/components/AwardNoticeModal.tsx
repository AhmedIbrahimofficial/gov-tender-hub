/**
 * AwardNoticeModal — shown when a tender is awarded to a company.
 * Displays congratulation message + list of legal documents to submit.
 * Also triggers senior notification and AI report to CPO.
 */
import { useState } from "react";
import { X, CheckCircle2, FileText, Download, Send, Sparkles, Trophy, AlertCircle } from "lucide-react";
import { saveAwardNotice, pushSeniorAlert, saveAIReport } from "@/lib/local-store";
import type { AwardNotice } from "@/lib/local-store";

const LEGAL_DOCUMENTS = [
  { id: "d1", name: "Letter of Award (LOA)",                    desc: "Official letter confirming contract award",                required: true  },
  { id: "d2", name: "Draft Contract Agreement",                 desc: "Full contract document for review and signature",          required: true  },
  { id: "d3", name: "Performance Bond (10%)",                   desc: "Bank guarantee equal to 10% of contract value",            required: true  },
  { id: "d4", name: "Insurance Certificate",                    desc: "Public liability and contractor all-risk insurance",       required: true  },
  { id: "d5", name: "Tax Clearance Certificate",                desc: "Valid ZIMRA tax clearance — must be current",              required: true  },
  { id: "d6", name: "Updated Company Registration",             desc: "ZIMRA & IPEC certificates if renewed after submission",    required: false },
  { id: "d7", name: "Key Personnel CVs & Mobilisation Plan",    desc: "Final team structure and start-date confirmation",         required: false },
  { id: "d8", name: "Subcontractor Agreements (if any)",        desc: "Details of any approved subcontracting arrangements",      required: false },
];

type Props = {
  tender: { id: string; title: string; value: string; entity: string };
  vendor: string;
  awardedBy: string;
  onClose: () => void;
};

export default function AwardNoticeModal({ tender, vendor, awardedBy, onClose }: Props) {
  const [step, setStep] = useState<"congrats" | "documents" | "sent">("congrats");
  const [vendorEmail, setVendorEmail] = useState("");
  const [checkedDocs, setCheckedDocs] = useState<string[]>(LEGAL_DOCUMENTS.filter(d => d.required).map(d => d.id));
  const [sending, setSending] = useState(false);

  const toggleDoc = (id: string) => {
    setCheckedDocs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      const selectedDocs = LEGAL_DOCUMENTS.filter(d => checkedDocs.includes(d.id)).map(d => d.name);

      // Save award notice
      saveAwardNotice({
        tenderId: tender.id,
        tenderTitle: tender.title,
        vendorName: vendor,
        vendorEmail: vendorEmail || `procurement@${vendor.toLowerCase().replace(/\s+/g, "")}.co.zw`,
        awardedBy,
        awardDate: new Date().toISOString().split("T")[0],
        contractValue: tender.value,
        documents: selectedDocs,
        status: "sent",
      });

      // Senior notification to CPO/Minister
      pushSeniorAlert(
        `Contract awarded: "${tender.title}" → ${vendor} (${tender.value}) by ${awardedBy}. ${selectedDocs.length} legal documents requested.`,
        "success",
        { from: awardedBy, fromRole: "Adjudication Officer", category: "award", ref: tender.id }
      );

      // AI report
      saveAIReport({
        officer: awardedBy,
        role: "Adjudication Officer",
        date: new Date().toISOString().split("T")[0],
        summary: `Award issued for ${tender.title} to ${vendor}. All legal document requests sent.`,
        actions: [
          { time: new Date().toLocaleTimeString(), action: "Award Letter Issued", ref: tender.id, outcome: `${vendor} selected` },
          { time: new Date().toLocaleTimeString(), action: "Legal Documents Requested", ref: tender.id, outcome: `${selectedDocs.length} documents` },
          { time: new Date().toLocaleTimeString(), action: "Vendor Notified", ref: tender.id, outcome: vendorEmail || "Email sent" },
        ],
        sentToCPO: true,
      });

      setSending(false);
      setStep("sent");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-xl sm:my-4 flex flex-col max-h-[90vh]">

        {/* ── Step 1: Congratulation ── */}
        {step === "congrats" && (
          <>
            <div className="flex items-start justify-between px-5 py-4 border-b border-black/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500 grid place-items-center flex-shrink-0">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-black">Tender Award — Congratulation Notice</div>
                  <div className="text-xs text-black/50">{tender.id}</div>
                </div>
              </div>
              <button onClick={onClose} className="h-7 w-7 rounded-lg hover:bg-black/5 grid place-items-center text-black/40"><X className="h-4 w-4" /></button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">
              {/* Congrats banner */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-wider mb-1 text-emerald-200">🎉 Congratulations</div>
                <div className="text-lg font-bold leading-snug mb-1">{vendor}</div>
                <div className="text-sm text-emerald-100">has been selected as the successful bidder for:</div>
                <div className="text-base font-semibold mt-2 text-white">{tender.title}</div>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{tender.value}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{tender.entity}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Congratulation message preview */}
              <div className="bg-[#EAF1F8] rounded-xl p-4">
                <div className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Congratulation Message (to be sent to vendor)</div>
                <div className="text-xs text-black/70 leading-relaxed space-y-2">
                  <p>Dear <strong>{vendor}</strong>,</p>
                  <p>We are pleased to inform you that following a rigorous and transparent evaluation process, your company has been selected as the successful bidder for the above-referenced tender.</p>
                  <p>Your bid demonstrated the strongest technical and financial proposal among all responsive submissions. The AI-assisted evaluation confirmed your compliance with all mandatory requirements.</p>
                  <p>Please find attached the <strong>Letter of Award</strong> and a list of required legal documents to be submitted within <strong>14 working days</strong> to formalise the contract.</p>
                  <p>Congratulations on this award. We look forward to a successful working partnership.</p>
                  <p className="text-black/50">— {awardedBy}, Adjudication Officer · {tender.entity} · AI Powered Electronic Public Procurement and Oversight Intelligence System</p>
                </div>
              </div>

              {/* Vendor email */}
              <div>
                <label className="text-xs font-semibold text-black/50 uppercase tracking-wider">Vendor Contact Email</label>
                <input value={vendorEmail} onChange={e => setVendorEmail(e.target.value)}
                  placeholder={`procurement@${vendor.toLowerCase().replace(/\s+/g, "").slice(0,10)}.co.zw`}
                  className="mt-1.5 w-full h-9 px-3 rounded-xl border border-black/10 bg-[#EAF1F8] text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
              </div>

              {/* AI note */}
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
                <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-700">
                  <strong>AI will automatically:</strong> Notify the CPO and Minister with a senior alert, generate an AI activity report for today, and log this award in the national procurement audit trail.
                </div>
              </div>
            </div>

            <div className="flex gap-2 px-5 pb-5 pt-3 border-t border-black/10">
              <button onClick={() => setStep("documents")}
                className="flex-1 h-10 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" /> Continue — Request Documents →
              </button>
              <button onClick={onClose} className="h-10 px-4 rounded-xl border border-black/10 text-sm text-black/50 hover:bg-black/5">Cancel</button>
            </div>
          </>
        )}

        {/* ── Step 2: Legal Documents ── */}
        {step === "documents" && (
          <>
            <div className="flex items-start justify-between px-5 py-4 border-b border-black/10">
              <div>
                <div className="text-sm font-bold text-black">Required Legal Documents</div>
                <div className="text-xs text-black/50">Select which documents to request from {vendor}</div>
              </div>
              <button onClick={onClose} className="h-7 w-7 rounded-lg hover:bg-black/5 grid place-items-center text-black/40"><X className="h-4 w-4" /></button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-2">
              <div className="flex items-center gap-2 mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span className="text-xs text-amber-700">All required documents must be submitted within <strong>14 working days</strong> of this notice. Failure to submit may result in forfeiture of the award.</span>
              </div>

              {LEGAL_DOCUMENTS.map(doc => (
                <label key={doc.id} className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${checkedDocs.includes(doc.id) ? "border-black bg-[#EAF1F8]" : "border-black/10 hover:border-black/30"}`}>
                  <input type="checkbox" checked={checkedDocs.includes(doc.id)} onChange={() => toggleDoc(doc.id)}
                    className="mt-0.5 h-4 w-4 rounded accent-black flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">{doc.name}</span>
                      {doc.required && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">Required</span>}
                    </div>
                    <div className="text-xs text-black/40 mt-0.5">{doc.desc}</div>
                  </div>
                  <FileText className={`h-4 w-4 flex-shrink-0 mt-0.5 ${checkedDocs.includes(doc.id) ? "text-black" : "text-black/20"}`} />
                </label>
              ))}
            </div>

            <div className="flex gap-2 px-5 pb-5 pt-3 border-t border-black/10">
              <button onClick={handleSend} disabled={sending || checkedDocs.length === 0}
                className="flex-1 h-10 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {sending ? (
                  <><span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                ) : (
                  <><Send className="h-4 w-4" /> Send Award Notice + {checkedDocs.length} Documents</>
                )}
              </button>
              <button onClick={() => setStep("congrats")} className="h-10 px-4 rounded-xl border border-black/10 text-sm text-black/50 hover:bg-black/5">Back</button>
            </div>
          </>
        )}

        {/* ── Step 3: Sent confirmation ── */}
        {step === "sent" && (
          <div className="px-5 py-10 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 grid place-items-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="text-lg font-bold text-black mb-2">Award Notice Sent!</div>
            <div className="text-sm text-black/50 mb-4">Congratulation message and document request sent to <strong>{vendor}</strong>.</div>

            <div className="bg-[#EAF1F8] rounded-xl p-4 text-left space-y-2 mb-4 text-xs">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Award notice emailed to vendor</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {checkedDocs.length} legal documents requested (14-day deadline)</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Senior alert sent to CPO &amp; Minister</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> AI daily report submitted to CPO</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Audit log entry created</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 14-day standstill period started</div>
            </div>

            <button onClick={onClose}
              className="h-10 px-8 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
