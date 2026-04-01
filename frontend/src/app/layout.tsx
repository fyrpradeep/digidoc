import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400","500","600","700","800","900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DigiDoc — Doctor Anywhere, Anytime",
  description: "Consult verified doctors online. Prescriptions & medicines delivered.",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#020D1A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%", background: "#020D1A" }}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={font.className}
        style={{ height: "100%", background: "#020D1A", overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
