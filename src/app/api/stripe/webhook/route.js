import Stripe from "stripe";
import { db } from "@/lib/db";

export async function POST(request) {
  if(!process.env.STRIPE_SECRET_KEY||!process.env.STRIPE_WEBHOOK_SECRET)return new Response("Stripe is not configured",{status:503});
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const body=await request.text(); const signature=request.headers.get("stripe-signature"); let event;
  try{event=stripe.webhooks.constructEvent(body,signature,process.env.STRIPE_WEBHOOK_SECRET)}catch{return new Response("Invalid signature",{status:400})}
  if(event.type==="checkout.session.completed"){const session=event.data.object;await db.collection("funds").updateOne({stripeSessionId:session.id},{$setOnInsert:{stripeSessionId:session.id,userId:session.metadata?.userId,userName:session.metadata?.userName||"User",userEmail:session.metadata?.userEmail||session.customer_email,amount:(session.amount_total||0)/100,currency:session.currency||"usd",fundingDate:new Date()}},{upsert:true})}
  return Response.json({received:true});
}
