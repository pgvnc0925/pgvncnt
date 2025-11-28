import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {

  return (
    <header className="border-b border-secondary/20 bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">Pagine <span className="text-secondary">Vincenti</span></span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/percorsi"
            className="text-base font-medium text-slate-300 hover:text-secondary transition-colors"
          >
            Percorsi
          </Link>
          <Link
            href="/app"
            className="text-base font-medium text-slate-300 hover:text-secondary transition-colors"
          >
            App
          </Link>
          <Link
            href="/blog"
            className="text-base font-medium text-slate-300 hover:text-secondary transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/tools"
            className="text-base font-medium text-slate-300 hover:text-secondary transition-colors"
          >
            Tools
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="border-secondary/50 text-secondary hover:bg-secondary hover:text-primary" asChild>
            <Link href="/chi-sono">Chi Sono</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
