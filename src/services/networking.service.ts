import { findCompanies, matchPeople } from '@/lib/operations';
export const getPeopleMatches = (q = '') => matchPeople(q);
export const getCompanyMatches = (q = '') => findCompanies(q);
export function introFor(person: { name: string; role: string; company: string }) { return `Hi ${person.name}, I’m Priya from NeuralStack AI. We’re both exploring AI at Mumbai Tech Week, and I’d love to hear what you’re building at ${person.company}. Open to a quick hello?`; }
