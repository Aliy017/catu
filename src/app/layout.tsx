import type { Metadata, Viewport } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "Pi MEDIA — Ijtimoiy Tarmoq Mutaxassisi",
  description:
    "Men trendlarga ergashmayman. Men ularni yarataman. Eng yuqori darajadagi SMM mutaxassisi — aggressiv o'sish va premium brend identifikatsiyasi.",
  keywords: ["SMM", "ijtimoiy tarmoq", "marketing", "brend", "Pi MEDIA", "reklama"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="noise-overlay">
      <body className={`${oswald.variable} ${inter.variable} antialiased`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
