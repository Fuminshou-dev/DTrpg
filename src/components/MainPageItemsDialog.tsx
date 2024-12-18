import {
  ItemDescriptions,
  itemImages,
  itemOrder,
  UseSpecialPotionProps,
} from "@/app/utils/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "convex/react";
import Image from "next/image";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { api } from "../../convex/_generated/api";

export function MainPageItemsDialog({
  showItems,
  player,
  setShowItems,
  handleUseSpecialPotion,
  setErrorMsg,
  setShowError,
  setIsButtonLoading,
  isButtonLoading,
  updatePlayerPotionStatisticsMutation,
  updatePlayerItemsAfterUseMutation,
}: {
  showItems: boolean;
  player: Doc<"players">;
  handleUseSpecialPotion: (props: UseSpecialPotionProps) => void;
  setErrorMsg: (value: string) => void;
  setShowError: (value: boolean) => void;
  isButtonLoading: boolean;
  updatePlayerPotionStatisticsMutation: ReturnType<
    typeof useMutation<
      typeof api.player_statistics.updatePlayerPotionStatistics
    >
  >;
  updatePlayerItemsAfterUseMutation: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerItemsAfterUse>
  >;
  setIsButtonLoading: (value: boolean) => void;
  setShowItems: (value: boolean) => void;
}) {
  return (
    <AlertDialog open={showItems}>
      <AlertDialogContent className="flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Backpack</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription asChild className="self-center">
          <div className="grid grid-cols-2 gap-2">
            {player.items
              .sort(
                (a, b) => itemOrder.indexOf(a.type) - itemOrder.indexOf(b.type)
              )
              .map((item) => (
                <div
                  key={item.type}
                  className="text-white font-bold border rounded flex flex-col justify-between items-center h-36 aspect-square relative"
                >
                  <Image
                    className="absolute w-full h-full rounded-sm blur-[1px]"
                    src={itemImages[item.type]}
                    alt="123"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="absolute cursor-help top-1 flex justify-center items-center right-1 border border-slate-300 rounded-full w-4 h-4">
                          <p className="text-center text-xs select-none ">i</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="p-2 text-xs border">
                        {ItemDescriptions[item.type]}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <p className="z-10 text-xs sm:text-sm drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                    {item.itemName}
                  </p>
                  {item.amount === 0 ? (
                    <p className=" z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                      You have:{" "}
                      <span className="text-red-500">{item.amount}</span>
                    </p>
                  ) : (
                    <p className="z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                      You have:{" "}
                      <span className="text-green-500 ">{item.amount}</span>
                    </p>
                  )}
                  <Button
                    className="z-50 text-xs sm:text-sm my-2 drop-shadow-[0_1px_1px_rgba(0,0,0,1)]"
                    onClick={() => {
                      if (item.type === "special") {
                        handleUseSpecialPotion({
                          setIsButtonLoading,
                          itemType: item.type,
                          setErrorMsg: setErrorMsg,
                          setShowError: setShowError,
                          updatePlayerItemsAfterUseMutation:
                            updatePlayerItemsAfterUseMutation,
                          updatePlayerPotionStatisticsMutation:
                            updatePlayerPotionStatisticsMutation,
                        });
                      }
                    }}
                    disabled={item.amount <= 0 || isButtonLoading}
                  >
                    Use
                  </Button>
                </div>
              ))}
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={() => setShowItems(false)}>Close</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
