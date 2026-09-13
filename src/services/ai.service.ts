import { demoUser, recommendedSessions } from '@/lib/demo-data';
import { getCompanyMatches, getPeopleMatches } from './networking.service';
export async function answerCopilot(message: string) {
  const q = message.toLowerCase();
  if (q.includes('company') || q.includes('startup')) return { text: `For your goal of meeting AI startups, I’d start with ${getCompanyMatches('AI').slice(0,5).join(', ')}. These are synthetic/demo company records from the MTW showcase dataset.`, companies: getCompanyMatches('AI').slice(0,8) };
  if (q.includes('meet') || q.includes('people')) return { text: `I found ${getPeopleMatches().length} synthetic opt-in matches. The strongest fit is ${getPeopleMatches()[0].name} from ${getPeopleMatches()[0].company}: ${getPeopleMatches()[0].reason}.`, people: getPeopleMatches().slice(0,4) };
  if (q.includes('where') || q.includes('openai')) return { text: 'The OpenAI session is in CST — Creator Source Terminal, the main-stage area in the official MTW map. EventOS can route you there from your current checkpoint.' };
  if (q.includes('food') || q.includes('lunch')) return { text: 'The Fuel Dock is the official F&B area. EventOS demo pickup slots are capacity-controlled so you can order without waiting at the counter.', food: true };
  const r = recommendedSessions()[0];
  return { text: `I’d prioritize ${r.title}. It matches your AI interests and your goal of learning about AI deployment. It starts at ${r.startTime} in ${r.venue}.`, sessions: recommendedSessions() };
}
export const copilotContext = () => ({ user: demoUser, grounding: 'Mumbai Tech Week 2026 public event data + clearly labelled EventOS demo data' });
