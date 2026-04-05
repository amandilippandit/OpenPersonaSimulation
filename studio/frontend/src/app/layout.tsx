import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenPersona Studio",
  description: "Persona simulation workspace",
  icons: { icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='%230f172a'%3E%3Cpath d='M 65 5 C 65 45, 50 75, 5 100 C 50 125, 65 155, 65 195 C 65 155, 80 125, 100 100 C 80 75, 65 45, 65 5 Z M 135 5 C 135 45, 120 75, 100 100 C 120 125, 135 155, 135 195 C 135 155, 150 125, 195 100 C 150 75, 135 45, 135 5 Z'/%3E%3C/svg%3E" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#fafafa] text-slate-900 antialiased h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
