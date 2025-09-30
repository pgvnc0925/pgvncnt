import Image from "next/image";
import Link from "next/link";
import { LOGOS } from "@/data/logos";

export function LogosGrid() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Logos</h1>

        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {LOGOS.map((item) => {
            const card = (
              <div className="group relative flex items-center justify-center rounded-xl border bg-card p-6 transition hover:shadow-sm">
                {/* Se usi URL esterni: config next.config.js -> images.remotePatterns */}
                <Image
                  src={item.src}
                  alt={item.alt ?? item.name}
                  width={160}
                  height={80}
                  className="h-10 w-auto opacity-90 transition group-hover:opacity-100"
                />
              </div>
            );

            return (
              <li key={item.id}>
                {item.href ? (
                  <Link href={item.href} target="_blank" rel="noreferrer">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-sm text-muted-foreground">
          Note: verifica sempre le linee guida d’uso dei marchi prima della pubblicazione.
        </p>
      </div>
    </section>
  );
}