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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            You are a failure!
          </AlertDialogTitle>
          <AlertDialogDescription asChild className="text-xl">
            <div className="flex flex-col gap-2">
              <p>You have failed the task. What a pity.</p>
              <p>
                The{" "}
                <span className="text-rose-500">{monster.monster_type}</span>{" "}
                will deal dmg to you.
              </p>
              <p>
                You will <span className="text-red-500">not</span> deal damage
                to <span className="text-rose-500">{monster.monster_type}</span>
              </p>
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
