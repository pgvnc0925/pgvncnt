import "./globals.css";
import { ThemeProvider } from "./providers";

export const metadata = {
  title: "Pagine Vincenti - Business Tools Interattivi",
  description: "Strumenti pratici basati sui migliori framework di management e marketing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}