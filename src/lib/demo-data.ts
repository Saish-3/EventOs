export type DemoSession = {
  id: string; title: string; description: string; date: string; startTime: string; endTime: string;
  speaker: string; speakerRole: string; company: string; sessionType: string; track: string; venue: string;
  tags: string[];
};

export const demoUser = {
  id: 'demo-priya', name: 'Priya Sharma', email: 'priya@demo.eventos.dev', company: 'NeuralStack AI',
  jobTitle: 'AI Engineer', interests: ['AI agents','LLMs','computer vision'],
  goals: ['learn about AI deployment','meet AI startups','find co-founder'],
};

export const sessions: DemoSession[] = [
 {id:'s1',title:'Anthropic on AI',description:'A practical conversation on AI and the next generation of intelligent systems.',date:'2026-05-29',startTime:'11:40 AM',endTime:'12:10 PM',speaker:'Irina Ghose',speakerRole:'Managing Director, Anthropic India',company:'Anthropic',sessionType:'TALK',track:'AI',venue:'CST',tags:['AI','LLMs','AI deployment']},
 {id:'s2',title:'OpenAI Session',description:'Perspectives on deploying frontier AI and building the AI ecosystem in India.',date:'2026-05-29',startTime:'12:20 PM',endTime:'1:00 PM',speaker:'Pragya Misra, Thomas Jeng, Arjun Gupta',speakerRole:'OpenAI India / APAC',company:'OpenAI',sessionType:'TALK',track:'AI',venue:'CST',tags:['AI','LLMs','startups','AI deployment']},
 {id:'s3',title:'IDFC FIRST Bank on Technology & Banking',description:'How technology and AI are reshaping modern banking.',date:'2026-05-29',startTime:'1:10 PM',endTime:'1:50 PM',speaker:'V. Vaidyanathan',speakerRole:'MD & CEO',company:'IDFC FIRST Bank',sessionType:'TALK',track:'FINTECH',venue:'CST',tags:['fintech','AI','enterprise']},
 {id:'s4',title:'Swiggy: Building with AI',description:'How product and engineering teams apply AI to a high-scale consumer platform.',date:'2026-05-29',startTime:'2:00 PM',endTime:'2:20 PM',speaker:'Madhusudhan Rao',speakerRole:'CTO',company:'Swiggy',sessionType:'TALK',track:'PRODUCT',venue:'CST',tags:['AI in products','product','engineering']},
 {id:'s5',title:'Fireside Chat: The Future of Digital Payments',description:'The future of payments and India’s digital public infrastructure.',date:'2026-05-29',startTime:'2:30 PM',endTime:'2:50 PM',speaker:'Dilip Asbe',speakerRole:'MD & CEO',company:'NPCI',sessionType:'FIRESIDE',track:'FINTECH',venue:'CST',tags:['fintech','payments','AI']},
 {id:'s6',title:'Urban Company: Scaling Services with AI',description:'Lessons from applying AI to marketplace and service operations.',date:'2026-05-29',startTime:'3:00 PM',endTime:'3:20 PM',speaker:'Raghav Chandra',speakerRole:'Co-Founder',company:'Urban Company',sessionType:'TALK',track:'STARTUP',venue:'CST',tags:['AI','startups','scale']},
 {id:'s7',title:'Google Cloud: AI Infrastructure for India',description:'AI infrastructure patterns for teams building at scale.',date:'2026-05-29',startTime:'3:30 PM',endTime:'3:50 PM',speaker:'Arun Srinivas',speakerRole:'Google Cloud India',company:'Google Cloud',sessionType:'TALK',track:'AI',venue:'CST',tags:['AI infrastructure','cloud','AI deployment']},
 {id:'s8',title:'PhonePe: Building India’s Digital Economy',description:'Building resilient digital products for millions of users.',date:'2026-05-29',startTime:'4:00 PM',endTime:'4:20 PM',speaker:'Sameer Nigam',speakerRole:'Founder & CEO',company:'PhonePe',sessionType:'TALK',track:'FINTECH',venue:'CST',tags:['fintech','product','scale']},
 {id:'s9',title:'Meta: The AI-First Future',description:'What an AI-first product and platform strategy looks like.',date:'2026-05-29',startTime:'4:30 PM',endTime:'4:50 PM',speaker:'Sandhya Devanathan',speakerRole:'VP, India',company:'Meta',sessionType:'TALK',track:'AI',venue:'CST',tags:['AI','product','AI in products']},
 {id:'s10',title:'MakeMyTrip: AI in Travel',description:'How AI is changing discovery, personalization and travel experiences.',date:'2026-05-30',startTime:'11:00 AM',endTime:'11:30 AM',speaker:'Rajesh Magow',speakerRole:'Group CEO',company:'MakeMyTrip',sessionType:'TALK',track:'PRODUCT',venue:'CST',tags:['AI in products','recommendation systems','product']},
 {id:'s11',title:'Startup Showcase: AI Builders',description:'Discover early-stage companies building ambitious AI products.',date:'2026-05-30',startTime:'12:00 PM',endTime:'1:00 PM',speaker:'Early-stage founders',speakerRole:'Startup Showcase',company:'Mumbai Tech Week',sessionType:'SHOWCASE',track:'STARTUP',venue:'Launch Arena',tags:['startups','AI','founders']},
 {id:'s12',title:'AI Careers & Opportunities',description:'Meet companies hiring across AI, engineering, product and data.',date:'2026-05-30',startTime:'2:00 PM',endTime:'3:00 PM',speaker:'Hiring teams',speakerRole:'Job Fair',company:'Mumbai Tech Week',sessionType:'JOB FAIR',track:'ENGINEERING',venue:'Uplink Terminal',tags:['jobs','AI talent','engineering']},
];

export const zones = [
 'The Gateway','Registration','Docking Area','CST','TEAM Lounge','Foundry Bay','The Origin Harbour','The Fuel Dock','Idea Transfer Platform','Launch Arena','Expo Port','Uplink Terminal','Exit'
];

export const companies = ['AI Humanize','Ambitio','Bolna','BugRaid AI','Cloudanix','ConscioussAI','craftAI','GreyLabs AI','Ignosis AI','JuriSynk','KuboCare','Mavs AI','Mosaic Wellness','nugget.ai','Phot.AI','RevRag AI','Rezolv','Ringg','TerraStack','videosdk'];

export function scoreSession(session: DemoSession, interests = demoUser.interests, goals = demoUser.goals) {
 const hay = `${session.title} ${session.description} ${session.track} ${session.company} ${session.tags.join(' ')}`.toLowerCase();
 const interestHits = interests.filter(x => hay.includes(x.toLowerCase())).length;
 const goalHits = goals.filter(x => hay.includes(x.toLowerCase().split(' ').slice(-2).join(' ')) || hay.includes(x.toLowerCase().split(' ')[0])).length;
 return interestHits * 4 + goalHits * 2 + (session.track === 'AI' ? 2 : 0);
}

export function recommendedSessions(interests = demoUser.interests, goals = demoUser.goals) {
 return [...sessions].sort((a,b)=>scoreSession(b,interests,goals)-scoreSession(a,interests,goals)).slice(0,4);
}
