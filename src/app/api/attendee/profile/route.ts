import { NextRequest, NextResponse } from 'next/server';
import { demoUser, recommendedSessions } from '@/lib/demo-data';
export async function GET(){ return NextResponse.json({success:true,data:demoUser}); }
export async function PATCH(req:NextRequest){ const body=await req.json(); const user={...demoUser, interests:Array.isArray(body.interests)?body.interests:demoUser.interests, goals:Array.isArray(body.goals)?body.goals:demoUser.goals, jobTitle:body.jobTitle||demoUser.jobTitle, company:body.company||demoUser.company}; return NextResponse.json({success:true,data:{user,recommendations:recommendedSessions(user.interests,user.goals)}}); }
