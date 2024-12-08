"use client";
import { api } from "../../../convex/_generated/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import {
  calculateFinalDmg,
  calculateMonsterDmg,
  getRandomAtkMultiplier,
  getRandomTask,
} from "../utils/utilFunctions";
import { Doc, Id } from "../../../convex/_generated/dataModel";

async function updatePlayerFightStatus({
  updatePlayerFightStatusMutation,
  playerStats,
  monster,
  playerAtk,
  monsterId,
  monsterHp,
  playerHp,
  playerId,
  resetPlayerMutation,
  monsterAtk,
  finalDmg,
}: {
  updatePlayerFightStatusMutation: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerFightStatus>
  >;
  resetPlayerMutation: ReturnType<
    typeof useMutation<typeof api.players.resetPlayer>
  >;
  playerStats: Doc<"player_stats">;
  monster: Doc<"monsters">;
  playerAtk: number;
  monsterId: number;
  monsterHp: number;
  playerId: Id<"players">;
  playerHp: number;
  finalDmg: number;
  monsterAtk: number;
}) {
  const newAtkMultipler = getRandomAtkMultiplier();
  const newRandomTask = getRandomTask({ monster });
  const newFinalDmg = calculateFinalDmg(playerStats.atk, newAtkMultipler);
  const newMonsterAtk = calculateMonsterDmg({ monster });

  // check if the player is dead

  if (playerHp - monsterAtk <= 0) {
    return await resetPlayerMutation({ playerId });
  }

  await updatePlayerFightStatusMutation({
    fightStatus: {
      status: "fighting",
      monsterHp: monsterHp - finalDmg,
      playerHp: playerHp - monsterAtk,
      monsterId: monsterId,
      atkMultiplier: newAtkMultipler,
      currentTask: newRandomTask,
      finalDmg: newFinalDmg,
      monsterAtk: newMonsterAtk,
      playerAtk: playerAtk,
    },
  });
}

