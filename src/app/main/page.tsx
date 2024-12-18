"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import PageControls from "@/components/Controls";
import ErrorDialog from "@/components/ErrorDialog";
import { MainPageItemsDialog } from "@/components/MainPageItemsDialog";
import PlayerStatistics from "@/components/PlayerStatistics";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { UseSpecialPotionProps } from "../utils/constants";

function BrothelButton({
  getPlayerBrothelCooldownQuery,
}: {
  getPlayerBrothelCooldownQuery: ReturnType<
    typeof useQuery<typeof api.players.getPlayerBrothelCooldown>
  >;
}) {
  const cooldown = getPlayerBrothelCooldownQuery;
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!cooldown || Date.now() >= cooldown) return;

    setCountdown(Math.ceil((cooldown - Date.now()) / 1000));

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  if (countdown > 0) {
    return (
      <Button
        className="border rounded-lg p-8 md:p-16 cursor-not-allowed text-xl md:text-3xl w-full"
        variant={"ghost"}
        disabled
      >
        Cooldown: {countdown}s
      </Button>
    );
  }

  return (
    <Button
      className="border rounded-lg p-8 md:p-16 cursor-pointer text-xl md:text-3xl w-full"
      asChild
      variant={"ghost"}
    >
      <Link href={"/brothel"}>Brothel</Link>
    </Button>
  );
}

export default function MainPage() {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [showItems, setShowItems] = useState(false);
  const [showError, setShowError] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const player = useQuery(api.players.getPlayer);
  const levelStats = useQuery(
    api.player_stats.getLevelStats,
    player ? { level: player.level } : "skip"
  );
  const nextLevelStats = useQuery(
    api.player_stats.getLevelStats,
    player ? { level: player.level + 1 } : "skip"
  );

  const getPlayerBrothelCooldownQuery = useQuery(
    api.players.getPlayerBrothelCooldown,
    {
      userId: player?.userId ?? "skip",
    }
  );
  const updatePlayerItemsAfterUseMutation = useMutation(
    api.players.updatePlayerItemsAfterUse
  );

  const updatePlayerSpecialPotionEffectMutation = useMutation(
    api.players.updatePlayerSpecialPotionEffect
  );

  const updatePlayerPotionStatisticsMutation = useMutation(
    api.player_statistics.updatePlayerPotionStatistics
  );

  const playerStatistics = useQuery(
    api.player_statistics.getPlayerStatistics,
    player?._id ? { playerId: player._id } : "skip"
  );

  useEffect(() => {
    if (!player || !nextLevelStats) return;
    const required_exp = nextLevelStats.required_exp;
    const current_exp = player.current_exp;
    const progressPercentage = Math.floor((current_exp / required_exp) * 100);
    setProgressValue(progressPercentage);
  }, [player, nextLevelStats]);

  if (!player || !levelStats || !nextLevelStats) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner className="size-72"></LoadingSpinner>
      </div>
    );
  }

  const handleUseSpecialPotion = async ({
    itemType,
    updatePlayerItemsAfterUseMutation,
    setShowError,
    setErrorMsg,
    setIsButtonLoading,
    updatePlayerPotionStatisticsMutation,
  }: UseSpecialPotionProps) => {
    setIsButtonLoading(true);
    try {
      if (player.hasSpecialPotionEffect) {
        setErrorMsg("You already have a special potion effect!");
        setShowError(true);
        return;
      }

      const result = await updatePlayerItemsAfterUseMutation({
        itemType: itemType,
      });

      if (!result.success) {
        setShowError(true);
        setErrorMsg(result.message);
        return;
      }

      await updatePlayerPotionStatisticsMutation({
        toUpdate: {
          specialPotionUsed: true,
        },
      });

      await updatePlayerSpecialPotionEffectMutation({
        shouldPlayerHaveSpecialEffect: true,
      });
    } finally {
      setTimeout(() => {
        setIsButtonLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="container mx-auto ">
      <div className="md:h-screen w-full overflow-y-auto flex flex-col justify-center items-center mb-5 md:mb-0">
        <PageControls
          setShowDetails={setShowDetails}
          showDetails={showDetails}
          doShowStatistics
        />
        <ErrorDialog
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          setShowError={setShowError}
          showError={showError}
        />

        {playerStatistics && (
          <div className="w-full mb-8">
            <PlayerStatistics
              player={player}
              playerStatistics={playerStatistics}
              showDetails={showDetails}
            />
          </div>
        )}

        <div
          className={
            showDetails
              ? "hidden"
              : "flex flex-col md:flex-row gap-4 justify-center items-center"
          }
        >
          <div className="flex flex-col gap-4 justify-between items-center border rounded-lg p-4 md:p-6 h-full">
            <h2 className="text-2xl md:text-3xl text-center">
              {player.playerName}
              {player.hasSpecialPotionEffect && (
                <p
                  className="text-xs md:text-sm italic bg-gradient-to-r bg-clip-text  text-transparent 
            from-blue-500 via-purple-500 to-indigo-500"
                >
                  Special Potion Effect
                </p>
              )}
            </h2>

            <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-lg"></Skeleton>
            <p className="text-xl md:text-2xl">
              Lvl:{" "}
              <span className="font-bold text-blue-500">{player.level}</span>
            </p>
            <p className="text-xl md:text-2xl">
              Hp:{" "}
              <span className="font-bold text-green-500">{levelStats.hp}</span>
            </p>
            <p className="text-xl md:text-2xl">
              Attack:{" "}
              <span className="font-bold text-red-500">{levelStats.atk}</span>
            </p>
            <p className="text-xl md:text-2xl">
              Gold:{" "}
              <span className="font-bold text-yellow-500">{player.gold}</span>
            </p>
            <p className="text-xl md:text-2xl">
              Exp for next level:
              <span className="font-bold text-orange-600">
                {" "}
                {nextLevelStats.required_exp - player.current_exp}
              </span>
            </p>
            <Progress
              indicatorcolor="bg-green-500"
              value={progressValue}
              className="w-full"
            />
            <Button onClick={() => setShowItems(!showItems)}>Show Items</Button>
          </div>

          <div className="flex flex-col gap-4 justify-between items-center h-full">
            <Button
              variant={"ghost"}
              className="border rounded-lg p-8 md:p-16 cursor-pointer text-2xl md:text-3xl w-full"
              asChild
            >
              <Link href={"/fight"}>Fight</Link>
            </Button>
            <BrothelButton
              getPlayerBrothelCooldownQuery={getPlayerBrothelCooldownQuery}
            />
            <Button
              variant={"ghost"}
              className="border rounded-lg p-8 md:p-16 cursor-pointer text-2xl md:text-3xl w-full"
              asChild
            >
              <Link href={"/shop"}>Shop</Link>
            </Button>
          </div>

          <MainPageItemsDialog
            handleUseSpecialPotion={handleUseSpecialPotion}
            isButtonLoading={isButtonLoading}
            player={player}
            setErrorMsg={setErrorMsg}
            setIsButtonLoading={setIsButtonLoading}
            setShowError={setShowError}
            setShowItems={setShowItems}
            showItems={showItems}
            updatePlayerItemsAfterUseMutation={
              updatePlayerItemsAfterUseMutation
            }
            updatePlayerPotionStatisticsMutation={
              updatePlayerPotionStatisticsMutation
            }
          />
        </div>
      </div>
    </div>
  );
}
