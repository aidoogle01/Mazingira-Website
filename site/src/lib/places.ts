// Real coordinates for the places Mazingira's routes visit, shared by RouteMap and MiniRoute.
export const PLACES: Record<string, { name: string; lat: number; lon: number; off?: boolean }> = {
  arusha: { name: 'Arusha', lat: -3.37, lon: 36.68 },
  kilimanjaro: { name: 'Kilimanjaro Airport', lat: -3.43, lon: 37.07 },
  tarangire: { name: 'Tarangire', lat: -3.95, lon: 36.05 },
  'lake-manyara': { name: 'Lake Manyara', lat: -3.53, lon: 35.82 },
  karatu: { name: 'Karatu', lat: -3.34, lon: 35.67 },
  ngorongoro: { name: 'Ngorongoro Crater', lat: -3.2, lon: 35.53 },
  ndutu: { name: 'Ndutu', lat: -3.0, lon: 34.98 },
  serengeti: { name: 'Central Serengeti', lat: -2.43, lon: 34.82 },
  'north-serengeti': { name: 'Northern Serengeti', lat: -1.62, lon: 34.9 },
  'lake-natron': { name: 'Lake Natron', lat: -2.42, lon: 36.0 },
  zanzibar: { name: 'Zanzibar', lat: -6.16, lon: 39.2, off: true },
};
export const F = { west: 34.4, east: 37.4, north: -1.3, south: -4.3 };
