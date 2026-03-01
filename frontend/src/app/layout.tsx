import type { Metadata } from "next";
import { Inter, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSerifDevanagari = Noto_Serif_Devanagari({ 
  subsets: ["devanagari"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-hindi"
});

export const metadata: Metadata = {
  title: "Jaigurudev Matrimonial",
  description: "A spiritual matrimonial platform for the Jaigurudev community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoSerifDevanagari.variable} font-sans`}>
        <Toaster position="top-center" />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
