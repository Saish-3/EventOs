import { findRoute, zoneData } from '@/lib/operations';
export function getRoute(from: string, to: string, accessible = false) { const path = findRoute(from, to, accessible); return { path, minutes: Math.max(1, path.length * 3), disclaimer: 'Simplified digital venue map — not to scale.' }; }
export function getZone(id: string) { return zoneData.find(z => z.id === id); }
