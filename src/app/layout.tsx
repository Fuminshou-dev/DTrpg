import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import localFont from "next/font/local";

const myFont = localFont({
  src: "../../public/fonts/font.ttf",
});

export const metadata: Metadata = {
  title: "DP RPG",
  description: "DP RPG GAME",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${myFont.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
