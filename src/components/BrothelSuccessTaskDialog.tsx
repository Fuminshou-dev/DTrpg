import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function BrothelSuccessTaskDialog({
  setShowEarnedGold,
  showEarnedGold,
  earnedGold,
  updateGoldMutation,
  player,
  updateBrothelStatisticsMutation,
  updateGoldStatisticsMutation,
}: {
  showEarnedGold: boolean;
  earnedGold: number;
  player: Doc<"players">;
  setShowEarnedGold: (value: boolean) => void;
  updateGoldMutation: ReturnType<
    typeof useMutation<typeof api.customer_tasks.completedBrothelTask>
  >;
  updateBrothelStatisticsMutation: ReturnType<
    typeof useMutation<typeof api.player_statistics.updateBrothelStatistics>
  >;
  updateGoldStatisticsMutation: ReturnType<
    typeof useMutation<typeof api.player_statistics.updateGoldStatistics>
  >;
}) {
  const router = useRouter();

  const handleCloseDialog = async () => {
    setShowEarnedGold(false);
    router.replace("/brothel");

    await updateGoldMutation({ money: earnedGold });
    await updateBrothelStatisticsMutation({
      toUpdate: {
        totalBrothelTaskCompleted: true,
      },
    });
    await updateGoldStatisticsMutation({
      toUpdate: {
        goldSpent: 0,
        goldEarned: earnedGold,
      },
    });
    setShowEarnedGold(false);
  };

  return (
    <AlertDialog defaultOpen={false} open={showEarnedGold}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl mb-2 border-b-2 p-2">
            Congratulations!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-2xl">
            You've earned <span className="text-yellow-400">{earnedGold}</span>{" "}
            gold from completing the task.
          </AlertDialogDescription>
          <AlertDialogDescription className="text-2xl">
            Your total gold is now:{" "}
            <span className="text-yellow-400">{player.gold + earnedGold}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button
              variant={"destructive"}
              className="bg-green-400 hover:bg-green-600"
              onClick={handleCloseDialog}
            >
              OK
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
