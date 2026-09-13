import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json({success:true,data:[{id:'n1',type:'SESSION_CHANGE',title:'Schedule intelligence',body:'EventOS will surface schedule changes here.',time:'Now'},{id:'n2',type:'FOOD',title:'Pickup ready',body:'Your ready-order alert will appear here.',time:'Demo'}],simulated:true});}
