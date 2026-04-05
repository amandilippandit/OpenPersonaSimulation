import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenPersona — Test marketing content against synthetic audiences",
  description:
    "Build synthetic consumer panels. Test ads, brand messaging, and product launches before you spend on media. Get structured reactions from realistic personas in minutes.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#fafafa] text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
