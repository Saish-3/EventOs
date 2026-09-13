import { NextRequest, NextResponse } from 'next/server'; import { getPeopleMatches } from '@/services/networking.service';
export async function GET(req:NextRequest){return NextResponse.json({success:true,data:getPeopleMatches(req.nextUrl.searchParams.get('q')||'')});}
