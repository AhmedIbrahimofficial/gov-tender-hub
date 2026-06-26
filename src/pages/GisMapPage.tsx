/**
 * GIS Map Page — standalone full-screen map view.
 * Shows all tender and project pins for the Government of Zimbabwe
 * national procurement platform.
 */

import { useNavigate } from "react-router-dom";
import { AppShell, PageHeader } from "@/components/AppShell";
import GisMapView, { type GisPin } from "@/components/GisMapView";
import { ALL_GIS_PINS } from "@/lib/gis-data";
import { MapPin } from "lucide-react";

export default function GisMapPage() {
  const navigate = useNavigate();

  const handleNavigate = (pin: GisPin) => {
    if (pin.type === "tender") {
      navigate(`/tenders/${pin.id}`);
    } else {
      navigate(`/projects`);
    }
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
