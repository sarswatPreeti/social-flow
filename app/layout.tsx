import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { FlowProvider } from "@/components/providers/flow-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flow Social DApp",
  description: "A decentralized social media app built on Flow blockchain",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark antialiased">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <FlowProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </FlowProvider>
        <Analytics />
      </body>
    </html>
  );
}
