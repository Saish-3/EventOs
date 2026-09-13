import { NextRequest, NextResponse } from 'next/server'; import { getCompanyMatches } from '@/services/networking.service';
export async function GET(req:NextRequest){return NextResponse.json({success:true,data:getCompanyMatches(req.nextUrl.searchParams.get('q')||'')});}
