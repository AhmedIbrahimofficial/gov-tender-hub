/**
 * GisMapView — interactive Leaflet map with tender/project pins.
 * Inspired by the GIS case-management reference (satellite map + side panel).
 *
 * Works entirely offline-free via OpenStreetMap tiles (no API key needed).
 * Satellite layer uses ESRI World Imagery (free public tile service).
 */

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin, X, ExternalLink, FileText, Briefcase, Layers,
  Navigation, AlertTriangle, CheckCircle2, Clock, Info,
} from "lucide-react";

// ── Fix Leaflet's default icon path (broken in bundlers) ──────────────────
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-expect-error – Leaflet internal
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ── GIS pin data type ────────────────────────────────────────────────────

export type GisPin = {
  id: string;
  type: "tender" | "project";
  title: string;
  entity: string;
  status: string;
  priority?: string;
  value?: string;
  phase?: string;
  officer?: string;
  contactPhone?: string;
  startDate?: string;
  endDate?: string;
  locationLabel: string;
  lat: number;
  lng: number;
  /** colour bucket: green / amber / red / blue / violet */
  tone: "green" | "amber" | "red" | "blue" | "violet";
};

// ── Helpers ──────────────────────────────────────────────────────────────

const TONE_HEX: Record<GisPin["tone"], string> = {
  green:  "#16a34a",
  amber:  "#d97706",
  red:    "#dc2626",
  blue:   "#2563eb",
  violet: "#7c3aed",
};

