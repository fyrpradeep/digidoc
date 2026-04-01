import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "DigiDoc — Doctor Anywhere, Anytime",
  description: "Consult verified doctors online. Get prescriptions & medicines delivered to your door.",
};
export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false, themeColor: "#020D1A",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      </head>
      <body style={{margin:0,padding:0,background:"#020D1A",height:"100%",overflow:"hidden",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        {children}
      </body>
    </html>
  );
}
