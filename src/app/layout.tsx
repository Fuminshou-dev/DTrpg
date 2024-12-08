import CustomSignOutButton from "@/components/sign-out-button";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { ModeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

const myFont = localFont({
  // src: "../public/fonts/font.ttf",
  src: "../public/fonts/Roboto-Regular.ttf",
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
      <body className={`${myFont.className}  antialiased`}>
        <Providers>
          {children}
          <div className="fixed top-24 left-6">
            <ModeToggle />
          </div>
          <CustomSignOutButton />
        </Providers>
      </body>
    </html>
  );
}
