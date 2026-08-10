"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (el: HTMLElement) => void };
    };
  }
}

export function PaypalButton({ clientId }: { clientId: string }) {
  const [amount, setAmount] = useState("20");
  const [sdkReady, setSdkReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);
  const amountRef = useRef(amount);
  amountRef.current = amount;

  useEffect(() => {
    if (!sdkReady || renderedRef.current || !window.paypal || !containerRef.current) return;
    renderedRef.current = true;

    window.paypal.Buttons({
      createOrder: async () => {
        const res = await fetch("/api/donaciones/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Number(amountRef.current) }),
        });
        const data = await res.json();
        return data.orderID;
      },
      onApprove: async (data: { orderID: string }) => {
        setStatus("processing");
        const res = await fetch("/api/donaciones/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: data.orderID }),
        });
        setStatus(res.ok ? "success" : "error");
      },
      onError: () => setStatus("error"),
    }).render(containerRef.current);
  }, [sdkReady]);

  return (
    <div className="space-y-3">
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`}
        onReady={() => setSdkReady(true)}
      />
      <div className="space-y-1.5">
        <Label htmlFor="paypal-amount" className="text-xs">Monto (USD)</Label>
        <Input
          id="paypal-amount"
          type="number"
          min={1}
          step={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div ref={containerRef} />
      {status === "processing" && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" /> Procesando...
        </p>
      )}
      {status === "success" && (
        <p className="text-xs text-primary">¡Gracias por tu donación!</p>
      )}
      {status === "error" && (
        <p className="text-xs text-destructive">Hubo un problema. Intenta de nuevo.</p>
      )}
    </div>
  );
}
