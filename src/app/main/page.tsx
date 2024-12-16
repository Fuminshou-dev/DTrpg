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
import { cn } from "@/lib/utils";

import { useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
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
import ErrorDialog from "@/components/ErrorDialog";

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
  if (!cooldown) {
    return <>Loading...</>;
  }

  if (countdown > 0) {
    return (
      <Button
        className="border rounded-lg p-16 cursor-not-allowed text-3xl"
        variant={"ghost"}
        disabled
      >
        Cooldown: {countdown}s
      </Button>
    );
  }

  return (
    <Button
      className="border rounded-lg p-16 cursor-pointer text-3xl"
      asChild
      variant={"ghost"}
    >
      <Link href={"/brothel"}>Brothel</Link>
    </Button>
  );
}

export default function Game() {
  const [progressValue, setProgressValue] = useState(0);
  const [showItems, setShowItems] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
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
  }: {
    itemType: itemTypes;
    updatePlayerItemsAfterUseMutation: ReturnType<
      typeof useMutation<typeof api.players.updatePlayerItemsAfterUse>
    >;
    setShowError: (value: boolean) => void;
    setErrorMsg: (value: string) => void;
  }) => {
    if (player.hasSpecialPotionEffect) {
      setShowError(true);
      setErrorMsg("You already have a special potion effect!");
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

    await updatePlayerSpecialPotionEffectMutation({
      shouldPlayerHaveSpecialEffect: true,
    });
  };

  return (
    <div className="container mx-auto h-screen flex flex-row justify-center items-center">
      <ErrorDialog
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        setShowError={setShowError}
        showError={showError}
      />
      <div className={cn("flex flex-row", showItems ? "gap-0" : "gap-4")}>
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: showItems ? -100 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex flex-col gap-4 justify-center items-center border rounded-lg p-8"
        >
          <h2 className="text-3xl">{player.playerName}</h2>
          <Skeleton className="w-16 h-16 rounded-lg"></Skeleton>
          <p className="text-2xl">
            Lvl: <span className="font-bold text-blue-500">{player.level}</span>
          </p>
          <p className="text-2xl">
            Hp:{" "}
            <span className="font-bold text-green-500">{levelStats.hp}</span>
          </p>
          <p className="text-2xl">
            Attack:{" "}
            <span className="font-bold text-red-500">{levelStats.atk}</span>
          </p>
          <p className="text-2xl">
            Gold:{" "}
            <span className="font-bold text-yellow-500">{player.gold}</span>
          </p>
          <p className="text-2xl">
            Exp for next level:
            <span className="font-bold text-orange-600">
              {" "}
              {nextLevelStats.required_exp - player.current_exp}
            </span>
          </p>
          <Progress indicatorcolor="bg-green-500" value={progressValue} />
          <Button
            asChild
            onClick={() => {
              setShowItems(!showItems);
            }}
          >
            <p>Items</p>
          </Button>
        </motion.div>
        <div className="flex flex-col justify-center items-center gap-2">
          <AnimatePresence mode="wait">
            {showItems && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, exit: { duration: 0.15 } }}
                className="grid grid-cols-2 gap-4 justify-center items-center"
              >
                {itemOrder
                  .map(
                    (orderType) =>
                      player.items.find((item) => item.type === orderType)!
                  )
                  .map((item, index) => (
                    <motion.div
                      key={item.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{
                        duration: 0.15,
                        delay: index * 0.1,
                        exit: { duration: 0.15, delay: 0 },
                      }}
                      className="flex flex-col border justify-evenly items-center rounded-lg p-2 w-full h-full max-w-sm max-h-sm gap-2"
                    >
                      <h1 className="text-3xl">{item.itemName}</h1>
                      <Image
                        src={itemImages[item.type]}
                        alt={item.type}
                        width={60}
                      />
                      <div className="text-sm text-center">
                        {ItemDescriptions[item.type]}
                      </div>
                      <div className="text-2xl">
                        You have:{" "}
                        <span
                          className={
                            item.amount === 0
                              ? "text-red-500"
                              : "text-green-500"
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
                              <span tabIndex={0}>
                                <Button
                                  onClick={() =>
                                    handleUseSpecialPotion({
                                      itemType: "special",
                                      setErrorMsg,
                                      setShowError,
                                      updatePlayerItemsAfterUseMutation,
                                    })
                                  }
                                  disabled={item.amount <= 0}
                                >
                                  Use
                                </Button>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {item.amount <= 0 ? (
                                <p className="text-xl">
                                  You don't have any of this item to use
                                </p>
                              ) : (
                                <p className="text-xl">
                                  Use this item to double your experience and
                                  damage
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span tabIndex={0}>
                                <Button disabled>Use</Button>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xl">
                                You can only use this item during combat
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: showItems ? 100 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="grid grid-cols-1 gap-4 justify-center items-center"
        >
          <Button
            variant={"ghost"}
            className="border rounded-lg p-16 cursor-pointer text-3xl"
            asChild
          >
            <Link href={"/fight"}>Fight</Link>
          </Button>
          <BrothelButton
            getPlayerBrothelCooldownQuery={getPlayerBrothelCooldownQuery}
          />
          <Button
            variant={"ghost"}
            className="border rounded-lg p-16 cursor-pointer text-3xl"
            asChild
          >
            <Link href={"/shop"}>Shop</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
