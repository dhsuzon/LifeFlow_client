import Stripe from "stripe";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
    if (!secretKey) return Response.json({ error: "Stripe is not configured" }, { status: 503 });
    if (!secretKey.startsWith("sk_")) {
      return Response.json(
        { error: "STRIPE_SECRET_KEY must use an sk_test_ or sk_live_ key, not a publishable key." },
        { status: 503 },
      );
    }
    const { amount } = await request.json(); const value=Number(amount);
    if (!Number.isFinite(value)||value<1||value>100000) return Response.json({error:"Enter a valid amount"},{status:400});
    const stripe=new Stripe(secretKey); const origin=new URL(request.url).origin;
    const checkout=await stripe.checkout.sessions.create({mode:"payment",payment_method_types:["card"],line_items:[{quantity:1,price_data:{currency:"usd",unit_amount:Math.round(value*100),product_data:{name:"LifeFlow Organization Fund"}}}],customer_email:session.user.email,metadata:{userId:session.user.id,userName:session.user.name,userEmail:session.user.email},success_url:`${origin}/funding?payment=success`,cancel_url:`${origin}/funding?payment=canceled`});
    return Response.json({url:checkout.url});
  } catch (error) {
    return Response.json(
      { error: error?.message || "Unable to start Stripe Checkout." },
      { status: 500 },
    );
  }
}
