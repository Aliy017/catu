import type { Metadata, Viewport } from "next";
import { Oswald, Inter, JetBrains_Mono, Playfair_Display, Quicksand } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { LowPowerProvider } from "@/components/LowPowerContext";
import AnalyticsScripts from "@/components/AnalyticsScripts";

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

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-accent",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const quicksand = Quicksand({
  variable: "--font-rounded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="uz" className="noise-overlay" suppressHydrationWarning>
      <body className={`${oswald.variable} ${inter.variable} ${jetbrains.variable} ${playfair.variable} ${quicksand.variable} antialiased`} suppressHydrationWarning>
        <AnalyticsScripts />
        <LowPowerProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </LowPowerProvider>
      </body>
    </html>
  );
}
