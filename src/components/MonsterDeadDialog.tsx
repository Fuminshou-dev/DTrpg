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
import { Doc } from "../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";

export default function MonsterDeadDialog({
  isMonsterDead,
  monster,
  updatePlayerAfterDefeatingAMonster,
  setIsMonsterDead,
  nextLevelStats,
  player,
  levelStats,
}: {
  isMonsterDead: boolean;
  monster: Doc<"monsters">;
  updatePlayerAfterDefeatingAMonster: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerAfterDefeatingAMonster>
  >;
  setIsMonsterDead: (value: boolean) => void;
  nextLevelStats: Doc<"player_stats">;
  player: Doc<"players">;
  levelStats: Doc<"player_stats">;
}) {
  const router = useRouter();
  const newPlayerExp =
    player.current_exp +
    (player.hasSpecialPotionEffect ? monster.exp * 2 : monster.exp);
  return (
    <AlertDialog open={isMonsterDead}>
      <AlertDialogContent className="p-4 sm:p-6 md:p-8 w-[95%] max-w-[500px] max-h-[90vh] mx-auto rounded-lg flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl sm:text-2xl md:text-3xl text-center">
            Congratulations! You have defeated the monster!
          </AlertDialogTitle>
          <AlertDialogDescription
            asChild
            className="flex flex-col text-sm sm:text-base md:text-lg lg:text-xl"
          >
            <div>
              {newPlayerExp < nextLevelStats.required_exp && (
                <Table className="mt-8 w-full text-xs sm:text-sm md:text-base lg:text-lg">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="">Stat</TableHead>
                      <TableHead className=" text-orange-400">Gained</TableHead>
                      <TableHead className=" text-green-500">New</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-orange-500">Exp</TableCell>
                      <TableCell className=" text-orange-500">
                        {player.hasSpecialPotionEffect
                          ? monster.exp * 2
                          : monster.exp}{" "}
                        XP
                      </TableCell>
                      <TableCell className=" text-orange-500">
                        {newPlayerExp < 543 || player.level !== 8 ? (
                          <span>{newPlayerExp} XP</span>
                        ) : (
                          <span>You have reached max level</span>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="">Gold</TableCell>
                      <TableCell className="">
                        <span className="text-yellow-400">{monster.gold} </span>
                        GOLD
                      </TableCell>
                      <TableCell className="">
                        <span className="text-yellow-400">
                          {player.gold + monster.gold}{" "}
                        </span>
                        GOLD
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="">Attack</TableCell>
                      <TableCell className=" text-green-500"></TableCell>
                      <TableCell className="">
                        <span className=" text-green-500">
                          {levelStats.atk}{" "}
                        </span>{" "}
                        atk
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="">Hp</TableCell>
                      <TableCell className=" text-green-500"></TableCell>
                      <TableCell className="">
                        <span className="text-red-500">{levelStats.hp} </span>
                        HP
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="">Level</TableCell>
                      <TableCell className=" text-green-500"></TableCell>
                      <TableCell className=" text-red-500">
                        {player.level}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
              {newPlayerExp >= nextLevelStats.required_exp && (
                <span>
                  <span>
                    Congratulations! You've reached level{" "}
                    <span className="text-orange-500">{player.level + 1}</span>
                  </span>
                  <Table className="mt-8">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-3xl">Stat</TableHead>
                        <TableHead className="text-3xl text-orange-400">
                          Gained
                        </TableHead>
                        <TableHead className="text-3xl text-green-500">
                          New
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="">Exp</TableCell>
                        <TableCell className="">
                          <span className=" text-orange-500">
                            {player.hasSpecialPotionEffect
                              ? monster.exp * 2
                              : monster.exp}{" "}
                          </span>
                          XP
                        </TableCell>
                        <TableCell className="">
                          <span className=" text-orange-500">
                            {newPlayerExp < 543 || player.level !== 8 ? (
                              <span>{newPlayerExp} XP</span>
                            ) : (
                              <span className="text-lg">
                                You have reached max level
                              </span>
                            )}
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="">Gold</TableCell>
                        <TableCell className="">
                          <span className="text-yellow-400">
                            {monster.gold}{" "}
                          </span>
                          GOLD
                        </TableCell>
                        <TableCell className="">
                          <span className="text-yellow-400">
                            {player.gold + monster.gold}{" "}
                          </span>
                          GOLD
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="">Attack</TableCell>
                        <TableCell className="">
                          <span className=" text-green-500">
                            {nextLevelStats.atk - levelStats.atk}
                          </span>{" "}
                          atk
                        </TableCell>
                        <TableCell className="">
                          <span className=" text-green-500">
                            {nextLevelStats.atk}{" "}
                          </span>{" "}
                          atk
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="">Hp</TableCell>
                        <TableCell className="">
                          <span className="text-green-500">
                            {nextLevelStats.hp - levelStats.hp}
                          </span>{" "}
                          Hp
                        </TableCell>
                        <TableCell className="">
                          <span className="text-red-500">
                            {nextLevelStats.hp}{" "}
                          </span>
                          HP
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="">Level</TableCell>
                        <TableCell className=" text-green-500">1</TableCell>
                        <TableCell className=" text-red-500">
                          {player.level + 1}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </span>
              )}
              {player.currentMonster === monster.showId && (
                <span className=" text-center text-red-100 border border-pink-200 my-2">
                  Another monster has been unlocked. You can fight them on the
                  fight page.
                </span>
              )}
              {player.hasSpecialPotionEffect && (
                <span className="text-red-500  text-center border border-red-400 my-2">
                  You Special Potion has wore off.
                </span>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="text-sm sm:text-base md:text-lg px-4 py-2 sm:px-6 sm:py-3"
            onClick={(event) => {
              const button = event.currentTarget;
              button.disabled = true;
              button.textContent = "Loading...";

              setTimeout(async () => {
                updatePlayerAfterDefeatingAMonster({
                  earnedExp: player.hasSpecialPotionEffect
                    ? monster.exp * 2
                    : monster.exp,
                  earnedGold: monster.gold,
                  monsterId: monster.showId,
                });
                setIsMonsterDead(false);
                router.refresh();
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
