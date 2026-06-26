/**
 * GIS Map Page — public full-screen map view.
 * Shows all tender and project pins across Zimbabwe.
 * Accessible without login (public transparency feature).
 */

import { useNavigate } from "react-router-dom";
import GisMapView, { type GisPin } from "@/components/GisMapView";
import { ALL_GIS_PINS } from "@/lib/gis-data";
import { MapPin, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AppShell, PageHeader } from "@/components/AppShell";

/* ── Authenticated wrapper (with sidebar nav) ─────────────────────────── */
function AuthenticatedGisPage() {
  const navigate = useNavigate();

  const handleNavigate = (pin: GisPin) => {
    if (pin.type === "tender") navigate(`/tenders/${pin.id}`);
    else navigate(`/projects`);
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-56px)] p-4 sm:p-6 max-w-[1800px] mx-auto w-full gap-4">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <PageHeader
            title="GIS Project & Tender Map"
            description={`Geospatial view of ${ALL_GIS_PINS.length} active tenders and projects across Zimbabwe. Click any pin to view case details.`}
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-2">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span><strong>{ALL_GIS_PINS.filter(p => p.type === "tender").length}</strong> Tenders</span>
            <span className="text-muted-foreground">·</span>
            <span><strong>{ALL_GIS_PINS.filter(p => p.type === "project").length}</strong> Projects</span>
          </div>
        </div>
        <div className="flex-1 rounded-2xl overflow-hidden border border-border shadow-sm min-h-0">
          <GisMapView
            pins={ALL_GIS_PINS}
            height="100%"
            title="National Procurement GIS"
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </AppShell>
  );
}

/* ── Public wrapper (no sidebar, standalone) ──────────────────────────── */
function PublicGisPage() {
  const navigate = useNavigate();

  const handleNavigate = (pin: GisPin) => {
    // Public users go to portal/tenders on pin click
    navigate("/portal");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Simple top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Portal
          </button>
          <span className="text-white/30">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="font-semibold text-sm">APPOIS — Tenders by Location</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/70">
          <span>
            <strong className="text-white">{ALL_GIS_PINS.filter(p => p.type === "tender").length}</strong> Tenders
          </span>
          <span>·</span>
          <span>
            <strong className="text-white">{ALL_GIS_PINS.filter(p => p.type === "project").length}</strong> Projects
          </span>
          <span>·</span>
          <button
            onClick={() => navigate("/signin")}
            className="bg-white text-primary font-semibold px-3 py-1 rounded hover:bg-white/90 transition-colors"
          >
            Login to view details
          </button>
        </div>
      </div>

      {/* Full-screen map */}
      <div className="flex-1 min-h-0">
        <GisMapView
          pins={ALL_GIS_PINS}
          height="100%"
          title="National Procurement GIS — Public View"
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}

/* ── Router — show correct version based on auth state ───────────────── */
export default function GisMapPage() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AuthenticatedGisPage /> : <PublicGisPage />;
}