function FailDialog({
  showFailAttackDialog,
  playerHp,
  monsterHp,
  monsterAtk,
  monster,
  monsterId,
  playerAtk,
  resetPlayerMutation,
  playerId,
  playerStats,
  setShowFailAttackDialog,
  updatePlayerFightStatusMutation,
}: {
  showFailAttackDialog: boolean;
  playerHp: number;
  monsterHp: number;
  monsterAtk: number;
  monsterId: number;
  playerId: Id<"players">;
  playerAtk: number;
  monster: Doc<"monsters">;
  playerStats: Doc<"player_stats">;
  setShowFailAttackDialog: (value: boolean) => void;
  updatePlayerFightStatusMutation: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerFightStatus>
  >;
  resetPlayerMutation: ReturnType<
    typeof useMutation<typeof api.players.resetPlayer>
  >;
}) {
  return (
    <AlertDialog open={showFailAttackDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            You are a failure!
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col text-lg">
            <span>You have failed the task. What a pity.</span>
            <span>The monster will now deal damage to you.</span>
            <span>
              Your current HP: <span className="text-red-500">{playerHp}</span>
            </span>
            <span>
              Monster HP: <span className="text-red-500">{monsterHp}</span>
            </span>
            <span>
              Monster damage: <span className="text-red-500">{monsterAtk}</span>
            </span>
            <span>
              Your new HP:{" "}
              <span className="text-red-500">{playerHp - monsterAtk}</span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              setShowFailAttackDialog(false);
              // run the task failure function here
              updatePlayerFightStatus({
                playerId,
                resetPlayerMutation: resetPlayerMutation,
                updatePlayerFightStatusMutation,
                playerHp,
                monsterHp,
                monsterAtk,
                finalDmg: 0,
                monster,
                playerStats,
                monsterId,
                playerAtk,
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function MonsterFightPage() {
  const player = useQuery(api.players.getPlayer);

  const updatePlayerFightStatusMutation = useMutation(
    api.players.updatePlayerFightStatus
  );
  const resetPlayerMutation = useMutation(api.players.resetPlayer);
  const [showFailAttackDialog, setShowFailAttackDialog] = useState(false);
  const playerLevel = player?.level ?? 0;

  const levelStats = useQuery(api.player_stats.getLevelStats, {
    level: playerLevel,
  });

  const updatePlayerFightStatus = useMutation(
    api.players.updatePlayerFightStatus
  );

  const playerFightStatus =
    player?.fightStatus !== "idle" ? player?.fightStatus : null;

  const {
    monsterId,
    playerHp,
    monsterHp,
    playerAtk,
    monsterAtk,
    atkMultiplier,
    finalDmg,
    currentTask,
  } = playerFightStatus || {};

  const currentMonster = useQuery(api.monsters.getMonster, {
    monsterId: monsterId ?? 0,
  });

  if (!player || !levelStats) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner className="size-72" />
      </div>
    );
  }

  if (player.fightStatus === "idle") {
    return <>You shouldn't be here</>;
  }

  if (!currentMonster) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner className="size-72" />
      </div>
    );
  }

  return (
    <div className="container h-screen mx-auto flex flex-col gap-8 justify-center items-center">
      <FailDialog
        playerId={player._id}
        resetPlayerMutation={resetPlayerMutation}
        monster={currentMonster}
        monsterId={currentMonster.showId}
        playerAtk={playerAtk ?? 0}
        playerStats={levelStats}
        updatePlayerFightStatusMutation={updatePlayerFightStatusMutation}
        setShowFailAttackDialog={setShowFailAttackDialog}
        showFailAttackDialog={showFailAttackDialog}
        playerHp={playerHp ?? 0}
        monsterHp={monsterHp ?? 0}
        monsterAtk={monsterAtk ?? 0}
      />
      <div className="flex flex-col justify-center items-center w-full border">
        <h1 className="p-4 w-full text-center text-3xl">
          {currentMonster.monster_type}
        </h1>
        <div
          className="w-1/2
         flex flex-col"
        >
          <p className="text-end text-red-500">
            {monsterHp}/{currentMonster.hp}
          </p>
          <Progress
            value={monsterHp && (monsterHp / currentMonster.hp) * 100}
            indicatorcolor="bg-red-500"
          />
        </div>
        <div className=" p-4 w-full text-center">
          <p>
            Hp:
            <span className="text-red-500"> {currentMonster.hp}</span>
          </p>
          <p>
            Damage:
            <span className="text-red-500"> {currentMonster.min_dmg}</span>-
            <span className="text-red-500">{currentMonster.max_dmg}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full  border">
        <p className=" p-4 w-full text-center text-3xl">{player.playerName}</p>
        <div
          className="w-1/2
         flex flex-col"
        >
          <p className="text-end text-green-500">
            {playerHp}/{levelStats?.hp}
          </p>
          <Progress
            value={
              playerHp && levelStats ? (playerHp / levelStats.hp) * 100 : 0
            }
            indicatorcolor="bg-green-500"
          />
        </div>
        <div className=" p-4 w-full text-center">
          <p>
            Hp:
            <span className="text-red-500"> {levelStats?.hp}</span>
          </p>
          <p>
            Damage:
            <span className="text-red-500"> {playerAtk}</span>
          </p>
          <p>
            Atk Multiplier:
            <span
              className={
                atkMultiplier && atkMultiplier > 1
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {" "}
              {atkMultiplier}
            </span>
          </p>
          <p>
            Final damage dealt to monster:
            <span
              className={
                finalDmg && finalDmg > 0 ? "text-green-500" : "text-red-500"
              }
            >
              {" "}
              {finalDmg}
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-evenly items-center w-full  border">
        <p className=" p-4 text-3xl">Rewards</p>
        <div className="flex text-2xl flex-col">
          <p className=" p-4">
            Gained EXP:
            <span className="text-orange-500"> {currentMonster.exp}</span>
          </p>
          <p className=" p-4">
            Gained GOLD:
            <span className="text-yellow-400"> {currentMonster.gold}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full p-4 gap-4 border">
        <p className="text-3xl">Task:</p>
        <div className="text-2xl">
          <p className="text-center">{currentTask?.task_description}</p>
          <p>
            Maximum allowed break time:
            <span
              className={
                currentTask?.break_time != 0 ? "text-green-500" : "text-red-500"
              }
            >
              {" "}
              {currentTask?.break_time}{" "}
            </span>
            seconds
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-evenly items-center w-full  border">
        <Button
          className="my-4"
          onClick={() =>
            updatePlayerFightStatus({
              fightStatus: {
                status: "fighting",
                monsterId: monsterId ?? 0,
                currentTask: currentTask ?? {
                  task_description: "",
                  break_time: 0,
                },
                playerAtk: playerAtk ?? 0,
                monsterAtk: monsterAtk ?? 0,
                playerHp: playerHp ?? 0,
                monsterHp: monsterHp ?? 0,
                atkMultiplier: atkMultiplier ?? 0,
                finalDmg: finalDmg ?? 0,
              },
            })
          }
        >
          Update
        </Button>
        <Button
          className="my-4"
          onClick={() => {
            // show a fail dialog here
            setShowFailAttackDialog(true);
          }}
        >
          Fail
        </Button>
      </div>
    </div>
  );
}
