"use client";

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
  const monsters = useQuery(api.monsters.getAllMonstersVisibleToPlayer);
  const player = useQuery(api.players.getPlayer);
  const playerStats = useQuery(api.player_stats.getLevelStats, {
    level: player?.level ?? 1,
  });

  const atkMultiplier = getRandomAtkMultiplier();

  if (
    !monsters ||
    (!monsters.success && monsters.error === "No userId") ||
    !player
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

  return (
    <div className="flex flex-col h-screen items-center container mx-auto">
      <Button className="p-4 text-sm m-8" onClick={() => router.push("/main")}>
        Go back
      </Button>
      <div className="flex flex-col gap-8 justify-center items-center">
        <h1 className="text-3xl">Currently available monsters to fight:</h1>
        <div className="grid grid-cols-3 justify-center items-stretch gap-8 m-8 w-full">
          {monsters.monsters?.map((monster) => (
            <div
              key={monster.monster_type}
              className="flex flex-col items-center border p-8 gap-4 rounded-lg w-full"
            >
              <h1 className="text-3xl">{monster.monster_type}</h1>
              <div className="flex flex-col gap-2 w-full">
                <p>
                  Monster HP: <span className="text-red-500">{monster.hp}</span>
                </p>
                <p>
                  Earned XP:{" "}
                  <span className="text-orange-400">{monster.exp}</span>
                </p>
                <p>
                  Earned GOLD:{" "}
                  <span className="text-yellow-400">{monster.gold}</span>
                </p>
                <p>
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
                    <Button variant="outline">
                      {selectedMonster === monster.monster_type
                        ? "Hide Tasks"
                        : "Show Tasks"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      {monster.tasks.map((task, index) => (
                        <div
                          key={index}
                          className="p-2 bg-secondary rounded-md text-sm flex flex-col gap-2"
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
                    >
                      Fight
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. You will be locked to this
                        fight until either you defeat the monster or it defeats
                        you.
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
          ))}
        </div>
      </div>
    </div>
  );
}
