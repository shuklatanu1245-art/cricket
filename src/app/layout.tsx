import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cricket Tournament Platform",
  description: "Register for upcoming cricket tournaments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-navy text-white antialiased selection:bg-neon-green selection:text-navy`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
