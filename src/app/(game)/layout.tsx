"use client";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="game-layout">{children}</div>;
}
