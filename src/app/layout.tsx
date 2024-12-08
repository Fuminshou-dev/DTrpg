import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import localFont from "next/font/local";
import { ModeToggle } from "./theme-toggle";

const myFont = localFont({
  src: "../public/fonts/font.ttf",
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
        <Providers>
          {children}
          <div className="fixed bottom-6 left-6 h-10">
            <ModeToggle />
          </div>
        </Providers>
      </body>
    </html>
  );
}
