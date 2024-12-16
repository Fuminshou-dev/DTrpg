"use client";

import { differenceInDays } from "date-fns";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EvilDeityVictoryScreen({
  player,
  isLastBossDead,
  setIsLastBossDead,
}: {
  player: Doc<"players">;
  isLastBossDead: boolean;
  setIsLastBossDead: (value: boolean) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const playerStatistics = useQuery(api.player_statistics.getPlayerStatistics, {
    playerId: player._id,
  });
  const router = useRouter();
  const playerCreationDate = new Date(player._creationTime);
  const today = new Date();
  const resetPlayerMutation = useMutation(api.players.resetPlayer);
  const date = differenceInDays(today, playerCreationDate);
  const handleResetPlayer = () => {
    setIsLastBossDead(false);
    resetPlayerMutation({ playerId: player._id });
    router.push("/main");
  };

  if (!playerStatistics) {
    return <>Loading</>;
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  return (
    <div
      className={
        isLastBossDead
          ? "z-50 absolute border h-3/4 w-3/4 border-green-500 bg-white dark:bg-black"
          : "hidden"
      }
    >
      <div className="flex flex-col justify-evenly items-center border w-full h-full relative">
        <div
          className={
            showDetails
              ? "hidden"
              : "flex flex-col gap-2 justify-center items-center"
          }
        >
          <h1 className="text-5xl text-green-600">Congratulations!</h1>
          <p className="text-3xl text-green-500">
            You have defeated the{" "}
            <span className="text-red-500">Evil Deity</span>!
          </p>
          <div className="flex flex-col justify-center items-center text-2xl">
            <div>
              <p className="text-4xl flex flex-col ">
                {player.playerName}{" "}
                <span className="border-b-4 border-gray-500 w-full self-center"></span>
              </p>
            </div>
            <p>
              You have played for:{" "}
              <span className="text-green-500">{date}</span> days
            </p>
            <p>
              Your level:{" "}
              <span className="text-orange-400">{player.level}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 text-2xl">
          <Button
            onClick={toggleDetails}
            className={showDetails ? "absolute bottom-16" : "mt-4 mb-2"}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
        </div>

        {showDetails && (
          <div className="flex w-full justify-evenly h-full  text-lg">
            <div className="mb-4 w-max border h-fit flex flex-col justify-start items-start gap-2 px-6 py-2 ">
              <h3 className="text-2xl mt-2 border-b-2 mb-2 border-red-500 w-full text-center text-yellow-400">
                Gold
              </h3>
              <p>
                Total Earned:{" "}
                <span className="text-yellow-500">
                  {playerStatistics.gold.totalEarned}
                </span>
              </p>
              <p>
                Total Spent:{" "}
                <span className="text-yellow-500">
                  {playerStatistics.gold.totalSpent}
                </span>
              </p>
            </div>

            <div className="mb-4 w-max border h-fit flex flex-col justify-start items-start gap-2 px-6 py-2 ">
              <h3 className="text-2xl mt-2 border-b-2 mb-2 border-red-500 w-full text-center">
                Monsters
              </h3>
              <p>
                Total:{" "}
                <span className="text-red-500">
                  {playerStatistics.monsters.totalMonstersDefeated}
                </span>
              </p>
              <p>
                Goblin: {playerStatistics.monsters.monsterSpecificStats.goblin}
              </p>
              <p>
                Werewolf:{" "}
                {playerStatistics.monsters.monsterSpecificStats.werewolf}
              </p>
              <p>
                Minotaur:{" "}
                {playerStatistics.monsters.monsterSpecificStats.minotaur}
              </p>
              <p>
                Vampire:{" "}
                {playerStatistics.monsters.monsterSpecificStats.vampire}
              </p>
              <p>Fox: {playerStatistics.monsters.monsterSpecificStats.fox}</p>
              <p>
                Priest: {playerStatistics.monsters.monsterSpecificStats.priest}
              </p>
              <p>
                Deity: {playerStatistics.monsters.monsterSpecificStats.diety}
              </p>
            </div>

            <div className="mb-4 w-max border h-fit flex flex-col justify-start items-start gap-2 px-6 py-2 ">
              <h3 className="text-2xl mt-2 border-b-2 mb-2 border-red-500 w-full text-center">
                Combat
              </h3>
              <p>
                Total Combat Tasks: {playerStatistics.combat.totalCombatTasks}
              </p>
              <p>
                Tasks Completed:{" "}
                {playerStatistics.combat.totalCombatTasksCompleted}
              </p>
              <p>
                Tasks Failed: {playerStatistics.combat.totalCombatTasksFailed}
              </p>
              <p>
                Total Damage Dealt:{" "}
                <span className="text-green-500">
                  {playerStatistics.combat.totalDamageDealt}
                </span>
              </p>
              <p>
                Total Damage Taken:{" "}
                <span className="text-red-500">
                  {playerStatistics.combat.totalDamageTaken}
                </span>
              </p>
            </div>

            <div className="mb-4 w-max border h-fit flex flex-col justify-start items-start gap-2 px-6 py-2 ">
              <h3 className="text-2xl mt-2 border-b-2 mb-2 border-red-500 w-full text-center">
                Brothel
              </h3>
              <p>
                Total Brothel Tasks:{" "}
                {playerStatistics.brothel.totalBrothelTasks}
              </p>
              <p>
                Tasks Completed:{" "}
                {playerStatistics.brothel.totalBrothelTasksCompleted}
              </p>
              <p>
                Tasks Failed: {playerStatistics.brothel.totalBrothelTasksFailed}
              </p>
            </div>

            <div className="mb-4 w-max border h-fit flex flex-col justify-start items-start gap-2 px-6 py-2 ">
              <h3 className="text-2xl mt-2 border-b-2 mb-2 border-red-500 w-full text-center">
                Potions
              </h3>
              <p>Total Bought: {playerStatistics.potions.totalPotionsBought}</p>
              <p>
                Healing Potions Bought:{" "}
                {playerStatistics.potions.totalHealingPotionsBought}
              </p>
              <p>
                Healing Hi-Potions Bought:{" "}
                {playerStatistics.potions.totalHealingHiPotionsBought}
              </p>
              <p>
                Reroll Potions Bought:{" "}
                {playerStatistics.potions.totalRerollPotionsBought}
              </p>
              <p>
                Special Potions Bought:{" "}
                {playerStatistics.potions.totalSpecialPotionsBought}
              </p>
              <p>
                Healing Potions Used:{" "}
                {playerStatistics.potions.totalHealingpotionsUsed}
              </p>
              <p>
                Healing Hi-Potions Used:{" "}
                {playerStatistics.potions.totalHealingHiPotionsUsed}
              </p>
              <p>
                Reroll Potions Used:{" "}
                {playerStatistics.potions.totalRerollPotionsUsed}
              </p>
              <p>
                Special Potions Used:{" "}
                {playerStatistics.potions.totalSpecialPotionsUsed}
              </p>
            </div>
          </div>
        )}
        <div>
          <Button onClick={handleResetPlayer} className="w-32 h-12 text-xl">
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}
