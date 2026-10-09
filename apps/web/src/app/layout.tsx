import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Trips and vehicle rentals from Bengaluru`, template: `%s | ${site.name}` },
  description: "Weekend trips and holidays across Karnataka, Kerala and Tamil Nadu, with our own vehicles and drivers, from Bengaluru.",
  openGraph: { type: "website", siteName: site.name, locale: "en_IN" },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
