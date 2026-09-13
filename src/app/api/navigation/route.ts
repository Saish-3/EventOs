import { NextRequest, NextResponse } from 'next/server';
import { getRoute } from '@/services/navigation.service';
export async function GET(req: NextRequest) { const p=req.nextUrl.searchParams; return NextResponse.json({success:true,data:getRoute(p.get('from')||'z1',p.get('to')||'z4',p.get('accessible')==='true')}); }
