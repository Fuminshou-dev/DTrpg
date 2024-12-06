"use client";

import { useSession } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = useSession().session?.user.id;
  const router = useRouter();
  const fightStatus = useQuery(
    api.players.getPlayerFightStatus,
    userId ? { userId } : "skip"
  );

  if (userId && typeof fightStatus === "object" && fightStatus?.monsterId) {
    router.push(`/fight/${fightStatus.monsterId}`);
  }
  if (!userId) {
    return <div>Loading...</div>;
  }

  return <div className="game-layout">{children}</div>;
}
