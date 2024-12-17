import { Doc } from "../../convex/_generated/dataModel";

interface PlayerStatisticsProps {
  playerStatistics: Doc<"player_statistics">;
  showDetails: boolean;
}

export default function PlayerStatistics({
  playerStatistics,
  showDetails,
}: PlayerStatisticsProps) {
  return (
    <div
      className={
        showDetails
          ? "flex flex-wrap xl:flex-nowrap justify-center gap-4 w-full h-full text-lg mt-8"
          : "hidden"
      }
    >
      <div className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 border flex flex-col justify-start items-start gap-2 px-6 py-2">
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

      <div className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 border  flex flex-col justify-start items-start gap-2 px-6 py-2">
        <h3 className="text-2xl mt-2 border-b-2 mb-2 border-red-500 w-full text-center">
          Monsters
        </h3>
        <p>
          Total:{" "}
          <span className="text-red-500">
            {playerStatistics.monsters.totalMonstersDefeated}
          </span>
        </p>
        <p>Goblin: {playerStatistics.monsters.monsterSpecificStats.goblin}</p>
        <p>
          Werewolf: {playerStatistics.monsters.monsterSpecificStats.werewolf}
        </p>
        <p>
          Minotaur: {playerStatistics.monsters.monsterSpecificStats.minotaur}
        </p>
        <p>Vampire: {playerStatistics.monsters.monsterSpecificStats.vampire}</p>
        <p>Fox: {playerStatistics.monsters.monsterSpecificStats.fox}</p>
        <p>Priest: {playerStatistics.monsters.monsterSpecificStats.priest}</p>
        <p>Deity: {playerStatistics.monsters.monsterSpecificStats.diety}</p>
      </div>

      <div className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 border  flex flex-col justify-start items-start gap-2 px-6 py-2">
        <h3 className="text-2xl mt-2 border-b-2 mb-2 border-red-500 w-full text-center">
          Combat
        </h3>
        <p>Total Combat Tasks: {playerStatistics.combat.totalCombatTasks}</p>
        <p>
          Tasks Completed: {playerStatistics.combat.totalCombatTasksCompleted}
        </p>
        <p>Tasks Failed: {playerStatistics.combat.totalCombatTasksFailed}</p>
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

      <div className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 border  flex flex-col justify-start items-start gap-2 px-6 py-2">
        <h3 className="text-2xl mt-2 border-b-2 mb-2 border-red-500 w-full text-center">
          Brothel
        </h3>
        <p>Total Brothel Tasks: {playerStatistics.brothel.totalBrothelTasks}</p>
        <p>
          Tasks Completed: {playerStatistics.brothel.totalBrothelTasksCompleted}
        </p>
        <p>Tasks Failed: {playerStatistics.brothel.totalBrothelTasksFailed}</p>
      </div>

      <div className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 border  flex flex-col justify-start items-start gap-2 px-6 py-2">
        <h3 className="text-2xl mt-2 border-b-2 mb-2 border-red-500 w-full text-center">
          Potions
        </h3>
        <p>Total Bought: {playerStatistics.potions.totalPotionsBought}</p>
        <div className="flex flex-col justify-center items-center gap-0 border-2 py-2 px-1 w-full">
          <h4 className="text-lg mt-2">Healing Potions</h4>
          <p>
            Bought: {playerStatistics.potions.totalHealingPotionsBought}
            {" | "}
            Used: {playerStatistics.potions.totalHealingPotionsUsed}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center gap-0 border-2 py-2 px-1 w-full">
          <h4 className="text-lg mt-2">Healing Hi-Potions</h4>
          <p>
            Bought: {playerStatistics.potions.totalHealingHiPotionsBought}
            {" | "}
            Used: {playerStatistics.potions.totalHealingHiPotionsUsed}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center  gap-0 border-2 py-2 px-1 w-full">
          <h4 className="text-lg mt-2">Reroll Potions</h4>
          <p className=" items-center">
            Bought: {playerStatistics.potions.totalRerollPotionsBought}
            {" | "}
            Used: {playerStatistics.potions.totalRerollPotionsUsed}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center gap-0 border-2 py-2 px-1 w-full">
          <h4 className="text-lg mt-2">Special Potions</h4>
          <p>
            Bought: {playerStatistics.potions.totalSpecialPotionsBought}
            {" | "}
            Used: {playerStatistics.potions.totalSpecialPotionsUsed}
          </p>
        </div>
      </div>
    </div>
  );
}
