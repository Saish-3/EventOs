import { recommendedSessions } from '@/lib/demo-data';
export function getRecommendations(interests?: string[], goals?: string[]) { return recommendedSessions(interests, goals).map((s, i) => ({ ...s, score: 94 - i * 7, reason: i === 0 ? 'Strong match for your AI interests and goals.' : 'Relevant to your profile and event goals.' })); }
