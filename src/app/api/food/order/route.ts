import { NextRequest, NextResponse } from 'next/server';
import { createDemoOrder } from '@/services/food.service';
export async function POST(req:NextRequest){try{const {itemId,slot}=await req.json();return NextResponse.json({success:true,data:createDemoOrder(itemId,slot),simulated:true});}catch(e){return NextResponse.json({success:false,error:e instanceof Error?e.message:'Order failed'},{status:400});}}
