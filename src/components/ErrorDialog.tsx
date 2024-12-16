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

export default function ErrorDialog({
  showError,
  setShowError,
  errorMsg,
  setErrorMsg,
}: {
  showError: boolean;
  errorMsg: string;
  setShowError: (show: boolean) => void;
  setErrorMsg: (msg: string) => void;
}) {
  return (
    <AlertDialog defaultOpen={false} open={showError}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">Error!</AlertDialogTitle>
          <AlertDialogDescription asChild className="flex flex-col text-lg">
            <div>
              <p>{errorMsg}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              {
                setShowError(false);
                setErrorMsg("");
              }
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
