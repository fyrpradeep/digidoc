import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";

// ── Fonts ──────────────────────────────────────────────────────────
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["600", "700", "800"],
});

// ── Metadata ───────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "DigiDoc — Doctor Anywhere Anytime",
    template: "%s | DigiDoc",
  },
  description:
    "India's most complete telemedicine platform. Consult verified doctors, get prescriptions, and order medicines — all in one place.",
  keywords: [
    "telemedicine", "online doctor", "digital health",
    "consult doctor online", "medicine delivery", "digidoc",
    "doctor anywhere anytime",
  ],
  authors:  [{ name: "DigiDoc" }],
  creator:  "DigiDoc",
  publisher: "DigiDoc",
  manifest: "/manifest.json",
  icons: {
    icon:  "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type:        "website",
    title:       "DigiDoc — Doctor Anywhere Anytime",
    description: "Consult doctors online, get prescriptions & medicine delivery.",
    images:      [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "DigiDoc — Doctor Anywhere Anytime",
    description: "Consult doctors online, get prescriptions & medicine delivery.",
    images:      ["/og-image.png"],
  },
};

// ── Viewport (Mobile first) ────────────────────────────────────────
export const viewport: Viewport = {
  width:              "device-width",
  initialScale:       1,
  maximumScale:       1,
  userScalable:       false,
  themeColor:         "#0B6FCC",
  viewportFit:        "cover",
};

// ── Root Layout ────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="antialiased bg-brand min-h-screen">
        {/* Mobile-first max width wrapper */}
        <div className="relative mx-auto" style={{ maxWidth: 480 }}>
          {children}
        </div>
      </body>
    </html>
  );
}