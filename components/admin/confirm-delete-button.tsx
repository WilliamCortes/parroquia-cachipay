"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteButton({
  confirmMessage = "¿Eliminar este elemento? Esta acción no se puede deshacer.",
}: {
  confirmMessage?: string;
}) {
  return (
    <Button
      type="submit"
      variant="ghost"
      size="icon"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
