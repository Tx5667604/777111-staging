import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const siteUrl = "https://777111.com.ua";

export const metadata: Metadata = {
  title: {
    default: "Ремонт телефонів у Вознесенську | Олександр Панібратенко",
    template: "%s | Ремонт телефонів Вознесенськ",
  },
  description:
    "Професійний ремонт телефонів у Вознесенську, Миколаївська область. Заміна екрана, акумулятора, розблокування iCloud, прошивка. Безкоштовна діагностика. Гарантія до 12 місяців.",
  keywords: [
    "ремонт телефонів Вознесенськ",
    "заміна екрана Вознесенськ",
    "заміна акумулятора Вознесенськ",
    "розблокування iCloud",
    "ремонт смартфонів",
    "Миколаївська область ремонт телефонів",
    "заміна скла на телефоні",
    "прошивка телефону",
    "майстер по ремонту телефонів",
    "ремонт iPhone Вознесенськ",
    "ремонт телефонів ціни",
  ],
  authors: [{ name: "Олександр Панібратенко" }],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  verification: {
    google: "91O_NUTFRgCA4EG2rkHQcx26fxukYcsfVdfbRP33IXA",
  },
  openGraph: {
    title: "Ремонт телефонів у Вознесенську — швидко, якісно",
    description:
      "Професійний ремонт телефонів. Заміна екрана, акумулятора, розблокування iCloud. Безкоштовна діагностика.",
    url: siteUrl,
    siteName: "Олександр Панібратенко — Ремонт телефонів",
    type: "website",
    locale: "uk_UA",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "Ремонт телефонів у Вознесенську",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Ремонт телефонів у Вознесенську",
    description:
      "Професійний ремонт телефонів з гарантією. Заміна екрана, акумулятора, розблокування.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Олександр Панібратенко — Ремонт телефонів",
              description:
                "Професійний ремонт телефонів у Вознесенську, Миколаївська область",
              url: siteUrl,
              telephone: "+380960777111",
              email: "",
              image: `${siteUrl}/logo.svg`,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Центральний ринок, сектор Б, контейнер 96",
                addressLocality: "Вознесенськ",
                addressRegion: "Миколаївська область",
                addressCountry: "UA",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 47.5627,
                longitude: 31.3382,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ],
                  opens: "09:00",
                  closes: "16:00",
                },
              ],
              priceRange: "$$",
              areaServed: ["Вознесенськ", "Миколаївська область"],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Послуги ремонту телефонів",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Заміна екрана телефону",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Заміна акумулятора",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Розблокування iCloud",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Прошивка телефону",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster richColors position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
