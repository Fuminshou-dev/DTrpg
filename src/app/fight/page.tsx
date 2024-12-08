"use client";
import { api } from "../../../convex/_generated/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

async function updatePlayerFightStatus({
  updatePlayerFightStatusMutation,
  playerStats,
  monster,
  playerAtk,
  monsterId,
  updatePlayerAfterDefeatingAMonster,
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
  updatePlayerAfterDefeatingAMonster: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerAfterDefeatingAMonster>
  >;
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

  // check if monster is dead

  if (monsterHp - finalDmg <= 0) {
    await updatePlayerFightStatusMutation({
      fightStatus: "idle",
    });
    await updatePlayerAfterDefeatingAMonster({
      earnedExp: monster.exp,
      earnedGold: monster.gold,
      monsterId: monsterId,
    });
    return;
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
  updatePlayerAfterDefeatingAMonster,
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
  updatePlayerAfterDefeatingAMonster: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerAfterDefeatingAMonster>
  >;
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
            <span>
              <span className="text-red-500">{monster.monster_type}</span> will
              deal dmg to you{" "}
            </span>
            <span>
              Your current HP:{" "}
              <span className="text-green-500">{playerHp}</span>
            </span>
            <span>
              Monster HP: <span className="text-red-500">{monsterHp}</span>
            </span>
            <span>
              Monster damage: <span className="text-red-500">{monsterAtk}</span>
            </span>
            <span>
              Your new HP:
              <span className="text-green-500">{playerHp - monsterAtk}</span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(event) => {
              const button = event.currentTarget;
              button.disabled = true;
              button.textContent = "Loading...";

              setTimeout(() => {
                setShowFailAttackDialog(false);
                // run the task failure function here
                updatePlayerFightStatus({
                  playerId,
                  resetPlayerMutation: resetPlayerMutation,
                  updatePlayerFightStatusMutation,
                  updatePlayerAfterDefeatingAMonster,
                  playerHp,
                  monsterHp,
                  monsterAtk,
                  finalDmg: 0,
                  monster,
                  playerStats,
                  monsterId,
                  playerAtk,
                });
              }, 3000);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ScuccessAttackDialog({
  playerHp,
  updatePlayerAfterDefeatingAMonster,
  monsterHp,
  monsterAtk,
  monster,
  monsterId,
  playerAtk,
  finalDmg,
  resetPlayerMutation,
  showSuccessAttackDialog,
  setShowSuccessAttackDialog,
  playerId,
  playerStats,
  updatePlayerFightStatusMutation,
}: {
  playerHp: number;
  monsterHp: number;
  updatePlayerAfterDefeatingAMonster: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerAfterDefeatingAMonster>
  >;
  finalDmg: number;
  monsterAtk: number;
  showSuccessAttackDialog: boolean;
  setShowSuccessAttackDialog: (value: boolean) => void;
  monsterId: number;
  playerId: Id<"players">;
  playerAtk: number;
  monster: Doc<"monsters">;
  playerStats: Doc<"player_stats">;
  updatePlayerFightStatusMutation: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerFightStatus>
  >;
  resetPlayerMutation: ReturnType<
    typeof useMutation<typeof api.players.resetPlayer>
  >;
}) {
  return (
    <AlertDialog open={showSuccessAttackDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">
            Congratulations!
          </AlertDialogTitle>
          <AlertDialogDescription asChild className="flex flex-col text-lg">
            <div>
              <span className="border-b-4 text-center">
                You have successfully completed the task!
              </span>
              <Table className="mt-8">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-3xl"></TableHead>
                    <TableHead className="text-3xl text-green-500">
                      Player
                    </TableHead>
                    <TableHead className="text-3xl text-red-500">
                      {monster.monster_type}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-2xl">Attack</TableCell>
                    <TableCell className="text-2xl text-green-500">
                      {finalDmg}
                    </TableCell>
                    <TableCell className="text-2xl text-red-500">
                      {monsterAtk}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-2xl">HP</TableCell>
                    <TableCell className="text-2xl text-green-500">
                      {playerHp}
                    </TableCell>
                    <TableCell className="text-2xl text-red-500">
                      {monsterHp}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-2xl">New HP</TableCell>
                    <TableCell className="text-2xl text-green-500">
                      {playerHp - monsterAtk}
                    </TableCell>
                    <TableCell className="text-2xl text-red-500">
                      {monsterHp - finalDmg}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setShowSuccessAttackDialog(false);
            }}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              const button = event.currentTarget;
              button.disabled = true;
              button.textContent = "Loading...";

              setTimeout(() => {
                setShowSuccessAttackDialog(false);
                updatePlayerFightStatus({
                  playerId,
                  updatePlayerAfterDefeatingAMonster,
                  resetPlayerMutation: resetPlayerMutation,
                  updatePlayerFightStatusMutation,
                  playerHp,
                  monsterHp,
                  monsterAtk,
                  finalDmg,
                  monster,
                  playerStats,
                  monsterId,
                  playerAtk,
                });
              }, 3000);
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
  const router = useRouter();
  const player = useQuery(api.players.getPlayer);
  const updatePlayerAfterDefeatingAMonster = useMutation(
    api.players.updatePlayerAfterDefeatingAMonster
  );
  const updatePlayerFightStatusMutation = useMutation(
    api.players.updatePlayerFightStatus
  );
  const resetPlayerMutation = useMutation(api.players.resetPlayer);
  const [showFailAttackDialog, setShowFailAttackDialog] = useState(false);
  const [showSuccessAttackDialog, setShowSuccessAttackDialog] = useState(false);
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
    return router.push("/choose-monster");
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
      <ScuccessAttackDialog
        updatePlayerAfterDefeatingAMonster={updatePlayerAfterDefeatingAMonster}
        finalDmg={finalDmg ?? 0}
        playerId={player._id}
        resetPlayerMutation={resetPlayerMutation}
        monster={currentMonster}
        monsterId={currentMonster.showId}
        playerAtk={playerAtk ?? 0}
        playerStats={levelStats}
        updatePlayerFightStatusMutation={updatePlayerFightStatusMutation}
        setShowSuccessAttackDialog={setShowSuccessAttackDialog}
        showSuccessAttackDialog={showSuccessAttackDialog}
        playerHp={playerHp ?? 0}
        monsterHp={monsterHp ?? 0}
        monsterAtk={monsterAtk ?? 0}
      />
      <FailDialog
        playerId={player._id}
        updatePlayerAfterDefeatingAMonster={updatePlayerAfterDefeatingAMonster}
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
          onClick={() => {
            setShowSuccessAttackDialog(true);
          }}
        >
          Success
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
