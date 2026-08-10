import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/paypal/client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
    }

    const order = await createOrder(amount, "USD", crypto.randomUUID());

    const admin = createAdminClient();
    const { error } = await admin.from("donaciones").insert({
      amount,
      currency: "USD",
      gateway: "paypal",
      gateway_reference: order.id,
      status: "pending",
      purpose: "general",
    });
    if (error) throw error;

    return NextResponse.json({ orderID: order.id });
  } catch (error) {
    console.error("PayPal create-order error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
