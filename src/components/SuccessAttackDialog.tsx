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
import React from "react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

export default function SuccessAttackDialog({
  playerHp,
  monsterHp,
  monsterAtk,
  monster,
  monsterId,
  playerAtk,
  hasSpecialPotionEffect,
  setIsPlayerDead,
  finalDmg,
  showSuccessAttackDialog,
  setShowSuccessAttackDialog,
  playerStats,
  setIsLastBossDead,
  setIsMonsterDead,
  updatePlayerFightStatusMutation,
  updatePlayerCombatStatisticsMutation,
  updatePlayerMonstersStatisticsMutation,
  updatePlayerGoldMutation,
}: {
  playerHp: number;
  monsterHp: number;
  finalDmg: number;
  monsterAtk: number;
  showSuccessAttackDialog: boolean;
  setShowSuccessAttackDialog: (value: boolean) => void;
  monsterId: number;
  playerAtk: number;
  monster: Doc<"monsters">;
  playerStats: Doc<"player_stats">;
  updatePlayerFightStatusMutation: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerFightStatus>
  >;
  setIsMonsterDead: (value: boolean) => void;
  setIsPlayerDead: (value: boolean) => void;
  hasSpecialPotionEffect: boolean;
  setIsLastBossDead: (value: boolean) => void;
  updatePlayerCombatStatisticsMutation: ReturnType<
    typeof useMutation<
      typeof api.player_statistics.updatePlayerCombatStatistics
    >
  >;
  updatePlayerGoldMutation: ReturnType<
    typeof useMutation<typeof api.player_statistics.updateGoldStatistics>
  >;
  updatePlayerMonstersStatisticsMutation: ReturnType<
    typeof useMutation<
      typeof api.player_statistics.updatePlayerMonstersStatistics
    >
  >;
}) {
  const handleSuccessAttack = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const button = event.currentTarget;
    button.disabled = true;
    button.textContent = "Loading...";

    setTimeout(async () => {
      setShowSuccessAttackDialog(false);
      const { status } = await updatePlayerFightStatus({
        hasSpecialPotionEffect,
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
      if (status === "player_dead") {
        setIsPlayerDead(true);
      }
      if (status === "monster_dead" && monster.monster_type !== "Evil Deity") {
        await updatePlayerMonstersStatisticsMutation({
          toUpdate: {
            monsterKilled: monster.monster_type,
          },
        });
        await updatePlayerGoldMutation({
          toUpdate: {
            goldSpent: 0,
            goldEarned: monster.gold,
          },
        });
        setIsMonsterDead(true);
      }
      if (status === "monster_dead" && monster.monster_type === "Evil Deity") {
        await updatePlayerMonstersStatisticsMutation({
          toUpdate: {
            monsterKilled: monster.monster_type,
          },
        });
        setIsLastBossDead(true);
      }

      await updatePlayerCombatStatisticsMutation({
        toUpdate: {
          totalCombatTasks: true,
          totalCombatTasksCompleted: true,
          totalDamageTaken: monsterAtk,
          totalDamageDealt: finalDmg,
        },
      });
    }, 3000);
  };

  return (
    <AlertDialog open={showSuccessAttackDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Congratulations!
          </AlertDialogTitle>
          <AlertDialogDescription asChild className="text-xl">
            <div className="flex flex-col gap-2">
              <p>
                You have <span className="text-green-600">completed</span> the
                task.
              </p>
              <p>
                You will deal damage to the{" "}
                <span className="text-rose-500">{monster.monster_type}</span>.
              </p>
              <p>
                And the{" "}
                <span className="text-rose-500">{monster.monster_type}</span>{" "}
                will deal damage to you.
              </p>
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

          <AlertDialogAction onClick={handleSuccessAttack}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
