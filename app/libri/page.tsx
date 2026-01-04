import { getAllBooks } from "@/lib/books"
import { LibriClientPage } from "./client-page"

export const metadata = {
  title: "Libri | Pagine Vincenti",
  description:
    "I libri su marketing, comportamento del consumatore e organizzazione analizzati per aiutarti a ragionare meglio e applicare con criterio nella realtà italiana.",
}

export default function LibriPage() {
  const allBooks = getAllBooks()

  return <LibriClientPage initialBooks={allBooks} />
}
