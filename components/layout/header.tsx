import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {

  return (
    <header className="glass-surface-strong sticky top-0 z-50 border border-white/60 bg-white/70 shadow-lg backdrop-saturate-150">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/pagine-vincenti-logo-orizzontale.png"
            alt="Pagine Vincenti"
            width={180}
            height={45}
            priority
            className="h-10 w-auto"
          />
          <span className="sr-only">Pagine Vincenti</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/percorsi"
            className="text-base font-semibold text-primary hover:text-secondary transition-colors"
          >
            Percorsi
          </Link>
          <Link
            href="/risorse"
            className="text-base font-semibold text-primary hover:text-secondary transition-colors"
          >
            Risorse
          </Link>
          <Link
            href="/app"
            className="text-base font-semibold text-primary hover:text-secondary transition-colors"
          >
            App
          </Link>
          <Link
            href="/approfondimenti"
            className="text-base font-semibold text-primary hover:text-secondary transition-colors"
          >
            Approfondimenti
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="secondary" size="sm" className="shadow-none hover:shadow-md" asChild>
            <Link href="/chi-sono">Chi Sono</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
