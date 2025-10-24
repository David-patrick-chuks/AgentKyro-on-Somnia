import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import ContextProvider from "@/context/index";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IntentSwap - Swap Crypto with Just Words",
  description: "Powered by Somnia Testnet and AI Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Resource hints for Privy */}
        <link
          rel="preconnect"
          href="https://auth.privy.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://auth.privy.io" />
      </head>
      <body className={sora.className}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
