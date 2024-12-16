"use client";
import FailDialog from "@/components/FailAttackDialog";
import SuccessAttackDialog from "@/components/SuccessAttackDialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import PlayerDeadDialog from "@/components/PlayerDeadDialog";
import MonsterDeadDialog from "@/components/MonsterDeadDialog";
import { itemOrder, itemTypes } from "../utils/constants";
import { calculateHealAmount } from "../utils/utilFunctions";
import ErrorDialog from "@/components/ErrorDialog";

// TODO: add item usage logic
// TODO: implement victory screen if monsterId = 6 ( EVIL DEITY )

export default function MonsterFightPage() {
  const player = useQuery(api.players.getPlayer);
  const updatePlayerAfterDefeatingAMonsterMutation = useMutation(
    api.players.updatePlayerAfterDefeatingAMonster
  );
  const updatePlayerFightStatusMutation = useMutation(
    api.players.updatePlayerFightStatus
  );
  const resetPlayerMutation = useMutation(api.players.resetPlayer);
  const updatePlayerItemsAfterUseMutation = useMutation(
    api.players.updatePlayerItemsAfterUse
  );
  const [showFailAttackDialog, setShowFailAttackDialog] = useState(false);
  const [showSuccessAttackDialog, setShowSuccessAttackDialog] = useState(false);
  const [isPlayerDead, setIsPlayedDead] = useState(false);
  const [isMonsterDead, setIsMonsterDead] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const playerLevel = player?.level ?? 0;

  const levelStats = useQuery(api.player_stats.getLevelStats, {
    level: playerLevel,
  });

  const nextLevelStats = useQuery(
    api.player_stats.getLevelStats,
    (player && { level: player.level + 1 }) ?? { level: 1 }
  );

  const playerFightStatus =
    player?.fightStatus !== "idle" ? player?.fightStatus : null;

  const {
    monsterId,
    playerHp,
    monsterHp,
    playerAtk,
    monsterAtk,
    atkMultiplier,
    finalDmg,
    currentTask,
  } = playerFightStatus || {};

  const currentMonster = useQuery(api.monsters.getMonster, {
    monsterId: monsterId ?? 0,
  });

  if (!player || !levelStats || !nextLevelStats) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner className="size-72" />
      </div>
    );
  }

  if (player.fightStatus === "idle") {
    return;
  }

  if (!currentMonster) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner className="size-72" />
      </div>
    );
  }

  const handleUseHealingItem = async (
    playerCurrentHp: number,
    playerMaxHp: number,
    itemType: itemTypes
  ) => {
    const healAmount = calculateHealAmount({
      itemType,
      playerCurrentHp,
      playerMaxHp,
    });

    if (itemType === "reroll" || itemType === "special") {
      return;
    }

    if (playerCurrentHp === playerMaxHp) {
      setErrorMsg("You already have full health. Item wasn't used.");
      setShowError(true);
      return;
    }

    console.log(`Healed by ${healAmount}`);
    if (healAmount && healAmount > 0 && playerFightStatus) {
      // Only heal if amount is positive
      const newPlayerHp = Math.min(playerCurrentHp + healAmount, playerMaxHp);

      await updatePlayerFightStatusMutation({
        fightStatus: {
          ...playerFightStatus,
          playerHp: newPlayerHp,
        },
      });
    } else {
      console.log("No healing performed");
    }
    await updatePlayerItemsAfterUseMutation({
      itemType: itemType,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
      <ErrorDialog
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        setShowError={setShowError}
        showError={showError}
      />
      <PlayerDeadDialog
        isPlayerDead={isPlayerDead}
        playerId={player._id}
        resetPlayer={resetPlayerMutation}
        setIsPlayerDead={setIsPlayedDead}
      />
      <SuccessAttackDialog
        setIsMonsterDead={setIsMonsterDead}
        setIsPlayerDead={setIsPlayedDead}
        finalDmg={finalDmg ?? 0}
        monster={currentMonster}
        monsterId={currentMonster.showId}
        playerAtk={playerAtk ?? 0}
        playerStats={levelStats}
        updatePlayerFightStatusMutation={updatePlayerFightStatusMutation}
        setShowSuccessAttackDialog={setShowSuccessAttackDialog}
        showSuccessAttackDialog={showSuccessAttackDialog}
        playerHp={playerHp ?? 0}
        monsterHp={monsterHp ?? 0}
        monsterAtk={monsterAtk ?? 0}
      />
      <FailDialog
        setIsPlayerDead={setIsPlayedDead}
        monster={currentMonster}
        monsterId={currentMonster.showId}
        playerAtk={playerAtk ?? 0}
        playerStats={levelStats}
        updatePlayerFightStatusMutation={updatePlayerFightStatusMutation}
        setShowFailAttackDialog={setShowFailAttackDialog}
        showFailAttackDialog={showFailAttackDialog}
        playerHp={playerHp ?? 0}
        monsterHp={monsterHp ?? 0}
        monsterAtk={monsterAtk ?? 0}
      />
      <MonsterDeadDialog
        nextLevelStats={nextLevelStats}
        levelStats={levelStats}
        player={player}
        isMonsterDead={isMonsterDead}
        monster={currentMonster}
        setIsMonsterDead={setIsMonsterDead}
        updatePlayerAfterDefeatingAMonster={
          updatePlayerAfterDefeatingAMonsterMutation
        }
      />
      <div className="fixed top-1/3 right-16 grid grid-cols-2 gap-2">
        {player.items
          .sort((a, b) => itemOrder.indexOf(a.type) - itemOrder.indexOf(b.type))
          .map((item) => (
            <div
              key={item.type}
              className="border p-4  rounded aspect-square h-full w-full flex flex-col justify-evenly items-center gap-2 relative"
            >
              <div className="absolute top-2 flex justify-center items-center right-2 p-1 border rounded-full w-5 h-5">
                <p className="text-center text-xs select-none">i</p>
              </div>
              <p>{item.itemName}</p>
              {item.amount === 0 ? (
                <p className="text-red-500">{item.amount}</p>
              ) : (
                <p className="text-green-500">{item.amount}</p>
              )}
              <Button
                onClick={() => {
                  if (playerHp && levelStats) {
                    handleUseHealingItem(playerHp, levelStats.hp, item.type);
                  }
                }}
                disabled={item.amount === 0 || item.type === "special"}
                size={"sm"}
              >
                Use
              </Button>
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto w-full">
          <div className="flex-1 flex flex-col justify-center items-center border rounded-lg p-4 shadow-md">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {currentMonster.monster_type}
            </h1>
            <div className="w-full max-w-md flex flex-col">
              <p className="text-end text-red-500 mb-1">
                {monsterHp}/{currentMonster.hp}
              </p>
              <Progress
                value={monsterHp && (monsterHp / currentMonster.hp) * 100}
                indicatorcolor="bg-red-500"
              />
            </div>
            <div className="mt-4 text-center">
              <p>
                Hp: <span className="text-red-500">{currentMonster.hp}</span>
              </p>
              <p>
                Damage:{" "}
                <span className="text-red-500">{currentMonster.min_dmg}</span>-
                <span className="text-red-500">{currentMonster.max_dmg}</span>
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center border rounded-lg p-4 shadow-md">
            <p className="text-2xl md:text-3xl font-bold mb-2">
              {player.playerName}
            </p>
            <div className="w-full max-w-md flex flex-col">
              <p className="text-end text-green-500 mb-1">
                {playerHp}/{levelStats?.hp}
              </p>
              <Progress
                value={
                  playerHp && levelStats ? (playerHp / levelStats.hp) * 100 : 0
                }
                indicatorcolor="bg-green-500"
              />
            </div>
            <div className="mt-4 text-center">
              <p>
                Atk Multiplier for this task:
                <span
                  className={
                    atkMultiplier && atkMultiplier > 1
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {" "}
                  {atkMultiplier}
                </span>
              </p>
              <p>
                Final damage dealt to monster:
                <span
                  className={
                    finalDmg && finalDmg > 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {" "}
                  {finalDmg}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center border rounded-lg p-4 shadow-md">
          <p className="text-xl md:text-2xl font-semibold mb-2 sm:mb-0">
            Rewards
          </p>
          <div className="text-lg sm:text-xl">
            <p>
              Gained EXP:{" "}
              <span className="text-orange-500">{currentMonster.exp}</span>
            </p>
            <p>
              Gained GOLD:{" "}
              <span className="text-yellow-400">{currentMonster.gold}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-4 gap-2 border rounded-lg shadow-md">
          <p className="text-xl md:text-2xl font-semibold">Task:</p>
          <div className="text-lg text-center">
            <p>{currentTask?.task_description}</p>
            <p className="mt-2">
              Maximum allowed break time:
              <span
                className={
                  currentTask?.break_time != 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {" "}
                {currentTask?.break_time}{" "}
              </span>
              seconds
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            className="px-6 py-2"
            onClick={() => setShowSuccessAttackDialog(true)}
          >
            Success
          </Button>
          <Button
            variant={"destructive"}
            className="px-6 py-2"
            onClick={() => setShowFailAttackDialog(true)}
          >
            Fail
          </Button>
        </div>
      </div>
    </div>
  );
}
