// Reemplaza la imagen de la sección 'hero' en Supabase por la nueva foto
// diurna de la fachada. Uso: node scripts/replace-hero.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const BUCKET = "parroquia-media";

// Desactiva las imágenes 'hero' actuales (no las borra, por si acaso)
const { data: existentes } = await supabase.from("imagenes").select("id").eq("section", "hero");
if (existentes?.length) {
  await supabase.from("imagenes").update({ active: false }).eq("section", "hero");
  console.log(`Desactivadas ${existentes.length} imágenes 'hero' anteriores`);
}

const filePath = path.join(__dirname, "..", "public", "images", "hero-dia.webp");
const fileBuffer = readFileSync(filePath);
const storagePath = `hero/${crypto.randomUUID()}-fachada-templo-parroquial.webp`;

const { error: uploadError } = await supabase.storage
  .from(BUCKET)
  .upload(storagePath, fileBuffer, { contentType: "image/webp", upsert: false });
if (uploadError) throw uploadError;

const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

const { error: dbError } = await supabase.from("imagenes").insert({
  storage_path: storagePath,
  public_url: urlData.publicUrl,
  alt: "Fachada del Templo Parroquial Nuestra Señora del Carmen de Cachipay",
  section: "hero",
  active: true,
});
if (dbError) throw dbError;

console.log("✓ Nueva foto de portada subida:", urlData.publicUrl);
