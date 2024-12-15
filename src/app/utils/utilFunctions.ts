import { useMutation } from "convex/react";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { ATK_MULTIPLIER } from "./constants";
import { api } from "../../../convex/_generated/api";

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

export async function updatePlayerFightStatus({
  updatePlayerFightStatusMutation,
  playerStats,
  monster,
  playerAtk,
  monsterId,
  updatePlayerAfterDefeatingAMonster,
  monsterHp,
  playerHp,
  playerId,
  resetPlayerMutation,
  monsterAtk,
  finalDmg,
}: {
  updatePlayerFightStatusMutation: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerFightStatus>
  >;
  resetPlayerMutation: ReturnType<
    typeof useMutation<typeof api.players.resetPlayer>
  >;
  playerStats: Doc<"player_stats">;
  monster: Doc<"monsters">;
  playerAtk: number;
  updatePlayerAfterDefeatingAMonster: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerAfterDefeatingAMonster>
  >;
  monsterId: number;
  monsterHp: number;
  playerId: Id<"players">;
  playerHp: number;
  finalDmg: number;
  monsterAtk: number;
}) {
  const newAtkMultipler = getRandomAtkMultiplier();
  const newRandomTask = getRandomTask({ monster });
  const newFinalDmg = calculateFinalDmg(playerStats.atk, newAtkMultipler);
  const newMonsterAtk = calculateMonsterDmg({ monster });

  // check if the player is dead

  if (playerHp - monsterAtk <= 0) {
    return await resetPlayerMutation({ playerId });
  }

  // check if monster is dead

  if (monsterHp - finalDmg <= 0) {
    await updatePlayerFightStatusMutation({
      fightStatus: "idle",
    });
    await updatePlayerAfterDefeatingAMonster({
      earnedExp: monster.exp,
      earnedGold: monster.gold,
      monsterId: monsterId,
    });
    return;
  }

  await updatePlayerFightStatusMutation({
    fightStatus: {
      status: "fighting",
      monsterHp: monsterHp - finalDmg,
      playerHp: playerHp - monsterAtk,
      monsterId: monsterId,
      atkMultiplier: newAtkMultipler,
      currentTask: newRandomTask,
      finalDmg: newFinalDmg,
      monsterAtk: newMonsterAtk,
      playerAtk: playerAtk,
    },
  });
}
