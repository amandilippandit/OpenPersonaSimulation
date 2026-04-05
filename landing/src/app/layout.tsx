import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenPersona — Test marketing content against synthetic audiences",
  description:
    "Build synthetic consumer panels. Test ads, brand messaging, and product launches before you spend on media. Get structured reactions from realistic personas in minutes.",
  icons: { icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🧪%3C/text%3E%3C/svg%3E" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink-950 text-ink-300 antialiased">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
