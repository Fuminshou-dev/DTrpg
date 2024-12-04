"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

export default function FightPage() {
  const router = useRouter();
  const [selectedMonster, setSelectedMonster] = useState<string | null>(null);
  const [monsterToConfirm, setMonsterToConfirm] = useState<number | null>(null); // Track which monster is being confirmed  const router = useRouter();
  const monsters = useQuery(api.monsters.getAllMonstersVisibleToPlayer);
  if (!monsters) {
    return (
      <div className="flex flex-col h-screen justify-center items-center">
        <LoadingSpinner className="size-72"></LoadingSpinner>
      </div>
    );
  }
  if (!monsters?.success) {
    if (monsters.error === "No userId")
      return (
        <div className="flex flex-col h-screen justify-center items-center">
          <LoadingSpinner className="size-72"></LoadingSpinner>
        </div>
      );
  }
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
                <p>Monster HP: {monster.hp}</p>
                <p>Earned XP: {monster.exp}</p>
                <p>Earned GOLD: {monster.gold}</p>
                <p>
                  Monster damage: {monster.min_dmg} - {monster.max_dmg}
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
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
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
                          router.push(`/fight/${monster.showId}`);
                          setMonsterToConfirm(null);
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