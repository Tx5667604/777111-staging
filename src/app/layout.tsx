import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Олександр Панібратенко — Ремонт телефонів у Вознесенську",
  description: "Професійний ремонт телефонів у Вознесенську, Миколаївська область. Заміна екрана, акумулятора, розблокування, прошивка. Швидко, якісно, з гарантією.",
  keywords: ["ремонт телефонів Вознесенськ", "заміна екрана", "заміна акумулятора", "розблокування iCloud", "ремонт смартфонів", "Миколаївська область"],
  authors: [{ name: "Олександр Панібратенко" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Олександр Панібратенко — Ремонт телефонів у Вознесенську",
    description: "Професійний ремонт телефонів. Заміна екрана, акумулятора, розблокування та інші послуги.",
    type: "website",
    locale: "uk_UA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
