import "./globals.css";
import { ThemeProvider } from "./providers";

export const metadata = {
  title: "App",
  description: "Generated with boilerplate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}