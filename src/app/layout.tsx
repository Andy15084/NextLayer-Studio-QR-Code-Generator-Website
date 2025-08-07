import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QR Code Generator - Create Beautiful QR Codes Online",
  description: "Generate custom QR codes for any website with our free online QR code generator. Customize colors, size, and download instantly.",
  keywords: "QR code generator, QR code maker, online QR code, website QR code, custom QR code",
  authors: [{ name: "QR Code Generator" }],
  openGraph: {
    title: "QR Code Generator - Create Beautiful QR Codes Online",
    description: "Generate custom QR codes for any website with our free online QR code generator.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
