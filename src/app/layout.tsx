import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { SanityLive } from "@/sanity/lib/live";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-commerce",
  description: "An e-commerce application built with Next.js and Sanity.io",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <SanityLive />
      </body>
    </html>
  );
}
