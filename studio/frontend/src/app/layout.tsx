import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenPersona Studio",
  description: "3D graph-based simulation visualization for OpenPersona",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 antialiased h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
