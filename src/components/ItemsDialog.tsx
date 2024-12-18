import {
  ItemDescriptions,
  itemImages,
  itemOrder,
  itemsDialogProps,
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
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function ItemsDialog({
  player,
  playerHp,
  levelStats,
  monsterHp,
  showItems,
  setShowItems,
  monsterId,
  playerAtk,
  updatePlayerFightStatusMutation,
  handleUseHealingItem,
  handleUseRerollPotion,
  isButtonLoading,
}: itemsDialogProps) {
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
                      if (
                        item.type === "restore1" ||
                        item.type === "restore2"
                      ) {
                        if (playerHp && levelStats) {
                          handleUseHealingItem(
                            playerHp,
                            levelStats.hp,
                            item.type
                          );
                        }
                      } else {
                        handleUseRerollPotion({
                          hasSpecialPotionEffect: player.hasSpecialPotionEffect,
                          monsterHp: monsterHp ?? 0,
                          monsterId: monsterId ?? 0,
                          itemType: item.type,
                          playerAtk: playerAtk ?? 0,
                          playerHp: playerHp ?? 0,
                          updatePlayerFightStatusMutation,
                        });
                      }
                    }}
                    disabled={
                      item.amount === 0 ||
                      item.type === "special" ||
                      isButtonLoading
                    }
                  >
                    Use
                  </Button>
                </div>
              ))}
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setShowItems(!showItems)}>
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
