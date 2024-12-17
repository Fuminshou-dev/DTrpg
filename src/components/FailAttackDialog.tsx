"use client";
import { updatePlayerFightStatus } from "@/app/utils/utilFunctions";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

export default function FailDialog({
  showFailAttackDialog,
  hasSpecialPotionEffect,
  playerHp,
  monsterHp,
  monsterAtk,
  monster,
  monsterId,
  playerAtk,
  playerStats,
  setShowFailAttackDialog,
  setIsPlayerDead,
  updatePlayerFightStatusMutation,
  updatePlayerCombatStatisticsMutation,
}: {
  showFailAttackDialog: boolean;
  playerHp: number;
  monsterHp: number;
  monsterAtk: number;
  monsterId: number;
  playerAtk: number;
  monster: Doc<"monsters">;
  playerStats: Doc<"player_stats">;
  setShowFailAttackDialog: (value: boolean) => void;
  updatePlayerFightStatusMutation: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerFightStatus>
  >;
  hasSpecialPotionEffect: boolean;
  setIsPlayerDead: (value: boolean) => void;
  updatePlayerCombatStatisticsMutation: ReturnType<
    typeof useMutation<
      typeof api.player_statistics.updatePlayerCombatStatistics
    >
  >;
}) {
  const handleFailedAttack = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    button.disabled = true;
    button.textContent = "Loading...";

    setTimeout(async () => {
      setShowFailAttackDialog(false);
      const { status } = await updatePlayerFightStatus({
        hasSpecialPotionEffect,
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
      if (status === "player_dead") {
        setIsPlayerDead(true);
      }
      await updatePlayerCombatStatisticsMutation({
        toUpdate: {
          totalCombatTasks: true,
          totalCombatTasksFailed: true,
          totalDamageTaken: monsterAtk,
        },
      });
    }, 3000);
  };

  return (
    <AlertDialog open={showFailAttackDialog}>
      <AlertDialogContent className="max-w-full sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl sm:text-2xl">
            You are a failure!
          </AlertDialogTitle>
          <AlertDialogDescription
            asChild
            className="flex flex-col text-base sm:text-lg"
          >
            <div>
              <span>You have failed the task. What a pity.</span>
              <Table className="mt-4 sm:mt-8">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xl sm:text-3xl"></TableHead>
                    <TableHead className="text-xl sm:text-3xl text-red-500">
                      {monster.monster_type}
                    </TableHead>
                    <TableHead className="text-xl sm:text-3xl text-green-500">
                      Player
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-lg sm:text-2xl">
                      Attack
                    </TableCell>
                    <TableCell className="text-lg sm:text-2xl text-red-500">
                      {monsterAtk}
                    </TableCell>
                    <TableCell className="text-lg sm:text-2xl text-red-500">
                      0
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-lg sm:text-2xl">HP</TableCell>
                    <TableCell className="text-lg sm:text-2xl text-red-500">
                      {monsterHp}
                    </TableCell>
                    <TableCell className="text-lg sm:text-2xl text-green-500">
                      {playerHp}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-lg sm:text-2xl">
                      New HP
                    </TableCell>
                    <TableCell className="text-lg sm:text-2xl text-red-500">
                      {monsterHp}
                    </TableCell>
                    <TableCell className="text-lg sm:text-2xl text-green-500">
                      {playerHp - monsterAtk}
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
              setShowFailAttackDialog(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleFailedAttack}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
