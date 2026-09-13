import { NextResponse } from 'next/server';
import { demoUser, sessions, recommendedSessions, companies, zones } from '@/lib/demo-data';

export async function GET() {
 return NextResponse.json({ success:true, data:{ user:demoUser, sessions, recommendations:recommendedSessions(), companies, zones, event:{name:'Mumbai Tech Week 2026',theme:'AI in Action',dates:'May 29–30, 2026',venue:'Jio World Convention Centre, Mumbai'} } });
}
