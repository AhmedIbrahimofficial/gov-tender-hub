/**
 * Zimbabwe provinces — centroids, boundaries (simplified polygons), and procurement data.
 * Used for choropleth map, heat circles, and regional charts.
 */

export type ZWProvince = {
  id: string;
  name: string;
  capital: string;
  lat: number;
  lng: number;
  /** Approximate bounding radius in km for heat circle */
  radiusKm: number;
  /** Tender spend USD millions */
  tenderSpendM: number;
  /** Number of active tenders */
  activeTenders: number;
  /** Number of projects */
  activeProjects: number;
  /** Awarded contracts USD millions */
  awardedM: number;
  /** Compliance score 0-100 */
  compliance: number;
  population: number;
};

export const ZW_PROVINCES: ZWProvince[] = [
  { id: "harare",      name: "Harare",               capital: "Harare",        lat: -17.8252, lng: 31.0335, radiusKm: 35,  tenderSpendM: 312, activeTenders: 48, activeProjects: 22, awardedM: 198, compliance: 94, population: 2123132 },
  { id: "bulawayo",    name: "Bulawayo",              capital: "Bulawayo",      lat: -20.1501, lng: 28.5800, radiusKm: 30,  tenderSpendM: 124, activeTenders: 19, activeProjects: 11, awardedM: 87,  compliance: 88, population: 653337  },
  { id: "manicaland",  name: "Manicaland",            capital: "Mutare",        lat: -18.9707, lng: 32.6709, radiusKm: 75,  tenderSpendM: 89,  activeTenders: 14, activeProjects: 9,  awardedM: 56,  compliance: 81, population: 1751277 },
  { id: "mash_central",name: "Mashonaland Central",   capital: "Bindura",       lat: -17.3025, lng: 31.3318, radiusKm: 65,  tenderSpendM: 67,  activeTenders: 11, activeProjects: 7,  awardedM: 43,  compliance: 76, population: 1179756 },
  { id: "mash_east",   name: "Mashonaland East",      capital: "Marondera",     lat: -18.1861, lng: 32.0822, radiusKm: 70,  tenderSpendM: 78,  activeTenders: 13, activeProjects: 8,  awardedM: 51,  compliance: 79, population: 1344075 },
  { id: "mash_west",   name: "Mashonaland West",      capital: "Chinhoyi",      lat: -17.3613, lng: 30.1974, radiusKm: 85,  tenderSpendM: 95,  activeTenders: 15, activeProjects: 10, awardedM: 62,  compliance: 83, population: 1561875 },
  { id: "masvingo",    name: "Masvingo",              capital: "Masvingo",      lat: -20.0724, lng: 30.8316, radiusKm: 90,  tenderSpendM: 110, activeTenders: 16, activeProjects: 12, awardedM: 78,  compliance: 85, population: 1485865 },
  { id: "mat_north",   name: "Matabeleland North",    capital: "Lupane",        lat: -18.9312, lng: 27.8071, radiusKm: 100, tenderSpendM: 72,  activeTenders: 10, activeProjects: 8,  awardedM: 48,  compliance: 72, population: 749017  },
  { id: "mat_south",   name: "Matabeleland South",    capital: "Gwanda",        lat: -21.4425, lng: 29.0094, radiusKm: 95,  tenderSpendM: 58,  activeTenders: 8,  activeProjects: 6,  awardedM: 37,  compliance: 69, population: 683893  },
  { id: "midlands",    name: "Midlands",              capital: "Gweru",         lat: -19.4532, lng: 29.8163, radiusKm: 85,  tenderSpendM: 84,  activeTenders: 13, activeProjects: 9,  awardedM: 55,  compliance: 80, population: 1614941 },
];

/** Total spend across all provinces */
export const TOTAL_SPEND_M = ZW_PROVINCES.reduce((s, p) => s + p.tenderSpendM, 0);

/** Spend intensity 0–1 for choropleth coloring */
export function spendIntensity(province: ZWProvince): number {
  const max = Math.max(...ZW_PROVINCES.map(p => p.tenderSpendM));
  return province.tenderSpendM / max;
}

/** Color for choropleth based on spend intensity */
export function choroColor(intensity: number): string {
  // Dark teal → light (matches the image's dark blue choropleth)
  const r = Math.round(0   + (173 - 0)   * (1 - intensity));
  const g = Math.round(80  + (216 - 80)  * (1 - intensity));
  const b = Math.round(140 + (230 - 140) * (1 - intensity));
  return `rgb(${r},${g},${b})`;
}
