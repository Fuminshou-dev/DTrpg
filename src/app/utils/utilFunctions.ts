import { Doc } from "../../../convex/_generated/dataModel";
import { ATK_MULTIPLIER } from "./constants";

export const getRandomTask = ({ monster }: { monster: Doc<"monsters"> }) => {
  const randomTask =
    monster.tasks[Math.floor(Math.random() * monster.tasks.length)];
  return randomTask;
};

export const getRandomAtkMultiplier = () => {
  return ATK_MULTIPLIER[Math.floor(Math.random() * ATK_MULTIPLIER.length)];
};

export const calculateFinalDmg = (playerAtk: number, atkMultiplier: number) => {
  const finalDmg = Math.floor(playerAtk * atkMultiplier);
  return finalDmg;
};

export const calculateMonsterDmg = ({
  monster,
}: {
  monster: Doc<"monsters">;
}) => {
  // get random number between monster.min_dmg and monster.max_dmg
  const monsterDmg = Math.floor(
    Math.random() * (monster.max_dmg - monster.min_dmg + 1) + monster.min_dmg
  );
  return monsterDmg;
};
