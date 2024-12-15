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
import { Doc, Id } from "../../convex/_generated/dataModel";
import { updatePlayerFightStatus } from "@/app/utils/utilFunctions";

export default function SuccessAttackDialog({
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
