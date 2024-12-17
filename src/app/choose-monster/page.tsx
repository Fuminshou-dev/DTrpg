"use client";

import PageControls from "@/components/Controls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import {
  calculateFinalDmg,
  calculateMonsterDmg,
  getRandomAtkMultiplier,
  getRandomTask,
} from "../utils/utilFunctions";

export default function FightPage() {
  const router = useRouter();
  const updatePlayerFightStatus = useMutation(
    api.players.updatePlayerFightStatus
  );
  const [selectedMonster, setSelectedMonster] = useState<string | null>(null);
  const [monsterToConfirm, setMonsterToConfirm] = useState<number | null>(null); // Track which monster is being confirmed  const router = useRouter();
  const monstersVisibleToPlayer = useQuery(
    api.monsters.getAllMonstersVisibleToPlayer
  );
  const allMonsters = useQuery(api.monsters.getAllMonsters);
  const player = useQuery(api.players.getPlayer);
  const playerStats = useQuery(api.player_stats.getLevelStats, {
    level: player?.level ?? 1,
  });

  const atkMultiplier = getRandomAtkMultiplier();

  if (
    !monstersVisibleToPlayer ||
    (!monstersVisibleToPlayer.success &&
      monstersVisibleToPlayer.error === "No userId") ||
    !player ||
    !allMonsters
  ) {
    return (
      <div className="flex flex-col h-screen justify-center items-center">
        <LoadingSpinner className="size-72"></LoadingSpinner>
      </div>
    );
  }

  const handleChooseMonster = async (monster: Doc<"monsters">) => {
    const finalDmg = calculateFinalDmg({
      atkMultiplier: atkMultiplier,
      playerAtk: playerStats?.atk ?? 0,
      hasSpecialPotionEffect: player.hasSpecialPotionEffect,
    });
    const monsterAtk = calculateMonsterDmg({ monster });

    await updatePlayerFightStatus({
      fightStatus: {
        status: "fighting",
        atkMultiplier: atkMultiplier,
        currentTask: getRandomTask({ monster }),
        finalDmg: finalDmg,
        monsterAtk,
        monsterHp: monster.hp,
        monsterId: monster.showId,
        playerAtk: playerStats?.atk ?? 0,
        playerHp: playerStats?.hp ?? 0,
      },
    });
    setMonsterToConfirm(null);
    router.refresh();
  };
  const visibleMonsterIds = new Set(
    monstersVisibleToPlayer.monsters?.map((m) => m.showId)
  );

  return (
    <div className="container mx-auto min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center p-5 w-full">
        <PageControls doShowStatistics={false} showControlButton />
        <div className="flex flex-col gap-8 justify-center items-center w-full mt-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl text-center mb-4 sm:mb-6 md:mb-8">
            Currently available monsters to fight:
          </h1>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-7xl">
            {allMonsters.map((monster) => (
              <div
                key={monster.monster_type}
                className={`flex flex-col items-center border shadow-inner shadow-rose-500 p-3 sm:p-4 md:p-6 gap-2 sm:gap-3 md:gap-4 rounded-lg w-full mx-auto ${
                  monster.monster_type === "Evil Deity"
                    ? "bg-gradient-to-r from-rose-700 to-black animate-boss border font-bold shadow-rose-700"
                    : "border"
                } relative`}
              >
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    !visibleMonsterIds.has(monster.showId)
                      ? "backdrop-blur-sm bg-black/30 z-10"
                      : "hidden"
                  }`}
                >
                  <p className="text-white text-base sm:text-lg md:text-xl font-bold text-center px-2 sm:px-4">
                    You can't fight this monster yet.
                  </p>
                </div>
                <div
                  className={`w-full h-full flex flex-col justify-center items-center ${
                    !visibleMonsterIds.has(monster.showId) ? "opacity-50" : ""
                  }`}
                >
                  <h2
                    className={`text-lg sm:text-xl md:text-2xl lg:text-3xl flex flex-col ${
                      monster.monster_type === "Evil Deity"
                        ? "bg-gradient-to-r bg-clip-text text-transparent from-red-500 via-orange-500 to-red-500 animate-text"
                        : ""
                    }`}
                  >
                    {monster.monster_type}
                    <span className="border-b-2 w-3/4 self-center border-red-500 mt-1"></span>
                  </h2>
                  <div className="flex flex-col gap-2 w-full">
                    <p className="text-sm md:text-base">
                      Monster HP:{" "}
                      <span className="text-red-500">{monster.hp}</span>
                    </p>
                    {monster.monster_type === "Evil Deity" ? (
                      <p className="text-sm md:text-base font-bold bg-gradient-to-r bg-clip-text text-transparent from-red-500 via-orange-500 to-red-500 animate-text">
                        BOSS
                      </p>
                    ) : (
                      <>
                        <p className="text-sm md:text-base">
                          Earned XP:{" "}
                          <span className="text-orange-400">{monster.exp}</span>
                        </p>
                        <p className="text-sm md:text-base">
                          Earned GOLD:{" "}
                          <span className="text-yellow-400">
                            {monster.gold}
                          </span>
                        </p>
                      </>
                    )}
                    <p className="text-sm md:text-base">
                      Monster damage:
                      <span className="text-red-500"> {monster.min_dmg}</span>-
                      <span className="text-red-500">{monster.max_dmg}</span>
                    </p>
                    <Popover
                      open={selectedMonster === monster.monster_type}
                      onOpenChange={(open) => {
                        setSelectedMonster(open ? monster.monster_type : null);
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          {selectedMonster === monster.monster_type
                            ? "Hide Tasks"
                            : "Show Tasks"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full max-w-xs md:max-w-md">
                        <div className="space-y-2">
                          {monster.tasks.map((task, index) => (
                            <div
                              key={index}
                              className="p-2 bg-secondary rounded-md text-xs md:text-sm flex flex-col gap-2"
                            >
                              <p>{task.task_description}</p>
                              {task.break_time !== 0 && (
                                <p className="text-green-500 italic">
                                  Max allowed break time:{" "}
                                  <span className="text-red-500">
                                    {task.break_time}
                                  </span>{" "}
                                  seconds
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <AlertDialog
                      open={monsterToConfirm === monster.showId}
                      onOpenChange={(open) => {
                        setMonsterToConfirm(open ? monster.showId : null);
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant={"destructive"}
                          onClick={() => setMonsterToConfirm(monster.showId)}
                          className="w-full bg-gradient-to-br from-red-700/50 to-black border font-bold"
                        >
                          Fight
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-11/12">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. You will be locked to
                            this fight until either you defeat the monster or it
                            defeats you.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setMonsterToConfirm(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleChooseMonster(monster);
                            }}
                          >
                            Start Fight
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
