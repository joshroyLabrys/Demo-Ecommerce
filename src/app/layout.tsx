import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MERIDIAN — Premium Lifestyle Store",
  description: "Discover curated collections of premium electronics, fashion, home goods, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen font-sans antialiased`}>
        <Providers>
          <SiteHeader />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <SiteFooter />
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
