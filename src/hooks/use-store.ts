import { useState, useCallback } from "react";
import { getAll, addItem, updateItem, deleteItem, pushNotification } from "@/lib/local-store";
import type { StoredTender, StoredRFQ, StoredVendor, StoredInvoice, StoredContract } from "@/lib/local-store";

export function useTenders() {
  const [tenders, setTenders] = useState<StoredTender[]>(() => getAll("tenders"));
  const refresh = useCallback(() => setTenders(getAll("tenders")), []);

  const add = (t: StoredTender) => { addItem("tenders", t); pushNotification(`New tender created: ${t.title}`, "success"); refresh(); };
  const update = (id: string, patch: Partial<StoredTender>) => { updateItem("tenders", id, patch); refresh(); };
  const remove = (id: string) => { deleteItem("tenders", id); refresh(); };

  return { tenders, add, update, remove, refresh };
}

export function useRFQs() {
  const [rfqs, setRFQs] = useState<StoredRFQ[]>(() => getAll("rfqs"));
  const refresh = useCallback(() => setRFQs(getAll("rfqs")), []);

  const add = (r: StoredRFQ) => { addItem("rfqs", r); pushNotification(`New RFQ created: ${r.title}`, "success"); refresh(); };
  const update = (id: string, patch: Partial<StoredRFQ>) => { updateItem("rfqs", id, patch); refresh(); };
  const remove = (id: string) => { deleteItem("rfqs", id); refresh(); };

  return { rfqs, add, update, remove, refresh };
}

export function useVendors() {
  const [vendors, setVendors] = useState<StoredVendor[]>(() => getAll("vendors"));
  const refresh = useCallback(() => setVendors(getAll("vendors")), []);

  const add = (v: StoredVendor) => { addItem("vendors", v); refresh(); };
  const update = (id: string, patch: Partial<StoredVendor>) => { updateItem("vendors", id, patch); refresh(); };

  return { vendors, add, update, refresh };
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<StoredInvoice[]>(() => getAll("invoices"));
  const refresh = useCallback(() => setInvoices(getAll("invoices")), []);

  const add = (inv: StoredInvoice) => { addItem("invoices", inv); refresh(); };
  const update = (id: string, patch: Partial<StoredInvoice>) => { updateItem("invoices", id, patch); refresh(); };

  return { invoices, add, update, refresh };
}

export function useContracts() {
  const [contracts, setContracts] = useState<StoredContract[]>(() => getAll("contracts"));
  const refresh = useCallback(() => setContracts(getAll("contracts")), []);
  const update = (id: string, patch: Partial<StoredContract>) => { updateItem("contracts", id, patch); refresh(); };
  return { contracts, update, refresh };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState(() => getAll("notifications"));
  const refresh = useCallback(() => setNotifications(getAll("notifications")), []);
  return { notifications, unread: notifications.filter(n => !n.read).length, refresh };
}
