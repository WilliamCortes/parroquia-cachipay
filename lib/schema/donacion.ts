import { z } from "zod";

export const donacionSchema = z.object({
  amount: z.coerce.number().positive().max(50_000_000),
  donor_name: z.string().trim().max(200).optional(),
  donor_email: z.string().trim().email().max(200).optional().or(z.literal("")),
  purpose: z
    .enum(["diezmo", "ofrenda", "construccion_capilla_tocarema", "general"])
    .default("general"),
});

export type DonacionInput = z.infer<typeof donacionSchema>;
