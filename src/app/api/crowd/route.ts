import { NextRequest, NextResponse } from 'next/server';
import { getCrowd, simulateSurge } from '@/services/crowd.service';
export async function GET(){return NextResponse.json({success:true,data:getCrowd(),simulated:true});}
export async function POST(req:NextRequest){const {zoneId}=await req.json();return NextResponse.json({success:true,data:simulateSurge(zoneId),simulated:true});}
