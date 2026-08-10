"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WompiButton() {
  const [amount, setAmount] = useState("50000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/donaciones/wompi/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), purpose: "general" }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      const params = new URLSearchParams({
        "public-key": data.publicKey,
        currency: data.currency,
        "amount-in-cents": String(data.amountInCents),
        reference: data.reference,
        "signature:integrity": data.signature,
        "redirect-url": data.redirectUrl,
      });
      window.location.href = `${data.checkoutUrl}?${params.toString()}`;
    } catch {
      setError("No se pudo iniciar el pago. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="wompi-amount" className="text-xs">Monto (COP)</Label>
        <Input
          id="wompi-amount"
          type="number"
          min={1000}
          step={1000}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button onClick={handleClick} disabled={loading} className="w-full">
        {loading && <Loader2 className="size-4 animate-spin" />}
        Donar con Wompi
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
