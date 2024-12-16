import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";

export function BrothelFailTaskDialog({
  showFailTaskDialog,
  setShowFailTaskDialog,
  setBrothelCooldownMutation,
  updateBrothelStatisticsMutation,
}: {
  showFailTaskDialog: boolean;
  setShowFailTaskDialog: (value: boolean) => void;
  setBrothelCooldownMutation: ReturnType<
    typeof useMutation<typeof api.customers.setBrothelCooldown>
  >;
  updateBrothelStatisticsMutation: ReturnType<
    typeof useMutation<typeof api.player_statistics.updateBrothelStatistics>
  >;
}) {
  const router = useRouter();
  const handleCloseDialog = async () => {
    await setBrothelCooldownMutation();
    await updateBrothelStatisticsMutation({
      toUpdate: {
        totalBrothelTaskFailed: true,
      },
    });
    setShowFailTaskDialog(false);
    router.push("/main");
  };
  return (
    <AlertDialog defaultOpen={false} open={showFailTaskDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl mb-2 border-b-2 p-2">
            You have failed such an easy task...
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="text-2xl">
                You are now <span className="text-red-500">frobidden</span> to
                enter the brothel for the next{" "}
                <span className="text-red-500">30 minutes</span>.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={handleCloseDialog}>Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
