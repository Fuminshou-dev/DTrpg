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
      <AlertDialogContent className="max-w-[90vw] w-full sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl sm:text-2xl">
            Error!
          </AlertDialogTitle>
          <AlertDialogDescription
            asChild
            className="flex flex-col text-base sm:text-lg"
          >
            <div className="max-h-[60vh] overflow-y-auto">
              <p>{errorMsg}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="w-full sm:w-auto"
            onClick={() => {
              setShowError(false);
              setErrorMsg("");
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