function makeIcon(tone: GisPin["tone"], type: "tender" | "project") {
  const fill = TONE_HEX[tone];
  const shape =
    type === "tender"
      ? `<circle cx="12" cy="9" r="5" fill="${fill}" stroke="white" stroke-width="1.5"/>
         <path d="M12 22 L12 14" stroke="${fill}" stroke-width="2"/>`
      : `<rect x="7" y="4" width="10" height="10" rx="2" fill="${fill}" stroke="white" stroke-width="1.5"/>
         <path d="M12 22 L12 14" stroke="${fill}" stroke-width="2"/>`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="36">
      ${shape}
    </svg>`;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
}

// ── Component ────────────────────────────────────────────────────────────

interface Props {
  pins: GisPin[];
  height?: string;          // CSS height, default "100%"
  initialCenter?: [number, number];
  initialZoom?: number;
  title?: string;           // panel header
  onNavigate?: (pin: GisPin) => void;
}

export default function GisMapView({
  pins,
  height = "100%",
  initialCenter = [-19.0, 29.8],   // centre of Zimbabwe
  initialZoom = 6,
  title = "GIS Project Site Map",
  onNavigate,
}: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<GisPin | null>(null);
  const [basemap, setBasemap] = useState<"street" | "satellite">("satellite");
  const basemapRef = useRef<L.TileLayer | null>(null);
  const layersRef = useRef<Record<string, L.LayerGroup>>({});
  const [detailTab, setDetailTab] = useState<"Details" | "BOQ" | "Media" | "Reviews" | "Report">("Details");
  const [filterType, setFilterType] = useState<"all" | "tender" | "project">("all");

  const BASEMAPS = {
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles © Esri — Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP",
    },
    street: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  };

  // ── Init map ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
    });
    mapRef.current = map;

    // Basemap
    const layer = L.tileLayer(BASEMAPS.satellite.url, {
      attribution: BASEMAPS.satellite.attribution,
      maxZoom: 19,
    }).addTo(map);
    basemapRef.current = layer;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Swap basemap ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !basemapRef.current) return;
    const map = mapRef.current;
    basemapRef.current.remove();
    const cfg = BASEMAPS[basemap];
    basemapRef.current = L.tileLayer(cfg.url, { attribution: cfg.attribution, maxZoom: 19 }).addTo(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basemap]);

  // ── Render pins ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Clear old layers
    Object.values(layersRef.current).forEach(lg => lg.clearLayers());

    const visible = pins.filter(
      p => filterType === "all" || p.type === filterType
    );

    visible.forEach(pin => {
      const icon = makeIcon(pin.tone, pin.type);
      const marker = L.marker([pin.lat, pin.lng], { icon });

      // Popup (compact, matches reference style)
      const popupHtml = `
        <div style="min-width:220px;font-family:system-ui,sans-serif;font-size:13px;">
          <div style="font-weight:700;font-size:14px;margin-bottom:6px;">${pin.id}</div>
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="color:#64748b;padding:2px 8px 2px 0;white-space:nowrap;">Type</td>
                <td style="font-weight:500;text-transform:capitalize;">${pin.type}</td></tr>
            <tr><td style="color:#64748b;padding:2px 8px 2px 0;">Status</td>
                <td><span style="background:${TONE_HEX[pin.tone]}22;color:${TONE_HEX[pin.tone]};padding:1px 6px;border-radius:9999px;font-size:11px;font-weight:600;">${pin.status}</span></td></tr>
            <tr><td style="color:#64748b;padding:2px 8px 2px 0;">Location</td>
                <td>${pin.locationLabel}</td></tr>
            ${pin.value ? `<tr><td style="color:#64748b;padding:2px 8px 2px 0;">Value</td><td style="font-weight:600;">${pin.value}</td></tr>` : ""}
          </table>
          <div style="display:flex;gap:6px;margin-top:10px;">
            <button id="popup-details-${pin.id}"
              style="flex:1;padding:6px 0;background:#2563eb;color:white;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">
              DETAILS
            </button>
          </div>
        </div>`;

      marker.bindPopup(popupHtml, { maxWidth: 280 });

      marker.on("popupopen", () => {
        setTimeout(() => {
          document.getElementById(`popup-details-${pin.id}`)?.addEventListener("click", () => {
            setSelected(pin);
            setDetailTab("Details");
          });
        }, 50);
      });

      const key = pin.type;
      if (!layersRef.current[key]) {
        layersRef.current[key] = L.layerGroup().addTo(map);
      }
      marker.addTo(layersRef.current[key]);
    });
  }, [pins, filterType]);

  // ── Fly to selected pin ───────────────────────────────────────────────
  useEffect(() => {
    if (selected && mapRef.current) {
      mapRef.current.flyTo([selected.lat, selected.lng], 13, { animate: true, duration: 1 });
    }
  }, [selected]);

  // ── Status icon helper ────────────────────────────────────────────────
  function StatusIcon({ tone }: { tone: GisPin["tone"] }) {
    if (tone === "green")  return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (tone === "red")    return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (tone === "amber")  return <Clock className="h-4 w-4 text-amber-600" />;
    if (tone === "violet") return <Info className="h-4 w-4 text-violet-600" />;
    return <MapPin className="h-4 w-4 text-blue-600" />;
  }

  const toneLabel: Record<GisPin["tone"], string> = {
    green:  "text-green-700 bg-green-100",
    amber:  "text-amber-700 bg-amber-100",
    red:    "text-red-700 bg-red-100",
    blue:   "text-blue-700 bg-blue-100",
    violet: "text-violet-700 bg-violet-100",
  };

  return (
    <div className="relative w-full flex flex-col" style={{ height }}>
      {/* ── Top toolbar ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur border-b border-border z-10 flex-wrap">
        {/* Basemap toggle */}
        <div className="flex items-center border border-border rounded-lg overflow-hidden text-xs font-medium">
          <button
            onClick={() => setBasemap("satellite")}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${basemap === "satellite" ? "bg-blue-600 text-white" : "hover:bg-secondary"}`}
          >
            <Layers className="h-3.5 w-3.5" /> Satellite
          </button>
          <button
            onClick={() => setBasemap("street")}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${basemap === "street" ? "bg-blue-600 text-white" : "hover:bg-secondary"}`}
          >
            <Navigation className="h-3.5 w-3.5" /> Street
          </button>
        </div>

        {/* Type filter */}
        <div className="flex items-center border border-border rounded-lg overflow-hidden text-xs font-medium">
          {(["all", "tender", "project"] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 capitalize transition-colors ${filterType === t ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              {t === "all" ? "All Pins" : t === "tender" ? "Tenders" : "Projects"}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 ml-auto text-[11px] text-muted-foreground flex-wrap">
          {(["green", "amber", "red", "blue"] as const).map(t => (
            <span key={t} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: TONE_HEX[t] }} />
              <span className="capitalize">{t === "green" ? "On Track" : t === "amber" ? "At Risk" : t === "red" ? "Troubled" : "Active"}</span>
            </span>
          ))}
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" width="12" height="12"><circle cx="12" cy="9" r="5" fill="#2563eb"/></svg>
            Tender
          </span>
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" width="12" height="12"><rect x="7" y="4" width="10" height="10" rx="2" fill="#7c3aed"/></svg>
            Project
          </span>
        </div>

        <div className="text-[11px] font-semibold text-muted-foreground border border-border rounded-lg px-3 py-1.5">
          {title}
        </div>
      </div>

      {/* ── Map + Side Panel row ─────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Leaflet container */}
        <div
          ref={containerRef}
          className="flex-1 z-0"
          style={{ minHeight: 0 }}
        />

        {/* ── Side panel (styled like reference image) ──────────────── */}
        {selected && (
          <div className="w-80 flex-shrink-0 bg-white border-l border-border overflow-y-auto z-10 flex flex-col shadow-xl">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white sticky top-0 z-10">
              <span className="font-semibold text-sm">Case Details</span>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-secondary transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-border overflow-x-auto">
              {(["Details", "BOQ", "Media", "Reviews", "Report"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`flex items-center gap-1 px-3 py-2 text-[11px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                    detailTab === tab
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "Details" && <Info className="h-3 w-3" />}
                  {tab === "BOQ"     && <FileText className="h-3 w-3" />}
                  {tab === "Media"   && <Layers className="h-3 w-3" />}
                  {tab === "Reviews" && <CheckCircle2 className="h-3 w-3" />}
                  {tab === "Report"  && <Briefcase className="h-3 w-3" />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Panel body */}
            <div className="flex-1 p-4 space-y-4">
              {detailTab === "Details" && (
                <>
                  {/* Title block */}
                  <div className="text-center pb-3 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
                      {selected.type === "tender"
                        ? <FileText className="h-5 w-5 text-blue-600" />
                        : <Briefcase className="h-5 w-5 text-blue-600" />
                      }
                    </div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Case details: {selected.type === "tender" ? "Tender" : "Project"}
                    </p>
                    <p className="font-semibold text-sm leading-tight">{selected.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{selected.id}</p>
                    <div className="flex justify-center gap-2 mt-2 flex-wrap">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${toneLabel[selected.tone]}`}>
                        {selected.status}
                      </span>
                      {selected.priority && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          selected.priority === "Critical" ? "text-red-700 bg-red-100"
                          : selected.priority === "High"   ? "text-amber-700 bg-amber-100"
                          : "text-gray-600 bg-gray-100"
                        }`}>
                          {selected.priority}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Detail rows */}
                  <div className="space-y-2.5 text-sm">
                    {[
                      { label: "Case Number", value: selected.id },
                      { label: "Location",    value: selected.locationLabel },
                      { label: "Details",     value: selected.title },
                      { label: "Domain",      value: selected.type === "tender" ? "Procurement" : "Project Management" },
                      { label: "Entity",      value: selected.entity },
                      ...(selected.officer       ? [{ label: "Officer",    value: selected.officer }]       : []),
                      ...(selected.contactPhone  ? [{ label: "Contacts",   value: selected.contactPhone }]  : []),
                      ...(selected.value         ? [{ label: "Value",      value: selected.value }]         : []),
                      ...(selected.phase         ? [{ label: "Phase",      value: selected.phase }]         : []),
                      ...(selected.startDate && selected.endDate
                        ? [{ label: "Start Date", value: selected.startDate }, { label: "End Date", value: selected.endDate }]
                        : []
                      ),
                    ].map(row => (
                      <div key={row.label} className="flex gap-2">
                        <span className="w-24 flex-shrink-0 text-xs text-muted-foreground font-medium">{row.label}</span>
                        <span className="flex-1 text-xs text-foreground">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3">
                    <StatusIcon tone={selected.tone} />
                    <span className="text-xs font-medium">{selected.status}</span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate(selected)}
                        className="w-full flex items-center justify-center gap-2 h-9 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" /> DETAILS
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (mapRef.current) {
                          mapRef.current.flyTo([selected.lat, selected.lng], 15, { duration: 1 });
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 h-9 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                    >
                      <Navigation className="h-4 w-4" /> DIRECTIONS
                    </button>
                  </div>
                </>
              )}

              {detailTab === "BOQ" && (
                <div className="text-center py-10 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Bill of Quantities</p>
                  <p className="text-xs mt-1">No BOQ attached for this {selected.type}.</p>
                </div>
              )}

              {detailTab === "Media" && (
                <div className="text-center py-10 text-muted-foreground">
                  <Layers className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Media Files</p>
                  <p className="text-xs mt-1">No media uploaded yet.</p>
                </div>
              )}

              {detailTab === "Reviews" && (
                <div className="text-center py-10 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Reviews</p>
                  <p className="text-xs mt-1">No reviews recorded.</p>
                </div>
              )}

              {detailTab === "Report" && (
                <div className="text-center py-10 text-muted-foreground">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Report</p>
                  <p className="text-xs mt-1">Generate a report for this {selected.type}.</p>
                  <button className="mt-4 h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                    Generate PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
