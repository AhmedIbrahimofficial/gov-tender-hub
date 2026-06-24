# Comprehensive Platform Overhaul Plan

This is a large multi-phase build. I'll execute it end-to-end without stopping, but want to confirm scope and sequence first so nothing is missed.

## Problems To Fix

1. **404s on Project Management module** — `/pm/*` routes (Control Tower, Portfolio, WBS, Gantt, Cost, Risk, Quality, Resources, Contractors, Documents, AI Control Tower) are linked in the sidebar but pages don't exist.
2. **Dead sidebar/tab links** in Budget, Tenders, and other modules — clicks do nothing or 404.
3. **Mock buttons** that only toast — must perform real state changes (create, update, delete) persisted to local store so workflows actually progress.
4. **Tender stages** exist but Budget tabs don't follow the same per-stage detail pattern.
5. **Add Tender form** has too few inputs (no bid open/close time, clarification window, site visit, EMD, evaluation method, etc.).
6. **Graphs are static** — clicking a slice/bar must drill into a dedicated detail page with deeper graphs.
7. **Only one ministry modelled** — need all Zimbabwe ministries + departments + state entities + branches, each with roles/officers.
8. **No org registration hierarchy** — need Ministry → Department/SOE → Branch registration with user mapping (drag/drop + checkbox).
9. **No Prime Entity super-admin** with global view across every ministry/department/role.
10. **Dashboards aren't role/ministry-scoped** — need a dedicated dashboard per role × ministry × department.
11. **BI dashboards** are thin — need the richer chart set shown in the uploaded PDF.

## Step-by-Step Implementation

### Phase 1 — Routing & 404 Cleanup
- Create the Project Management module with 11 sub-pages:
  `/pm` (Control Tower), `/pm/portfolio`, `/pm/wbs`, `/pm/schedule`, `/pm/cost`, `/pm/risks`, `/pm/quality`, `/pm/resources`, `/pm/contractors`, `/pm/documents`, `/pm/ai-control-tower`.
- Audit every sidebar item; create stub-then-fill pages for any other dead link (Budget sub-tabs, Inventory sub-tabs, Utility sub-tabs already route to one page — split into real pages).
- Add a generic `NotFound` fallback that suggests nearest valid route.

### Phase 2 — Zimbabwe Ministry & Org Registry (data layer)
- Replace `zw-ministries.ts` with a researched dataset of **all 26 Zimbabwe ministries** (Cabinet Office, Finance & Economic Development, Health & Child Care, Primary & Secondary Education, Higher & Tertiary Education, Defence, Home Affairs, Foreign Affairs, Justice, Lands/Agriculture/Water/Fisheries, Industry & Commerce, Mines, Energy & Power Development, Transport, ICT/Postal & Courier, Local Government & Public Works, Public Service/Labour & Social Welfare, Women Affairs, Youth/Sport/Arts, Tourism, Environment/Climate, Information/Publicity & Broadcasting, etc.) — each with realistic departments and known state-owned entities (ZESA, ZINARA, NRZ, ZBC, NetOne, TelOne, GMB, Air Zimbabwe, ZIMRA, RBZ, NSSA, etc.) and example branches.
- Add an `org-registry` store with hierarchy types: `MINISTRY → DEPARTMENT | SOE → BRANCH`.
- Build `/organisations` registration UI: 4-step wizard (Register Ministry → Department → SOE → Branch) plus a drag-and-drop / checkbox user assignment panel.

### Phase 3 — Ministry Switcher & Scoped Dashboards
- Extend `MinistryContext` to expose `currentMinistry`, `currentDepartment`, `switchMinistry()`.
- Add a top-bar ministry/department switcher.
- For every role (42 in `auth-context.tsx`) generate a dashboard template parameterised by ministry + department: `/dashboard/:role` resolves to a role-specific layout populated with mock data scoped to the active ministry.
- Build a **Prime Entity Super-Admin Dashboard** (`/prime-entity`) with: global KPIs, ministry leaderboard, drill into any ministry/department/role, impersonation, system-wide audit feed.

### Phase 4 — Real Workflow Engine (replace mock buttons)
- Introduce `useStore` slices for: tenders, bids, evaluations, awards, contracts, invoices, payments, requisitions, budgets, projects, risks, documents.
- Replace every "toast-only" button with real CRUD that mutates the store and advances workflow state (e.g., Publish Tender → status `PUBLISHED`, opens bid window; Close Bids → moves to `EVALUATION`; Award → creates contract record; etc.).
- Persist to `localStorage` via existing `local-store.ts`.
- Add state-machine guards so actions only show when valid for current stage.

