import { crowd, zoneData, type CrowdLevel } from '@/lib/operations';
export function getCrowd() { return zoneData.map(z => ({ ...z, ...(crowd[z.id] ?? { level: 'LOW' as CrowdLevel, count: 0 }) })); }
export function simulateSurge(zoneId: string) { if (crowd[zoneId]) crowd[zoneId] = { level: 'CRITICAL', count: crowd[zoneId].count + 350 }; return crowd[zoneId]; }
