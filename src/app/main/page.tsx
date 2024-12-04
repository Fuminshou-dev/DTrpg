"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Authenticated, useQuery } from "convex/react";
import restore1 from "../../../public/restore1.jpg";
import restore2 from "../../../public/restore2.jpg";
import reroll from "../../../public/reroll.jpg";
import special from "../../../public/special.jpg";
import Image from "next/image";
import { SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const options = [
  {
    name: "Fight",
    redirect: "/",
  },
  {
    name: "Brothel",
    redirect: "/brothel",
  },
  {
    name: "Shop",
    redirect: "/shop",
  },
];

const itemImages: { [key: string]: any } = {
  restore1: restore1,
  restore2: restore2,
  special: special,
  reroll: reroll,
};
const ItemDescriptions: { [key: string]: string } = {
  restore1: "Restores half of your hp",
  restore2: "restores full hp",
  special:
    "Doubles the experience gained in the next battle and doubles the damage dealt to enemies of a lower level than you",
  reroll: "Allows you to rerrol current roll",
};

export default function Game() {
  const [progressValue, setProgressValue] = useState(0);
  const [showItems, setShowItems] = useState(false);
  const router = useRouter();
  const player = useQuery(api.players.getPlayer);
  const levelStats = useQuery(
    api.player_stats.getLevelStats,
    player ? { level: player.level } : "skip"
  );
  const nextLevelStats = useQuery(
    api.player_stats.getLevelStats,
    player ? { level: player.level + 1 } : "skip"
  );

  if (!player || !levelStats || !nextLevelStats) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner className="size-72"></LoadingSpinner>
      </div>
    );
  }

  return (
    <div className="container mx-auto h-screen flex flex-row justify-evenly items-center">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-4 justify-center items-center border rounded-lg p-4">
          <h2 className="text-3xl">{player.playerName}</h2>
          <Skeleton className="w-16 h-16 rounded-lg"></Skeleton>
          <p className="text-2xl">
            Lvl: <span className="font-bold text-blue-500">{player.level}</span>
          </p>
          <p className="text-2xl">
            Hp:{" "}
            <span className="font-bold text-green-500">{levelStats.hp}</span>
          </p>
          <p className="text-2xl">
            Attack:{" "}
            <span className="font-bold text-red-500">{levelStats.atk}</span>
          </p>
          <p className="text-2xl">
            Gold:{" "}
            <span className="font-bold text-yellow-500">{player.gold}</span>
          </p>
          <p className="text-2xl">
            Exp for next level:
            <span className="font-bold text-orange-600">
              {" "}
              {nextLevelStats.required_exp - player.current_exp}
            </span>
          </p>
          <Progress value={progressValue} className="" />
          <Button
            asChild
            onClick={() => {
              setShowItems(!showItems);
            }}
          >
            <p>Items</p>
          </Button>
          <Authenticated>
            <div className="border p-4">
              <SignOutButton redirectUrl="/login" />
            </div>
          </Authenticated>
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
          <div
            className={
              showItems
                ? "grid grid-cols-2 gap-4 justify-center items-center"
                : "hidden"
            }
          >
            {player.items.map((item) => (
              <div
                key={item.type}
                className="flex flex-col border justify-center items-center rounded-lg p-8 gap-4"
              >
                <Image
                  src={itemImages[item.type]}
                  alt={item.type}
                  width={80}
                  height={40}
                />
                <div className="text-sm h-8">{ItemDescriptions[item.type]}</div>
                <div className="text-2xl">
                  You have:{" "}
                  <span
                    className={
                      item.amount === 0 ? "text-red-500" : "text-green-500"
                    }
                  >
                    {item.amount}
                  </span>{" "}
                  of this item
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {options.map((el) => (
            <Button
              key={el.name}
              className="border rounded-lg p-16 cursor-pointer text-3xl"
              variant={"ghost"}
              asChild
              onClick={() => {
                router.push(el.redirect);
              }}
            >
              <div>{el.name}</div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
