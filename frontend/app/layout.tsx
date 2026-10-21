import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CP Life | Cercas de proteção para piscinas",
  description:
    "Cercas de proteção para piscinas sob medida. Simule seu projeto, escolha formato, material e piso e receba um orçamento com a CP Life.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-br"
      
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/imgs/logo.svg" type="image/png" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
