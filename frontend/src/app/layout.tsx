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
  description: "Consult verified doctors online. Get prescriptions & medicines delivered.",
  manifest: "/manifest.json",
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
    <html lang="en">
      <body className={font.className} style={{ background: "#020D1A" }}>
        {children}
      </body>
    </html>
  );
}
