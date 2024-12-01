"use client";
import { useQuery } from "convex/react";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import restore1 from "../../../public/restore1.jpg";
import restore2 from "../../../public/restore2.jpg";
import reroll from "../../../public/reroll.jpg";
import special from "../../../public/special.jpg";

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
export default function ConfrimCharacterPage() {
  const characterName = localStorage.getItem("characterName");
  const characterPassword = localStorage.getItem("characterPassword");
  const [showPassword, setShowPassword] = useState(false);

  if (!characterName || !characterPassword) {
    redirect("/create");
  }
  const player = useQuery(api.players.getPlayer, {
    playerName: characterName,
    password: characterPassword,
  });

  if (!player) {
    return <p>Loading...</p>;
  }
  const maskedPassword = "*".repeat(player?.password.length);

  return (
    <div className="flex flex-col gap-8 h-screen justify-center items-center">
      <div className="flex flex-col justify-center items-center border runded-lg p-8 text-2xl">
        <p>Name: {player?.player_name}</p>
        <div className="flex flex-row gap-4">
          <p>Password: {showPassword ? player.password : maskedPassword}</p>
          <Button onClick={() => setShowPassword(!showPassword)}>?</Button>
        </div>
        <p>
          Level: <span className="text-blue-500">{player.level}</span>
        </p>
        <p>
          Gold: <span className="text-yellow-500">{player.gold}</span>
        </p>
        <p>
          EXP: <span className="text-orange-500">{player.current_exp}</span>
        </p>
        <div className="flex flex-col justify-center items-center gap-4">
          <p>Items:</p>
          <div className="grid grid-cols-2 gap-4 w-1/2 justify-center items-center">
            {player.items.map((item) => (
              <div
                key={item.type}
                className="flex flex-col border justify-center items-center rounded-lg p-8 gap-5"
              >
                <Image
                  src={itemImages[item.type]}
                  alt={item.type}
                  width={80}
                  height={40}
                />
                <div className="text-sm">{ItemDescriptions[item.type]}</div>
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
      </div>
      <Button
        onClick={() => {
          redirect("/main");
        }}
      >
        Confirm
      </Button>
    </div>
  );
}
