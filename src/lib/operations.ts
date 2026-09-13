import { companies, sessions, zones, type DemoSession } from './demo-data';

export type CrowdLevel = 'LOW' | 'MODERATE' | 'BUSY' | 'CRITICAL';
export type Zone = { id: string; name: string; x: number; y: number; type: string };

export const zoneData: Zone[] = zones.map((name, i) => ({
  id: `z${i + 1}`, name, x: 12 + (i % 4) * 25, y: 15 + Math.floor(i / 4) * 25,
  type: name === 'The Fuel Dock' ? 'food' : name === 'Launch Arena' ? 'startup_showcase' : name === 'Uplink Terminal' ? 'job_fair' : name === 'CST' ? 'stage' : 'venue'
}));

export const edgePairs = zoneData.flatMap((z, i) => i < zoneData.length - 1 ? [{ from: z.id, to: zoneData[i + 1].id, weight: 3 + (i % 3) }] : []);

export const crowd: Record<string, { level: CrowdLevel; count: number }> = Object.fromEntries(zoneData.map((z, i) => [z.id, {
  level: (i % 5 === 0 ? 'BUSY' : i % 3 === 0 ? 'MODERATE' : 'LOW') as CrowdLevel,
  count: 180 + i * 47,
}]));

export function findRoute(fromId: string, toId: string, accessible = false) {
  if (fromId === toId) return [zoneData.find(z => z.id === fromId)!];
  const start = zoneData.find(z => z.id === fromId) ?? zoneData[0];
  const target = zoneData.find(z => z.id === toId) ?? zoneData[3];
  // A compact A* implementation over the simplified demo graph. Edges are bidirectional.
  const neighbors = (id: string) => edgePairs.flatMap(e => e.from === id ? [{ id: e.to, w: e.weight }] : e.to === id ? [{ id: e.from, w: e.weight }] : []);
  const open = new Set([start.id]); const came = new Map<string, string>(); const g = new Map<string, number>([[start.id, 0]]);
  const h = (id: string) => { const a = zoneData.find(z => z.id === id)!; return Math.hypot(a.x - target.x, a.y - target.y) / 10; };
  const f = new Map<string, number>([[start.id, h(start.id)]]);
  while (open.size) {
    const current = [...open].sort((a, b) => (f.get(a) ?? Infinity) - (f.get(b) ?? Infinity))[0];
    if (current === target.id) {
      const path = [current]; let c = current; while (came.has(c)) { c = came.get(c)!; path.unshift(c); }
      return path.map(id => zoneData.find(z => z.id === id)!);
    }
    open.delete(current);
    for (const n of neighbors(current)) {
      const crowdPenalty = 1 + ((crowd[n.id]?.level === 'CRITICAL' ? 2 : crowd[n.id]?.level === 'BUSY' ? .7 : crowd[n.id]?.level === 'MODERATE' ? .25 : 0));
      const tentative = (g.get(current) ?? Infinity) + n.w * crowdPenalty + (accessible ? 0 : 0);
      if (tentative < (g.get(n.id) ?? Infinity)) { came.set(n.id, current); g.set(n.id, tentative); f.set(n.id, tentative + h(n.id)); open.add(n.id); }
    }
  }
  return [start, target];
}

export function recommendedFood() { return [
  { id: 'f1', name: 'Paneer Power Bowl', price: 220, prep: 10, vendor: 'Fuel Dock Kitchen', slot: '12:40–12:50', remaining: 8 },
  { id: 'f2', name: 'Veggie Wrap', price: 180, prep: 8, vendor: 'Fuel Dock Kitchen', slot: '12:50–1:00', remaining: 4 },
  { id: 'f3', name: 'Cold Coffee', price: 120, prep: 5, vendor: 'Fuel Dock Café', slot: '1:00–1:10', remaining: 6 },
]; }

export type Match = { name: string; role: string; company: string; reason: string; availability: string };
export const syntheticPeople: Match[] = [
 { name: 'Aarav Mehta', role: 'Founder', company: 'GreyLabs AI', reason: 'AI + startup-building overlap', availability: 'Open to networking' },
 { name: 'Ananya Rao', role: 'Product Lead', company: 'Phot.AI', reason: 'Product + generative AI overlap', availability: 'Available later' },
 { name: 'Kabir Shah', role: 'ML Engineer', company: 'videosdk', reason: 'Engineering + AI infrastructure overlap', availability: 'Open to networking' },
 { name: 'Meera Kulkarni', role: 'Talent Partner', company: 'Quantiphi', reason: 'Relevant AI engineering opportunities', availability: 'Open to networking' },
];

export function matchPeople(query = '') {
  const q = query.toLowerCase();
  return syntheticPeople.map(p => ({ ...p, score: [p.role, p.company, p.reason].join(' ').toLowerCase().includes(q) ? 10 : 5 })).sort((a,b) => b.score-a.score);
}

export function findCompanies(query = '') { const q = query.toLowerCase(); return companies.filter(c => !q || c.toLowerCase().includes(q) || ['AI','startup','founder'].some(k => q.includes(k))).slice(0, 12); }
export function sessionById(id: string): DemoSession | undefined { return sessions.find(s => s.id === id); }
