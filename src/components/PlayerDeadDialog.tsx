"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function PlayerDeadDialog({
  isPlayerDead,
  playerId,
  resetPlayer,
  setIsPlayerDead,
}: {
  isPlayerDead: boolean;
  playerId: Id<"players">;
  resetPlayer: ReturnType<typeof useMutation<typeof api.players.resetPlayer>>;
  setIsPlayerDead: (isDead: boolean) => void;
}) {
  return (
    <AlertDialog open={isPlayerDead}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            You are dead!
          </AlertDialogTitle>
          <AlertDialogDescription asChild className="flex flex-col text-lg">
            <div>
              <span className="flex flex-col gap-2">
                <span>
                  You have been defeated. Fortunately, you will be reborn from
                  the start. (Or you can create a new character.)
                </span>
                <span>All of your progress will be reset.</span>
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(event) => {
              const button = event.currentTarget;
              button.disabled = true;
              button.textContent = "Loading...";

              setTimeout(async () => {
                resetPlayer({ playerId });
                setIsPlayerDead(false);
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
