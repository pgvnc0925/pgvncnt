import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ADMIN_COOKIE = "pv_admin_session";
const STORAGE_BUCKETS = {
  mdx: "pv-mdx",
  rag: "pv-rag",
  covers: "pv-covers",
  audio: "pv-audio",
  maps: "pv-maps",
  quiz: "pv-quiz",
} as const;

function sanitizeFilename(name: string) {
  const base = path.basename(name);
  return base.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function saveUpload(params: {
  file: File | null;
  allowedExt: string[];
  destinationDir: string;
}) {
  const { file, allowedExt, destinationDir } = params;
  if (!file) {
    throw new Error("Nessun file selezionato");
  }

  const filename = sanitizeFilename(file.name);
  const ext = path.extname(filename).toLowerCase();
  if (!allowedExt.includes(ext)) {
    throw new Error(`Estensione non permessa. Consentite: ${allowedExt.join(", ")}`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await ensureDir(destinationDir);
  const targetPath = path.join(destinationDir, filename);
  await fs.writeFile(targetPath, buffer);
  return { filename, buffer, targetPath };
}

async function ensureBucket(name: string, isPublic = true) {
  if (!supabaseAdmin) return;
  const { data, error } = await supabaseAdmin.storage.getBucket(name);
  if (data || (error && error.message?.includes("not found") === false)) {
    return;
  }
  await supabaseAdmin.storage.createBucket(name, { public: isPublic }).catch(() => undefined);
}

async function uploadToStorage(params: {
  bucket: string;
  filePath: string;
  buffer: Buffer;
  contentType?: string;
}) {
  if (!supabaseAdmin) throw new Error("Supabase admin non configurato");
  const { bucket, filePath, buffer, contentType } = params;
  await ensureBucket(bucket);
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, buffer, { upsert: true, contentType });
  if (error) {
    throw error;
  }
}

async function uploadBookMdx(formData: FormData) {
  "use server";
  const file = formData.get("file") as File | null;
  const { filename, buffer } = await saveUpload({
    file,
    allowedExt: [".mdx"],
    destinationDir: path.join(process.cwd(), "content", "books"),
  });

  try {
    const parsed = matter(buffer.toString("utf8"));
    const fm = parsed.data as Record<string, string>;
    if (supabaseAdmin) {
      await supabaseAdmin
        .from("books")
        .upsert({
          slug: fm.slug,
          title: fm.title,
          author: fm.author,
          description: fm.metaDescription || fm.excerpt,
          amazon_link: fm.amazon_link || null,
          key_frameworks: fm.tags ? (Array.isArray(fm.tags) ? fm.tags : [fm.tags]) : null,
        })
        .throwOnError();
    }
  } catch (err) {
    console.error("Errore parsing/insert MDX:", err);
  }

  try {
    await uploadToStorage({
      bucket: STORAGE_BUCKETS.mdx,
      filePath: `books/${filename}`,
      buffer,
      contentType: "text/markdown",
    });
  } catch (err) {
    console.error("Upload MDX storage error:", err);
    redirect("/admin?upload_error=mdx");
  }

  revalidatePath("/percorsi");
  redirect("/admin?uploaded=mdx");
}

async function uploadRagJson(formData: FormData) {
  "use server";
  const file = formData.get("file") as File | null;
  const { filename, buffer } = await saveUpload({
    file,
    allowedExt: [".json"],
    destinationDir: path.join(process.cwd(), "public", "rag-json"),
  });
  try {
    await uploadToStorage({
      bucket: STORAGE_BUCKETS.rag,
      filePath: `rag/${filename}`,
      buffer,
      contentType: "application/json",
    });
  } catch (err) {
    console.error("Upload RAG storage error:", err);
    redirect("/admin?upload_error=rag");
  }
  redirect("/admin?uploaded=rag");
}

async function uploadCover(formData: FormData) {
  "use server";
  const file = formData.get("file") as File | null;
  const { filename, buffer } = await saveUpload({
    file,
    allowedExt: [".png", ".jpg", ".jpeg"],
    destinationDir: path.join(process.cwd(), "public", "covers"),
  });
  try {
    await uploadToStorage({
      bucket: STORAGE_BUCKETS.covers,
      filePath: `covers/${filename}`,
      buffer,
      contentType: "image/png",
    });
  } catch (err) {
    console.error("Upload cover storage error:", err);
    redirect("/admin?upload_error=covers");
  }
  redirect("/admin?uploaded=cover");
}

async function uploadAudio(formData: FormData) {
  "use server";
  const file = formData.get("file") as File | null;
  const { filename, buffer } = await saveUpload({
    file,
    allowedExt: [".mp3", ".wav", ".m4a"],
    destinationDir: path.join(process.cwd(), "public", "audio"),
  });
  try {
    await uploadToStorage({
      bucket: STORAGE_BUCKETS.audio,
      filePath: `audio/${filename}`,
      buffer,
      contentType: "audio/mpeg",
    });
  } catch (err) {
    console.error("Upload audio storage error:", err);
    redirect("/admin?upload_error=audio");
  }
  redirect("/admin?uploaded=audio");
}

async function uploadMap(formData: FormData) {
  "use server";
  const file = formData.get("file") as File | null;
  const { filename, buffer } = await saveUpload({
    file,
    allowedExt: [".png", ".jpg", ".jpeg", ".pdf"],
    destinationDir: path.join(process.cwd(), "public", "maps"),
  });
  try {
    await uploadToStorage({
      bucket: STORAGE_BUCKETS.maps,
      filePath: `maps/${filename}`,
      buffer,
      contentType: "application/octet-stream",
    });
  } catch (err) {
    console.error("Upload map storage error:", err);
    redirect("/admin?upload_error=maps");
  }
  redirect("/admin?uploaded=maps");
}

async function uploadQuiz(formData: FormData) {
  "use server";
  const file = formData.get("file") as File | null;
  const { filename, buffer } = await saveUpload({
    file,
    allowedExt: [".json", ".csv", ".txt"],
    destinationDir: path.join(process.cwd(), "public", "quiz"),
  });
  try {
    await uploadToStorage({
      bucket: STORAGE_BUCKETS.quiz,
      filePath: `quiz/${filename}`,
      buffer,
      contentType: "application/json",
    });
  } catch (err) {
    console.error("Upload quiz storage error:", err);
    redirect("/admin?upload_error=quiz");
  }
  redirect("/admin?uploaded=quiz");
}

async function authenticateAdmin(formData: FormData) {
  "use server";
  const token = (formData.get("token") as string | null)?.trim() ?? "";
  const adminSecret = process.env.ADMIN_PASSWORD;
  if (!adminSecret) {
    throw new Error("ADMIN_PASSWORD non configurata nell'ambiente");
  }
  if (token !== adminSecret) {
    redirect("/admin?error=1");
  }
  (await cookies()).set(ADMIN_COOKIE, adminSecret, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  redirect("/admin");
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const adminSecret = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(ADMIN_COOKIE)?.value;
  const hasAccess = !!adminSecret && currentToken === adminSecret;
  const showError = searchParams?.error === "1";
  const uploaded = (searchParams?.uploaded as string | undefined) ?? "";
  const uploadError = (searchParams?.upload_error as string | undefined) ?? "";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto mb-10 text-center space-y-3">
          <Badge className="bg-secondary text-primary">Admin Only</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">PV Upload Dashboard</h1>
          <p className="text-muted-foreground">
            Carica i file richiesti (MDX, JSON, copertine). I file vengono salvati nelle cartelle previste
            dal README e saranno disponibili per la pipeline automatica.
          </p>
          {uploaded && (
            <p className="text-green-600 text-sm">Upload completato: {uploaded}</p>
          )}
          {uploadError && (
            <p className="text-red-600 text-sm">Errore upload: {uploadError}. Verifica Supabase env/permessi.</p>
          )}
        </div>

        {!hasAccess ? (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Accesso riservato</CardTitle>
                <CardDescription>Inserisci la password amministratore per continuare.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showError && (
                  <p className="text-sm text-red-600">Password errata. Riprova.</p>
                )}
                <form action={authenticateAdmin} className="space-y-3">
                  <Input type="password" name="token" placeholder="Password admin" required />
                  <Button type="submit" className="w-full">
                    Entra
                  </Button>
                </form>
                {!adminSecret && (
                  <p className="text-xs text-red-600">
                    Variabile d'ambiente ADMIN_PASSWORD mancante. Impostala per abilitare l'accesso.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Riassunti Libri (.mdx)</CardTitle>
                <CardDescription>Salvati in /content/books e upsert su Supabase.books</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={uploadBookMdx} className="space-y-3">
                  <Input type="file" name="file" accept=".mdx" required />
                  <Button type="submit" className="w-full">
                    Carica MDX
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RAG JSON</CardTitle>
                <CardDescription>Salvati in /public/rag-json</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={uploadRagJson} className="space-y-3">
                  <Input type="file" name="file" accept=".json" required />
                  <Button type="submit" className="w-full">
                    Carica JSON
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Copertine Libri (.png/.jpg)</CardTitle>
                <CardDescription>Salvate in /public/covers</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={uploadCover} className="space-y-3">
                  <Input type="file" name="file" accept=".png,.jpg,.jpeg" required />
                  <Button type="submit" className="w-full">
                    Carica Copertina
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audio (.mp3/.wav)</CardTitle>
                <CardDescription>Salvati in /public/audio</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={uploadAudio} className="space-y-3">
                  <Input type="file" name="file" accept=".mp3,.wav,.m4a" required />
                  <Button type="submit" className="w-full">
                    Carica Audio
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mappe (.png/.jpg/.pdf)</CardTitle>
                <CardDescription>Salvate in /public/maps</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={uploadMap} className="space-y-3">
                  <Input type="file" name="file" accept=".png,.jpg,.jpeg,.pdf" required />
                  <Button type="submit" className="w-full">
                    Carica Mappa
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quiz/Template (.json/.csv/.txt)</CardTitle>
                <CardDescription>Salvati in /public/quiz</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={uploadQuiz} className="space-y-3">
                  <Input type="file" name="file" accept=".json,.csv,.txt" required />
                  <Button type="submit" className="w-full">
                    Carica Quiz/Template
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