### Phase 5 — Enhanced Add-Tender Form
Fields: Title, Reference No (auto), Ministry, Department, Category, Procurement Method (Open/Selective/RFQ/RFP/EOI/Direct), Description, Scope, **Estimated Value + Currency**, Funding Source, **Publication Date+Time**, **Clarification Deadline (date+time)**, **Site Visit Date+Time + Location**, **Bid Opening Date+Time**, **Bid Closing Date+Time**, **Bid Validity (days)**, **EMD/Bid Security amount + form**, Performance Security %, Evaluation Method (LPT/QCBS/QBS/FBS/LCS), Technical Weight %, Financial Weight %, Pre-qualification Required, Lots/Packages, Delivery Period, Delivery Location, Payment Terms, Eligibility Criteria, Required Documents (checklist), Contact Officer, Reserved For (SME/Women/Youth), Sustainability Criteria, Attachments. Live countdown to each milestone after creation.

### Phase 6 — Per-Stage Pages (Budget + every workflow)
- Mirror the tender stage pattern (`/tenders/:id/stage/:stage`) for:
  - Budget: Formulation → Approval → Allocation → Commitment → Expenditure → Reconciliation → Audit.
  - Contracts: Drafting → Negotiation → Signing → Execution → Milestones → Closeout.
  - Projects: Initiation → Planning → Execution → Monitoring → Closure.
- Each stage page: dedicated KPIs, timeline, documents, approvals, AI insights, action buttons.

### Phase 7 — BI Dashboards (from uploaded PDF)
- Implement the chart set referenced in the PDF: spend by ministry, spend by category, supplier concentration, cycle-time funnel, savings vs budget, on-time delivery heatmap, contract value pyramid, risk radar, fraud-alert sankey, province choropleth, monthly trend with forecast band, top-10 suppliers, vendor diversity donut, payment ageing, etc.
- Tender list view modelled on NITB Pakistan / PPRA Pakistan tender hub: searchable table with filters (ministry, category, value range, status, closing date), expandable rows, milestone chips, document downloads.

### Phase 8 — Interactive Graph Drilldown
- Wrap all recharts components with `onClick` handlers that navigate to `/bi-dashboards/drill/:category/:value` (route exists) — populate with per-slice detail: secondary breakdown chart, tender list filtered to that slice, supplier list, contract list, anomaly list.
- Make pie/bar/line/treemap slices clickable with hover affordance.

### Phase 9 — Finance Depth
- Add modules grounded in IPSAS, PFMA, GFS 2014, COSO, INTOSAI ISSAI, World Bank procurement principles: commitment accounting, accrual vs cash views, variance analysis, fiscal-space indicator, debt-service coverage, value-for-money scoring, three-E (Economy/Efficiency/Effectiveness) dashboard, fraud-triangle indicators (Pressure/Opportunity/Rationalisation), Benford's-law anomaly chart.

### Phase 10 — Documentation Update
- Update memory (`mem://index.md`) with: blue+white design rule, ministry registry source of truth, workflow state machine names, prime-entity role.

## Technical Details

- Stack stays React 18 + Vite + Tailwind + shadcn + react-router + recharts + zustand-style `useStore`.
- No backend (user chose UI + mock). All persistence via `localStorage`.
- New files (~60): `src/pages/pm/*`, `src/pages/budget/stages/*`, `src/pages/contracts/stages/*`, `src/pages/projects/stages/*`, `src/pages/dashboards/<role>.tsx`, `src/lib/zw-ministries.ts` (rewritten), `src/lib/org-registry.ts`, `src/lib/workflows/*`, `src/components/MinistrySwitcher.tsx`, `src/components/DrilldownChart.tsx`, `src/components/AddTenderForm.tsx` (expanded), etc.
- Estimated edits: ~80 files. Given size, I'll batch parallel writes per phase and verify build between phases.

## Sequencing

Phases execute in order 1 → 10. Between phases I'll run a typecheck and screenshot the preview. I will not stop or ask further questions until all 10 phases are complete, unless I hit a blocker that needs your decision.

## One Confirmation Before I Start

Volume: this will create ~60 new pages and rewrite ~20 existing ones. Build time will be substantial. Confirm:
- **Proceed full-scope (all 10 phases)** — recommended, matches your request.
- **Phase 1+2+4 first** (fix 404s, ministries, real workflows), then continue — faster first checkpoint.

Reply "go full" or "phased" and I'll begin immediately.
