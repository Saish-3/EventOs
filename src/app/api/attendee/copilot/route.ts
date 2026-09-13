import { NextRequest, NextResponse } from 'next/server';
import { answerCopilot, copilotContext } from '@/services/ai.service';
export async function POST(req:NextRequest){try{const {message}=await req.json();if(typeof message!=='string'||!message.trim())return NextResponse.json({success:false,error:'Message is required'},{status:400});const data=await answerCopilot(message);return NextResponse.json({success:true,data:{...data,...copilotContext(),grounded:true}});}catch{return NextResponse.json({success:false,error:'Copilot unavailable'},{status:500});}}
