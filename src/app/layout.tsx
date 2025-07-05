import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import Header from "@/components/layout/Header";
import { getCurrentSession } from "@/actions/auth";
import HeaderCategorySelector from "@/components/layout/HeaderCategorySelector";

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
  const { user } = await getCurrentSession();
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header user={user} categorySelector={<HeaderCategorySelector />} />
        {children}
      </body>
    </html>
  );
}
