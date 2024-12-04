"use client";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ATK_MULTIPLIER } from "@/app/utils/constants";

export default function MonsterFightPage() {
  const params = useParams();
  const monsterId = params.monster as string;
  const monsterIdNumber = parseInt(monsterId);
  const randomTask = useQuery(api.monsters.getRandomMonsterTask, {
    monsterId: monsterIdNumber,
  });
  const monster = useQuery(api.monsters.getMonster, {
    monsterId: monsterIdNumber,
  });
  const player = useQuery(api.players.getPlayer);
  const playerLevel = player?.level;
  const levelStats = useQuery(
    api.player_stats.getLevelStats,
    player
      ? {
          level: player.level,
        }
      : "skip"
  );

  // Store both current and max HP
  const [maxMonsterHP, setMaxMonsterHP] = useState<number | null>(null);
  const [currentMonsterHP, setCurrentMonsterHP] = useState<number | null>(null);
  const [enemyProgressValue, seteEnemyProgressValue] = useState(100);
  const [playerProgressValue, setePlayerProgressValue] = useState(100);
  const [currentPlayerHp, setCurrentPlayerHp] = useState<number | null>(null);
  const [maxPlayerHP, setMaxPlayerHP] = useState<number | null>(null);
  const [playerDmg, setPlayerDmg] = useState<number | null>(null);

  const getHealthColor = (percentage: number) => {
    if (percentage > 50) return "bg-green-500";
    if (percentage > 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  useEffect(() => {
    if (monster?.hp) {
      setMaxMonsterHP(monster.hp);
      setCurrentMonsterHP(monster.hp);
    }
  }, [monster?.hp]);

  // Update progress whenever current HP changes
  useEffect(() => {
    if (maxMonsterHP && currentMonsterHP) {
      seteEnemyProgressValue((currentMonsterHP / maxMonsterHP) * 100);
    }
  }, [currentMonsterHP, maxMonsterHP]);

  useEffect(() => {
    if (levelStats?.hp) {
      setMaxPlayerHP(levelStats.hp);
      setCurrentPlayerHp(levelStats.hp);
    }
  }, [levelStats?.hp]);

  useEffect(() => {
    if (currentPlayerHp && maxPlayerHP) {
      setePlayerProgressValue((currentPlayerHp / maxPlayerHP) * 100);
    }
  }, [currentPlayerHp, maxPlayerHP]);
  // Initialize HP values when monster data is loaded

  const [atkMultiplier, setAtkMultiplier] = useState(
    () => ATK_MULTIPLIER[Math.floor(Math.random() * ATK_MULTIPLIER.length)]
  );

  const calculateNewDamage = () => {
    const newMultiplier =
      ATK_MULTIPLIER[Math.floor(Math.random() * ATK_MULTIPLIER.length)];
    setAtkMultiplier(newMultiplier);
  };

  // Use this function when attacking
  const handleAttack = () => {
    calculateNewDamage();
    // Other attack logic...
  };

  useEffect(() => {
    if (levelStats?.atk) {
      const calculatedDmg = levelStats.atk * atkMultiplier;
      setPlayerDmg(calculatedDmg);
    }
  }, [levelStats?.atk, atkMultiplier]); // Depend on both values

  if (!monster || !randomTask || !player || !playerLevel) {
    return (
      <div className="flex flex-col h-screen justify-center items-center">
        <LoadingSpinner className="size-72"></LoadingSpinner>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen justify-center items-center container mx-auto gap-24">
      <div>
        <div className="flex flex-row justify-between w-full gap-8">
          <div className="flex-1 flex-col">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-yellow-500 text-5xl">{player.playerName}</h1>
            </div>
            <div>
              <div className="flex flex-row justify-between ">
                <h1>Hp</h1>
              </div>
              <Progress
                value={playerProgressValue}
                indicatorcolor={getHealthColor(playerProgressValue)}
                className="transition-all duration-1000" // Add smooth transition
              ></Progress>
              <div className="flex justify-end">
                <h1>
                  {currentPlayerHp}/{levelStats?.hp}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex-1 flex-col">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-red-500 text-5xl">{monster.monster_type}</h1>
            </div>
            <div>
              <div className="flex flex-row justify-between ">
                <h1>Hp</h1>
              </div>
              <Progress
                value={enemyProgressValue}
                indicatorcolor={getHealthColor(enemyProgressValue)}
                className="transition-all duration-1000" // Add smooth transition
              ></Progress>
              <div className="flex justify-end">
                <h1>
                  {currentMonsterHP}/{monster.hp}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-fit justify-beween gap-12 p-8 justify-stretch items-stretch ">
          <div className="flex flex-col border rounded-lg p-8 justify-stretch items-center gap-8 max-w-full">
            <h1 className="text-red-500 text-3xl">{monster.monster_type}</h1>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">
                HP: <span className="text-red-500">{monster?.hp}</span>
              </h2>
              <div className="text-2xl">
                DMG: {monster?.min_dmg}-{monster?.max_dmg}
              </div>
            </div>
          </div>
          <div className="flex flex-col border rounded-lg p-8 justify-stretch items-center gap-8 max-w-full">
            <h1 className="text-yellow-500 text-3xl">{player.playerName}</h1>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">
                HP: <span className="text-green-500">{levelStats?.hp}</span>
              </h2>
              <div className="text-2xl">
                DMG: <span className="text-green-500">{levelStats?.atk}</span>
              </div>
              <div className="text-2xl">
                ATK MODIFIER:{" "}
                <span className="text-green-500">{atkMultiplier}</span>
              </div>
              <div className="text-2xl">
                Final dmg: <span className="text-green-500">{playerDmg}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex-col justify-center items-center text-3xl border rounded-lg p-8 gap-8">
            <h1>Rewards for defeating:</h1>
            <div>
              <div>
                EXP: <span className="text-orange-500">{monster?.exp}</span>
              </div>
              <div>
                GOLD: <span className="text-yellow-400">{monster?.gold}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full items-center justify-center">
        <div className="p-8 border w-full justify-center items-center flex flex-col gap-4">
          <h1 className="text-3xl">Your task:</h1>
          <h1 className="text-3xl">{randomTask?.task_description}</h1>
          {randomTask?.break_time !== 0 && (
            <p className="text-green-500 italic">
              Max allowed break time:{" "}
              <span className="text-red-500">{randomTask?.break_time}</span>{" "}
              seconds
            </p>
          )}
        </div>
        <div className="flex flex-row justify-between gap-12 items-center m-8">
          <Button
            className="p-6 bg-green-500"
            onClick={() => {
              setCurrentMonsterHP(1);
            }}
          >
            Success
          </Button>
          <Button variant={"destructive"} className="p-6">
            Fail
          </Button>
        </div>
      </div>
      {/*  */}
    </div>
  );
}
