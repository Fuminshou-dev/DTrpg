"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import PlayerStatistics from "./PlayerStatistics";
import { Button } from "./ui/button";

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

  const resetPlayerMutation = useMutation(api.players.resetPlayer);
  const resetPlayerStatisticsMutation = useMutation(
    api.player_statistics.resetPlayerStatistics
  );
  const handleResetPlayer = async () => {
    setIsLastBossDead(false);
    await resetPlayerMutation({ playerId: player._id });
    await resetPlayerStatisticsMutation();
    router.push("/main");
  };

  if (!playerStatistics) {
    return;
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  return (
    <div className="container mx-auto flex flex-col justify-center items-center min-h-screen p-4">
      <div
        className={
          isLastBossDead
            ? "w-full h-full border py-4 sm:py-8 lg:py-16  bg-white dark:bg-black"
            : "hidden"
        }
      >
        <div className="flex flex-col justify-evenly items-center w-full h-full relative gap-4">
          {!showDetails && (
            <div
              className={
                "flex flex-col gap-2 justify-center items-center text-center"
              }
            >
              <h1 className="text-3xl md:text-5xl text-green-500">
                Congratulations!
              </h1>
              <p className="text-lg md:text-3xl ">
                You have defeated the{" "}
                <span className="text-red-500 font-bold">Evil Deity</span>
              </p>
              <p className="text-lg md:text-3xl">You have saved the world</p>
            </div>
          )}
          <PlayerStatistics
            player={player}
            playerStatistics={playerStatistics}
            showDetails={showDetails}
          />
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Button onClick={handleResetPlayer}>Play Again</Button>
            <Button className="" onClick={toggleDetails}>
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
