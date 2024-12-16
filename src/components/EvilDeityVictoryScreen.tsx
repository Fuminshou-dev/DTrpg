"use client";

import { differenceInDays } from "date-fns";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PlayerStatistics from "./PlayerStatistics";

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
        <PlayerStatistics
          playerStatistics={playerStatistics}
          showDetails={showDetails}
        />
        <div>
          <Button onClick={handleResetPlayer} className="w-32 h-12 text-xl">
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}
