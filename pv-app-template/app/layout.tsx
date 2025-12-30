import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pagine Vincenti - App Engine',
  description: 'Platform for strategic decision-making',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="bg-pv-light">
        {children}
      </body>
    </html>
  );
}
