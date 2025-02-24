import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { navbarLinks } from "@/config/navbar";
import { MainNav } from "@/components/main-nav";

import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.className} scroll-smooth`}>
      <body className="bg-background min-h-screen antialiased">
        <NextTopLoader showSpinner={false} color="#2563eb" shadow={false} />
        <header>
          <MainNav items={navbarLinks.main} />
        </header>
        <main className="flex-1 py-16">{children}</main>
      </body>
    </html>
  );
}
