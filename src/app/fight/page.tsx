"use client";
import PageControls from "@/components/Controls";
import ErrorDialog from "@/components/ErrorDialog";
import EvilDeityVictoryScreen from "@/components/EvilDeityVictoryScreen";
import FailDialog from "@/components/FailAttackDialog";
import { ItemsDialog } from "@/components/ItemsDialog";
import MonsterDeadDialog from "@/components/MonsterDeadDialog";
import PlayerDeadDialog from "@/components/PlayerDeadDialog";
import SuccessAttackDialog from "@/components/SuccessAttackDialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { itemTypes, UseRollPotionProps } from "../utils/constants";
import {
  calculateHealAmount,
  updatePlayerFightStatus,
} from "../utils/utilFunctions";

export default function MonsterFightPage() {
  const player = useQuery(api.players.getPlayer);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [showFailAttackDialog, setShowFailAttackDialog] = useState(false);
  const [showSuccessAttackDialog, setShowSuccessAttackDialog] = useState(false);
  const [isPlayerDead, setIsPlayedDead] = useState(false);
  const [isMonsterDead, setIsMonsterDead] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLastBossDead, setIsLastBossDead] = useState(true);
  const [showItems, setShowItems] = useState(false);
  const playerLevel = player?.level ?? 0;

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
  const updatePlayerPotionStatisticsMutation = useMutation(
    api.player_statistics.updatePlayerPotionStatistics
  );
  const updatePlayerCombatStatisticsMutation = useMutation(
    api.player_statistics.updatePlayerCombatStatistics
  );
  const updatePlayerMonstersStatisticsMutation = useMutation(
    api.player_statistics.updatePlayerMonstersStatistics
  );

  const updatePlayerGoldMutation = useMutation(
    api.player_statistics.updateGoldStatistics
  );

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

  const handleUseRerollPotion = async ({
    playerAtk,
    monsterId,
    monsterHp,
    playerHp,
    hasSpecialPotionEffect,
    itemType,
    updatePlayerFightStatusMutation,
  }: UseRollPotionProps) => {
    setIsButtonLoading(true);
    const result = await updatePlayerItemsAfterUseMutation({
      itemType: itemType,
    });

    if (!result.success) {
      setShowError(true);
      setErrorMsg(result.message);
      setTimeout(() => {
        setIsButtonLoading(false);
      }, 1000); // 1 second timeout
      return;
    }

    await updatePlayerPotionStatisticsMutation({
      toUpdate: {
        rerollPotionUsed: true,
      },
    });

    await updatePlayerFightStatus({
      hasSpecialPotionEffect,
      monster: currentMonster,
      playerStats: levelStats,
      finalDmg: 0,
      monsterAtk: 0,
      playerAtk: playerAtk,
      monsterId: monsterId,
      monsterHp: monsterHp,
      playerHp: playerHp,
      updatePlayerFightStatusMutation,
    });

    setTimeout(() => {
      setIsButtonLoading(false);
    }, 1000); // 1 second timeout
  };

  const handleUseHealingItem = async (
    playerCurrentHp: number,
    playerMaxHp: number,
    itemType: itemTypes
  ) => {
    setIsButtonLoading(true);
    const healAmount = calculateHealAmount({
      itemType,
      playerCurrentHp,
      playerMaxHp,
    });

    if (itemType === "reroll" || itemType === "special") {
      setIsButtonLoading(false);
      return;
    }

    if (playerCurrentHp === playerMaxHp) {
      setErrorMsg("You already have full health. Item wasn't used.");
      setShowError(true);
      setIsButtonLoading(false);
      return;
    }

    console.log(`Healed by ${healAmount}`);
    if (healAmount && healAmount > 0 && playerFightStatus) {
      const newPlayerHp = Math.min(playerCurrentHp + healAmount, playerMaxHp);
      await updatePlayerItemsAfterUseMutation({
        itemType: itemType,
      });

      if (itemType === "restore1") {
        await updatePlayerPotionStatisticsMutation({
          toUpdate: {
            healingPotionUsed: true,
          },
        });
      }

      if (itemType === "restore2") {
        await updatePlayerPotionStatisticsMutation({
          toUpdate: {
            healingHiPotionUsed: true,
          },
        });
      }

      await updatePlayerFightStatusMutation({
        fightStatus: {
          ...playerFightStatus,
          playerHp: newPlayerHp,
        },
      });
    } else {
      console.log("No healing performed");
    }

    setIsButtonLoading(false);
  };

  const itemsDialogProps = {
    setShowItems: setShowItems,
    showItems: showItems,
    player,
    playerHp: playerHp ?? 0,
    levelStats,
    monsterHp: monsterHp ?? 0,
    monsterId: monsterId ?? 0,
    playerAtk: playerAtk ?? 0,
    updatePlayerFightStatusMutation,
    handleUseHealingItem,
    handleUseRerollPotion,
    isButtonLoading,
  };

  return (
    <div className="container mx-auto min-h-screen justify-center items-center flex flex-col">
      {showItems && <ItemsDialog {...itemsDialogProps} />}
      {isLastBossDead && (
        <EvilDeityVictoryScreen
          player={player}
          isLastBossDead={isLastBossDead}
          setIsLastBossDead={setIsLastBossDead}
        />
      )}
      {showError && (
        <ErrorDialog
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          setShowError={setShowError}
          showError={showError}
        />
      )}
      {isPlayerDead && (
        <PlayerDeadDialog
          isPlayerDead={isPlayerDead}
          playerId={player._id}
          resetPlayer={resetPlayerMutation}
          setIsPlayerDead={setIsPlayedDead}
        />
      )}
      {showSuccessAttackDialog && (
        <SuccessAttackDialog
          updatePlayerGoldMutation={updatePlayerGoldMutation}
          updatePlayerMonstersStatisticsMutation={
            updatePlayerMonstersStatisticsMutation
          }
          updatePlayerCombatStatisticsMutation={
            updatePlayerCombatStatisticsMutation
          }
          setIsLastBossDead={setIsLastBossDead}
          hasSpecialPotionEffect={player.hasSpecialPotionEffect}
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
      )}
      {showFailAttackDialog && (
        <FailDialog
          updatePlayerCombatStatisticsMutation={
            updatePlayerCombatStatisticsMutation
          }
          setIsPlayerDead={setIsPlayedDead}
          hasSpecialPotionEffect={player.hasSpecialPotionEffect}
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
      )}
      {isMonsterDead && (
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
      )}
      <div
        className={
          isLastBossDead
            ? "hidden"
            : "flex flex-col justify-center items-center py-2 h-full w-full"
        }
      >
        <div className="mb-2">
          <PageControls doShowStatistics={false} />
        </div>
        <Button
          className="w-fit self-center"
          onClick={() => setShowItems(!showItems)}
        >
          Backpack
        </Button>

        <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full p-2 ">
          <div className="flex md:flex-row gap-6 max-w-4xl mx-auto w-full">
            <div
              id="monsterDiv"
              className="flex flex-col justify-center items-center border rounded-lg p-4 shadow-md w-full"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-rose-500 flex flex-col justify-center items-center">
                {currentMonster.monster_type}
                <p className="text-sm italic selection:text-yellow-50">
                  Lvl:{" "}
                  <span className="text-rose-500">
                    {currentMonster.showId + 1}
                  </span>
                </p>
              </h1>
              <div className="w-full max-w-md flex flex-col">
                <p className="text-end text-rose-500 mb-1 text-sm sm:text-base">
                  {monsterHp}/{currentMonster.hp}
                </p>
                <Progress
                  value={monsterHp && (monsterHp / currentMonster.hp) * 100}
                  indicatorcolor="bg-rose-500"
                />
              </div>
              <div className="mt-4 text-center text-sm sm:text-base">
                <p>
                  Damage:{" "}
                  <span className="text-rose-500">
                    {currentMonster.min_dmg}
                  </span>
                  -
                  <span className="text-rose-500">
                    {currentMonster.max_dmg}
                  </span>
                </p>
                <p>&nbsp;</p>
                <p className="py-4 sm:hidden">&nbsp;</p>
              </div>
            </div>

            <div
              id="playerDiv"
              className="flex flex-col justify-center items-center border rounded-lg p-4 shadow-md relative w-full"
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-green-500 flex flex-col justify-center items-center">
                {player.playerName}
                <p className="text-sm italic text-yellow-50">
                  Lvl: <span className="text-yellow-300">{player.level}</span>
                </p>
              </h1>
              <div className="w-full max-w-md flex flex-col">
                <p className="text-end text-green-500 mb-1">
                  {playerHp}/{levelStats?.hp}
                </p>
                <Progress
                  value={
                    playerHp && levelStats
                      ? (playerHp / levelStats.hp) * 100
                      : 0
                  }
                  indicatorcolor="bg-green-500"
                />
                {player.hasSpecialPotionEffect && (
                  <p
                    className="bg-gradient-to-r bg-clip-text  text-transparent 
            from-blue-500 via-purple-500 to-indigo-500 absolute top-1/4 sm:top-1/3 italic"
                  >
                    Special Potion Effect
                  </p>
                )}
              </div>
              <div className="mt-4 text-center flex flex-col">
                <p>
                  Base damage:{" "}
                  <span className="text-green-400"> {playerAtk}</span>
                </p>

                <p>
                  Possible attack multipliers:{" "}
                  <span className="text-red-500">0</span>,
                  <span className="text-blue-500">1</span>,
                  <span className="text-yellow-500">2</span>,
                  <span className="text-yellow-500">2</span>,
                  <span className="text-purple-500">3</span>,
                  <span className="text-green-500">4</span>
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
                {player.hasSpecialPotionEffect ? (
                  <span className="bg-gradient-to-r bg-clip-text text-transparent from-blue-500 via-purple-500 to-indigo-500">
                    {currentMonster.exp * 2}
                  </span>
                ) : (
                  <span className="text-orange-500">{currentMonster.exp}</span>
                )}
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
              className="w-full sm:w-1/3 md:w-1/4 lg:w-1/6 py-2"
              onClick={() => setShowSuccessAttackDialog(true)}
              disabled={isButtonLoading}
            >
              Success
            </Button>
            <Button
              variant={"destructive"}
              disabled={isButtonLoading}
              className="w-full sm:w-1/3 md:w-1/4 lg:w-1/6 py-2"
              onClick={() => setShowFailAttackDialog(true)}
            >
              Fail
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
