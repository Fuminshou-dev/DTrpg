import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function BrothelSuccessTaskDialog({
  setShowEarnedGold,
  showEarnedGold,
  earnedGold,
  player,
}: {
  showEarnedGold: boolean;
  earnedGold: number;
  player: Doc<"players">;
  setShowEarnedGold: (value: boolean) => void;
}) {
  const router = useRouter();

  const handleCloseDialog = () => {
    setShowEarnedGold(false);
    router.replace("/brothel");
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
            <span className="text-yellow-400">{player.gold}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              variant={"destructive"}
              className="bg-green-400 hover:bg-green-600"
              onClick={handleCloseDialog}
            >
              OK
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
