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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Congratulations! You have defeated the monster!
          </AlertDialogTitle>
          <AlertDialogDescription asChild className="flex flex-col text-lg">
            <div>
              {newPlayerExp < nextLevelStats.required_exp && (
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
                      <TableCell className="text-2xl">Exp</TableCell>
                      <TableCell className="text-2xl text-orange-500">
                        {player.hasSpecialPotionEffect
                          ? monster.exp * 2
                          : monster.exp}{" "}
                        XP
                      </TableCell>
                      <TableCell className="text-2xl text-orange-500">
                        {newPlayerExp} XP
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-2xl">Gold</TableCell>
                      <TableCell className="text-2xl">
                        <span className="text-yellow-400">{monster.gold} </span>
                        GOLD
                      </TableCell>
                      <TableCell className="text-2xl">
                        <span className="text-yellow-400">
                          {player.gold + monster.gold}{" "}
                        </span>
                        GOLD
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-2xl">Attack</TableCell>
                      <TableCell className="text-2xl text-green-500"></TableCell>
                      <TableCell className="text-2xl">
                        <span className=" text-green-500">
                          {levelStats.atk}{" "}
                        </span>{" "}
                        atk
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-2xl">Hp</TableCell>
                      <TableCell className="text-2xl text-green-500"></TableCell>
                      <TableCell className="text-2xl">
                        <span className="text-red-500">{levelStats.hp} </span>
                        HP
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-2xl">Level</TableCell>
                      <TableCell className="text-2xl text-green-500"></TableCell>
                      <TableCell className="text-2xl text-red-500">
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
                        <TableCell className="text-2xl">Exp</TableCell>
                        <TableCell className="text-2xl">
                          <span className=" text-orange-500">
                            {player.hasSpecialPotionEffect
                              ? monster.exp * 2
                              : monster.exp}{" "}
                          </span>
                          XP
                        </TableCell>
                        <TableCell className="text-2xl">
                          <span className=" text-orange-500">
                            {newPlayerExp}{" "}
                          </span>
                          XP
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-2xl">Gold</TableCell>
                        <TableCell className="text-2xl">
                          <span className="text-yellow-400">
                            {monster.gold}{" "}
                          </span>
                          GOLD
                        </TableCell>
                        <TableCell className="text-2xl">
                          <span className="text-yellow-400">
                            {player.gold + monster.gold}{" "}
                          </span>
                          GOLD
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-2xl">Attack</TableCell>
                        <TableCell className="text-2xl">
                          <span className=" text-green-500">
                            {nextLevelStats.atk - levelStats.atk}
                          </span>{" "}
                          atk
                        </TableCell>
                        <TableCell className="text-2xl">
                          <span className=" text-green-500">
                            {nextLevelStats.atk}{" "}
                          </span>{" "}
                          atk
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-2xl">Hp</TableCell>
                        <TableCell className="text-2xl">
                          <span className="text-green-500">
                            {nextLevelStats.hp - levelStats.hp}
                          </span>{" "}
                          Hp
                        </TableCell>
                        <TableCell className="text-2xl">
                          <span className="text-red-500">
                            {nextLevelStats.hp}{" "}
                          </span>
                          HP
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-2xl">Level</TableCell>
                        <TableCell className="text-2xl text-green-500">
                          1
                        </TableCell>
                        <TableCell className="text-2xl text-red-500">
                          {player.level + 1}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </span>
              )}
              {player.currentMonster === monster.showId && (
                <span className="text-2xl text-center text-red-100 border border-pink-200 my-2">
                  Another monster has been unlocked. You can fight them on the
                  fight page.
                </span>
              )}
              {player.hasSpecialPotionEffect && (
                <span className="text-red-500 text-2xl text-center border border-red-400 my-2">
                  You Special Potion has wore off.
                </span>
              )}
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
