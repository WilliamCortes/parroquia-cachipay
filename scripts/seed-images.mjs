// Sube las imágenes curadas de assets/ al bucket de Supabase Storage y
// crea sus filas en la tabla `imagenes`. Requiere SUPABASE_SERVICE_ROLE_KEY
// en .env.local. Uso: node scripts/seed-images.mjs
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
const ROOT = path.join(__dirname, "..");

const IMAGES = [
  { file: "public/images/hero.jpg", section: "hero", alt: "Templo Parroquial Nuestra Señora del Carmen de Cachipay" },
  { file: "public/images/galeria-1.webp", section: "galeria", alt: "Celebración vereda Tocarema, fiesta patronal" },
  { file: "public/images/galeria-2.webp", section: "galeria", alt: "Celebración vereda El Ocaso, fiesta patronal" },
  { file: "public/images/galeria-3.webp", section: "galeria", alt: "Día de la Virgen del Carmen, misas patronales" },
  { file: "public/images/galeria-4.webp", section: "galeria", alt: "Gran Bingo Familiar, fiesta patronal" },
  { file: "public/images/galeria-5.jpg", section: "galeria", alt: "Comunidad parroquial" },
  { file: "public/images/galeria-6.jpg", section: "galeria", alt: "Comunidad parroquial" },
  { file: "public/images/galeria-7.jpg", section: "galeria", alt: "Comunidad parroquial" },
  { file: "public/images/galeria-8.jpg", section: "galeria", alt: "Comunidad parroquial" },
  { file: "public/images/galeria-9.jpg", section: "galeria", alt: "Sacerdotes de la parroquia" },
];

function slugifyFilename(name) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return ext ? `${slug}.${ext}` : slug;
}

for (const img of IMAGES) {
  const filePath = path.join(ROOT, img.file);
  const fileBuffer = readFileSync(filePath);
  const ext = path.extname(img.file).slice(1);
  const contentType = ext === "webp" ? "image/webp" : "image/jpeg";
  const storagePath = `${img.section}/${crypto.randomUUID()}-${slugifyFilename(path.basename(img.file))}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, { contentType, upsert: false });

  if (uploadError) {
    console.error(`✗ ${img.file}:`, uploadError.message);
    continue;
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  const { error: dbError } = await supabase.from("imagenes").insert({
    storage_path: storagePath,
    public_url: urlData.publicUrl,
    alt: img.alt,
    section: img.section,
    active: true,
  });

  if (dbError) {
    console.error(`✗ DB insert ${img.file}:`, dbError.message);
  } else {
    console.log(`✓ ${img.file} -> ${img.section}`);
  }
}

console.log("Listo.");
