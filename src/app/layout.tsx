import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const myFont = localFont({
  // src: "../public/fonts/font.ttf",
  src: "../public/fonts/Roboto-Regular.ttf",
});

export const metadata: Metadata = {
  title: "DT RPG",
  description: "DT RPG GAME",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${myFont.className}  antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
