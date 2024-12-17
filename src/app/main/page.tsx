"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ErrorDialog from "@/components/ErrorDialog";
import PlayerStatistics from "@/components/PlayerStatistics";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import {
  ItemDescriptions,
  itemImages,
  itemOrder,
  itemTypes,
} from "../utils/constants";

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

export default function Game() {
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
  }: {
    itemType: itemTypes;
    updatePlayerItemsAfterUseMutation: ReturnType<
      typeof useMutation<typeof api.players.updatePlayerItemsAfterUse>
    >;
    updatePlayerPotionStatisticsMutation: ReturnType<
      typeof useMutation<
        typeof api.player_statistics.updatePlayerPotionStatistics
      >
    >;
    setShowError: (value: boolean) => void;
    setErrorMsg: (value: string) => void;
    setIsButtonLoading: (value: boolean) => void;
  }) => {
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
      setIsButtonLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen md:h-screen w-screen overflow-y-auto  flex flex-col justify-center items-center ">
      <Button
        className="fixed top-4 left-48 md:top-6 md:left-48 z-10"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide Statistics" : "Show Statistics"}
      </Button>

      {playerStatistics && (
        <div className="w-full mb-8">
          <PlayerStatistics
            playerStatistics={playerStatistics}
            showDetails={showDetails}
          />
        </div>
      )}

      <ErrorDialog
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        setShowError={setShowError}
        showError={showError}
      />

      <div
        className={
          showDetails
            ? "hidden"
            : "flex flex-col md:flex-row gap-4 justify-center items-center"
        }
      >
        <div className="flex flex-col gap-4 justify-between items-center border rounded-lg p-4 md:p-6 h-full">
          <h2 className="text-2xl md:text-3xl">
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
            Lvl: <span className="font-bold text-blue-500">{player.level}</span>
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
          <Button onClick={() => setShowItems(!showItems)}>
            {showItems ? "Hide Items" : "Show Items"}
          </Button>
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

        {showItems && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-evenly items-center w-full h-full">
            {itemOrder
              .map(
                (orderType) =>
                  player.items.find((item) => item.type === orderType)!
              )
              .map((item) => (
                <div
                  key={item.type}
                  className="flex flex-col border items-center rounded-lg h-full p-2 sm:p-4 gap-2"
                >
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
                    {item.itemName}
                  </h1>
                  <Image
                    src={itemImages[item.type]}
                    alt={item.type}
                    width={40}
                    height={40}
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
                  />
                  <div className="text-xs sm:text-sm md:text-base text-center">
                    {ItemDescriptions[item.type]}
                  </div>
                  <div className="text-sm sm:text-base md:text-lg">
                    You have:{" "}
                    <span
                      className={
                        item.amount === 0 ? "text-red-500" : "text-green-500"
                      }
                    >
                      {item.amount}
                    </span>{" "}
                    of this item
                  </div>
                  {item.type === "special" ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() =>
                              handleUseSpecialPotion({
                                setIsButtonLoading,
                                updatePlayerPotionStatisticsMutation,
                                itemType: "special",
                                setErrorMsg,
                                setShowError,
                                updatePlayerItemsAfterUseMutation,
                              })
                            }
                            disabled={item.amount <= 0 || isButtonLoading}
                            className="text-xs sm:text-sm md:text-base"
                          >
                            Use
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {item.amount <= 0 ? (
                            <p className="text-xs sm:text-sm md:text-base">
                              You don't have any of this item to use
                            </p>
                          ) : (
                            <p className="text-xs sm:text-sm md:text-base">
                              Use this item to double your experience and damage
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            disabled
                            className="text-xs sm:text-sm md:text-base"
                          >
                            Use
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs sm:text-sm md:text-base">
                            You can only use this item during combat
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
