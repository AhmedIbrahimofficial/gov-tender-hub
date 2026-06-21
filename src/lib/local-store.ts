// Typed localStorage wrapper — all user data persists across reloads

export type StoredTender = {
  id: string; title: string; entity: string; category: string;
  method: string; value: string; status: string; closing: string;
  bids: number; createdBy: string; createdAt: string;
};

export type StoredRFQ = {
  id: string; title: string; dept: string; value: string;
  status: string; stage: number; deadline: string; createdBy: string;
};

export type StoredVendor = {
  id: string; name: string; category: string; email: string;
  status: string; rating: number; risk: string; registeredBy: string;
};

export type StoredInvoice = {
  id: string; vendor: string; amount: string; status: string;
  submittedDate: string; poRef: string; submittedBy: string;
};

export type StoredContract = {
  id: string; title: string; vendor: string; value: string;
  progress: number; status: string; endDate: string;
};

export type StoredAuditLog = {
  id: string; event: string; user: string; role: string;
  timestamp: string; risk: string;
};

type Store = {
  tenders: StoredTender[];
  rfqs: StoredRFQ[];
  vendors: StoredVendor[];
  invoices: StoredInvoice[];
  contracts: StoredContract[];
  auditLogs: StoredAuditLog[];
  notifications: { id: string; msg: string; type: string; time: string; read: boolean }[];
};

const KEY = "appiioms_data";

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { tenders: [], rfqs: [], vendors: [], invoices: [], contracts: [], auditLogs: [], notifications: [] };
}

function save(store: Store) {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch {}
}

// Generic helpers
export function getAll<K extends keyof Store>(key: K): Store[K] {
  return load()[key] as Store[K];
}

export function addItem<K extends keyof Store>(key: K, item: Store[K][number]) {
  const store = load();
  (store[key] as unknown[]).unshift(item);
  // log it
  store.auditLogs.unshift({
    id: `AUD-${Date.now()}`,
    event: `Created ${key.slice(0, -1)}: ${(item as Record<string, unknown>).title ?? (item as Record<string, unknown>).id}`,
    user: (item as Record<string, unknown>).createdBy as string ?? "System",
    role: "system",
    timestamp: new Date().toISOString(),
    risk: "Low",
  });
  save(store);
}

export function updateItem<K extends keyof Store>(
  key: K,
  id: string,
  patch: Partial<Store[K][number]>,
) {
  const store = load();
  const arr = store[key] as Record<string, unknown>[];
  const idx = arr.findIndex((x) => x.id === id);
  if (idx !== -1) { arr[idx] = { ...arr[idx], ...patch }; save(store); }
}

export function deleteItem<K extends keyof Store>(key: K, id: string) {
  const store = load();
  (store[key] as Record<string, unknown>[]) = (store[key] as Record<string, unknown>[]).filter((x) => x.id !== id);
  save(store);
}

export function pushNotification(msg: string, type: "info" | "success" | "warning" | "error") {
  const store = load();
  store.notifications.unshift({ id: `N-${Date.now()}`, msg, type, time: new Date().toLocaleString(), read: false });
  save(store);
}

export function markNotificationsRead() {
  const store = load();
  store.notifications = store.notifications.map((n) => ({ ...n, read: true }));
  save(store);
}

export function clearStore() {
  localStorage.removeItem(KEY);
}

// Seed some initial data if empty
export function seedIfEmpty(userName: string) {
  const store = load();
  if (store.tenders.length === 0) {
    store.tenders = [
      { id: "ZW-PRA-2026-00184", title: "Solar Mini-Grids — 12 Rural Clinics", entity: "Ministry of Energy", category: "Infrastructure", method: "Open", value: "USD 14,800,000", status: "Bidding", closing: "2026-07-08", bids: 11, createdBy: userName, createdAt: new Date().toISOString() },
      { id: "ZW-PRA-2026-00183", title: "ARV Medicines Framework (2yr)", entity: "Ministry of Health", category: "Health & Pharma", method: "Framework", value: "USD 42,500,000", status: "Evaluation", closing: "2026-06-12", bids: 8, createdBy: userName, createdAt: new Date().toISOString() },
      { id: "ZW-PRA-2026-00182", title: "National Tax Administration System II", entity: "ZIMRA", category: "ICT & Digital", method: "Restricted", value: "USD 9,200,000", status: "Bidding", closing: "2026-07-21", bids: 5, createdBy: userName, createdAt: new Date().toISOString() },
    ];
    store.rfqs = [
      { id: "RFQ-2026-0892", title: "Office Stationery Q3 2026", dept: "Finance Dept", value: "USD 4,200", status: "Active", stage: 5, deadline: "2026-06-28", createdBy: userName },
      { id: "RFQ-2026-0891", title: "Printer Cartridges & Toner", dept: "IT Department", value: "USD 1,800", status: "Evaluating", stage: 9, deadline: "2026-06-25", createdBy: userName },
    ];
    store.vendors = [
      { id: "VEN-00482", name: "Highveld Engineering (Pvt) Ltd", category: "Infrastructure", email: "info@highveld.co.zw", status: "Approved", rating: 4.7, risk: "Low", registeredBy: "System" },
      { id: "VEN-00481", name: "Zimbabwe Pharma Holdings", category: "Health & Pharma", email: "procurement@zph.co.zw", status: "Approved", rating: 4.5, risk: "Low", registeredBy: "System" },
      { id: "VEN-00480", name: "Sable ICT Solutions", category: "ICT & Digital", email: "bids@sableict.co.zw", status: "Approved", rating: 4.2, risk: "Medium", registeredBy: "System" },
    ];
    store.contracts = [
      { id: "CN-2026-0411", title: "Beitbridge Highway Section 3", vendor: "Highveld Engineering", value: "USD 71.0M", progress: 64, status: "On Track", endDate: "2026-12-15" },
      { id: "CN-2026-0418", title: "ARV Medicines Framework", vendor: "Zimbabwe Pharma Holdings", value: "USD 42.5M", progress: 38, status: "On Track", endDate: "2028-03-31" },
    ];
    store.invoices = [
      { id: "INV-2026-4821", vendor: "Highveld Engineering", amount: "USD 2,840,000", status: "Approved", submittedDate: "2026-06-15", poRef: "PO-2026-0411", submittedBy: "J. Banda" },
    ];
    save(store);
  }
}
