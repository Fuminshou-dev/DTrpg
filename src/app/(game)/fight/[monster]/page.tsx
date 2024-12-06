"use client";

import { ATK_MULTIPLIER } from "@/app/utils/constants";
import {
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

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

const calculateProgressBarValue = (currentHp: number, maxHp: number) => {
  return (currentHp / maxHp) * 100;
};

function RewardsSection({
  currentMonster,
}: {
  currentMonster: Doc<"monsters">;
}) {
  return (
    <div className="flex flex-row justify-evenly items-center border p-4 rounded-lg w-full text-2xl h-fit">
      <div className="">Rewards for defeating</div>
      <div className="flex flex-col gap-4 justify-center items-center">
        <div>
          Gained GOLD:{" "}
          <span className="text-yellow-400">{currentMonster.gold}</span>
        </div>
        <div>
          Gained EXP:{" "}
          <span className="text-orange-500">{currentMonster.exp}</span>
        </div>
      </div>
    </div>
  );
}

function MonsterSection({
  monsterCurrentHp,
  currentMonster,
}: {
  monsterCurrentHp: number;
  currentMonster: Doc<"monsters">;
}) {
  return (
    <div className="flex flex-col justify-center items-center border p-4 rounded-lg w-full gap-4">
      <div className="text-4xl">
        <span className="text-red-500">{currentMonster.monster_type}</span>
      </div>
      <div className="text-3xl w-full">
        <div className="text-end">
          <span className="text-red-500">
            {monsterCurrentHp}/{currentMonster.hp}
          </span>
        </div>
        <Progress
          value={calculateProgressBarValue(monsterCurrentHp, currentMonster.hp)}
          indicatorcolor="bg-red-500"
          className="w-full"
        />
      </div>
      <div className="text-2xl">
        Monster DMG:{" "}
        <span className="text-red-500">{currentMonster.min_dmg}</span>-
        <span className="text-red-500">{currentMonster.max_dmg}</span>
      </div>
    </div>
  );
}

function PlayerSection({
  player,
  playerCurrentHp,
  playerStats,
  playerAtk,
  atkMultiplier,
  finalDmg,
}: {
  player: Doc<"players">;
  playerCurrentHp: number;
  playerStats: any;
  playerAtk: number;
  atkMultiplier: number;
  finalDmg: number;
}) {
  return (
    <div className="flex flex-col justify-center items-center border p-4 rounded-lg text-2xl w-full">
      <div className="text-yellow-500">{player.playerName}</div>
      <div className="text-3xl w-full">
        <div className="text-end">
          <span className="text-green-500">
            {playerCurrentHp}/{playerStats.hp}
          </span>
        </div>
        <Progress
          value={calculateProgressBarValue(playerCurrentHp, playerStats.hp)}
          indicatorcolor="bg-green-500"
          className="w-full"
        />
      </div>
      <div className="flex flex-col justify-center items-center border p-4 w-full m-5">
        <div>Player attack: {playerAtk}</div>
        <div>
          Attack multiplier:{" "}
          {atkMultiplier !== 0 ? (
            <span className="text-green-500">{atkMultiplier}</span>
          ) : (
            <span className="text-red-500">{atkMultiplier}</span>
          )}
        </div>
        <div>
          Final damage:{" "}
          {finalDmg !== 0 ? (
            <span className="text-green-500">{finalDmg}</span>
          ) : (
            <span className="text-red-500">{finalDmg}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskSection({
  currentTask,
}: {
  currentTask: {
    break_time: number;
    task_description: string;
  };
}) {
  return (
    <div className="flex flex-col justify-center items-center border p-4 rounded-lg w-full text-2xl">
      <div className="text-3xl">Task:</div>
      <div>
        <div>{currentTask.task_description}</div>
        {currentTask.break_time !== 0 ? (
          <div>
            <p className="flex flex-row gap-2 italic">
              Maximum allowed break time:{" "}
              <span className="text-green-500">
                {currentTask.break_time} seconds
              </span>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SuccessAttackDialog({
  showAttackDialog,
  setShowAttackDialog,
  monsterCurrentHp,
  monsterAtk,
  finalDmg,
  handleAttack,
  playerCurrentHp,
}: {
  showAttackDialog: boolean;
  setShowAttackDialog: (value: boolean) => void;
  monsterCurrentHp: number;
  monsterAtk: number;
  finalDmg: number;
  handleAttack: () => void;
  playerCurrentHp: number;
}) {
  return (
    <AlertDialog open={showAttackDialog}>
      <AlertDialogContent className="text-2xl">
        <AlertDialogTitle>Congratulations!</AlertDialogTitle>
        <AlertDialogHeader>
          <p>
            You've dealt <span className="text-green-500"> {finalDmg} </span>{" "}
            damage to the monster.
          </p>
          <p>
            Monster HP:
            <span className="text-red-500">
              {" "}
              {monsterCurrentHp - finalDmg}{" "}
            </span>
          </p>
          <p>
            Now monster deals
            <span className="text-red-500"> {monsterAtk} </span>
            damage to you.
          </p>
          <p>
            Your HP:
            <span className="text-green-500">
              {" "}
              {playerCurrentHp - monsterAtk}{" "}
            </span>
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button
              onClick={() => {
                setShowAttackDialog(false);
                handleAttack();
              }}
            >
              Close
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
function FailAttackDialog({
  showFailAttackDialog,
  setShowFailAttackDialog,
  monsterAtk,
  handleFailAttack,
  playerCurrentHp,
}: {
  showFailAttackDialog: boolean;
  setShowFailAttackDialog: (value: boolean) => void;
  monsterAtk: number;
  handleFailAttack: () => void;
  playerCurrentHp: number;
}) {
  return (
    <AlertDialog open={showFailAttackDialog}>
      <AlertDialogContent className="text-2xl">
        <AlertDialogTitle>You are a failure!</AlertDialogTitle>
        <AlertDialogHeader>
          <p>You've deal no damage to the monster.</p>
          <p>
            Now monster deals
            <span className="text-red-500"> {monsterAtk} </span>
            damage to you.
          </p>
          <p>
            Your current HP:
            <span className="text-red-500">
              {" "}
              {playerCurrentHp - monsterAtk}{" "}
            </span>
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button
              onClick={() => {
                setShowFailAttackDialog(false);
                handleFailAttack();
              }}
            >
              Close
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function FightButtons({
  handleAttack,
  handleFailAttack,
}: {
  handleAttack: () => void;
  handleFailAttack: () => void;
}) {
  return (
    <div className="flex flex-row justify-evenly items-center border p-4 rounded-lg w-full">
      <Button onClick={handleAttack}>success</Button>
      <Button onClick={handleFailAttack} variant={"destructive"}>
        failure
      </Button>
    </div>
  );
}

export default function MonsterFightPage() {
  const params = useParams();
  const router = useRouter();
  const [showAttackDialog, setShowAttackDialog] = useState(false);
  const [showFailAttackDialog, setShowFailAttackDialog] = useState(false);

  // Monster
  const monsterId = parseInt(params.monster as string);
  const currentMonster = useQuery(api.monsters.getMonster, { monsterId });
  const [monsterCurrentHp, setMonsterCurrentHp] = useState(0);
  const [monsterAtk, setMonsterAtk] = useState(0);

  // Player
  const player = useQuery(api.players.getPlayer);
  const playerStats = useQuery(api.player_stats.getLevelStats, {
    level: player?.level ?? 1,
  });
  const newPlayerStats = useMutation(
    api.players.updatePlayerAfterSuccesfullAttack
  );
  const resetPlayer = useMutation(api.players.resetPlayer);
  const updatePlayerFightStatus = useMutation(
    api.players.updatePlayerFightStatus
  );
  const [playerCurrentHp, setPlayerCurrentHp] = useState(0);
  const [playerAtk, setPlayerAtk] = useState(0);
  const [atkMultiplier, setAtkMultiplier] = useState(0);
  const [finalDmg, setFinalDmg] = useState(0);
  const [currentTask, setCurrentTask] = useState({
    break_time: 0,
    task_description: "",
  });

  const updatePlayer = useMutation(
    api.players.updatePlayerAfterSuccesfullAttack
  );

  // TODO: refactor this pages to /choose-monster and /fight to handle fightState from DB.

  // useEffect(() => {
  //   if (currentMonster && player && playerStats) {
  //     if (
  //       player.fightStatus &&
  //       typeof player.fightStatus === "object" &&
  //       player.fightStatus.status === "fighting"
  //     ) {
  //       // Player is already in a fight, set states from fightStatus
  //       setMonsterCurrentHp(player.fightStatus.monsterHp);
  //       setMonsterAtk(player.fightStatus.monsterAtk);
  //       setPlayerCurrentHp(player.fightStatus.playerHp);
  //       setPlayerAtk(player.fightStatus.playerAtk);
  //       setAtkMultiplier(player.fightStatus.atkMultiplier);
  //       setFinalDmg(player.fightStatus.finalDmg);
  //       setCurrentTask(player.fightStatus.currentTask);
  //     } else {
  //       // Player is not in a fight, initialize new fight
  //       const newMonsterAtk = calculateMonsterDmg({ monster: currentMonster });
  //       const newAtkMultiplier = getRandomAtkMultiplier();
  //       const newFinalDmg = calculateFinalDmg(
  //         playerStats.atk,
  //         newAtkMultiplier
  //       );
  //       const randomTask = getRandomTask({ monster: currentMonster });

  //       setMonsterCurrentHp(currentMonster.hp);
  //       setMonsterAtk(newMonsterAtk);
  //       setPlayerCurrentHp(playerStats.hp);
  //       setPlayerAtk(playerStats.atk);
  //       setAtkMultiplier(newAtkMultiplier);
  //       setFinalDmg(newFinalDmg);
  //       setCurrentTask(randomTask);

  //       // Update player's fight status
  //       updatePlayerFightStatus({
  //         fightStatus: {
  //           status: "fighting",
  //           monsterId: currentMonster.showId,
  //           atkMultiplier: newAtkMultiplier,
  //           currentTask: randomTask,
  //           monsterHp: currentMonster.hp,
  //           playerHp: playerStats.hp,
  //           playerAtk: playerStats.atk,
  //           finalDmg: newFinalDmg,
  //           monsterAtk: newMonsterAtk,
  //         },
  //       });
  //     }
  //   }
  // }, [currentMonster, player, playerStats]);

  useEffect(() => {
    if (!currentMonster || !playerStats || !player) return;
    // if (player?.currentMonster! < monsterId) {
    //   router.push("/login");
    // }

    if (player?.currentMonster >= monsterId) {
      setMonsterCurrentHp(currentMonster.hp);
      const monsterAtk = calculateMonsterDmg({ monster: currentMonster });
      setMonsterAtk(monsterAtk);
      setPlayerCurrentHp(playerStats.hp);
      setPlayerAtk(playerStats.atk);
      const newAtkMultiplier = getRandomAtkMultiplier();
      setAtkMultiplier(newAtkMultiplier);
      setFinalDmg(calculateFinalDmg(playerStats.atk, newAtkMultiplier));
      const randomTask = getRandomTask({ monster: currentMonster });
      setCurrentTask(randomTask);
    }
  }, [currentMonster, playerStats, player, monsterId, router]);

  if (!currentMonster || !player || !playerStats) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner className="size-72" />
      </div>
    );
  }
  // Attack functions
  const handleShowAtkDialog = () => {
    setShowAttackDialog(true);
  };

  const handleAttack = async () => {
    const newMonsterHp = monsterCurrentHp - finalDmg;
    setMonsterCurrentHp(newMonsterHp);

    //win logic
    if (newMonsterHp <= 0) {
      const newPlayer = await newPlayerStats({
        earnedExp: currentMonster.exp,
        earnedGold: currentMonster.gold,
        monsterId: currentMonster.showId,
      });
      alert(`${newPlayer.current_exp}, player level: ${newPlayer.level}`);
      // TODO: show alert dialog with new gold and exp, probably have to do handleShowDefeatedResultDialog and handleDefeatedResult again

      router.push("/fight");
    }

    const newPlayerHp = playerCurrentHp - monsterAtk;
    setPlayerCurrentHp(newPlayerHp);

    //loss logic
    if (newPlayerHp <= 0) {
      alert("You've been defeated!");
      // TODO: show alert dialog when we reset the playe.r
      resetPlayer({
        playerId: player._id,
      });
      router.push("/main");
    }

    const newMonsterAtk = calculateMonsterDmg({ monster: currentMonster });
    setMonsterAtk(newMonsterAtk);
    const newAtkMultiplier = getRandomAtkMultiplier();
    setAtkMultiplier(newAtkMultiplier);
    const newFinalDmg = calculateFinalDmg(playerStats.atk, newAtkMultiplier);
    setFinalDmg(newFinalDmg);
    const newRandomTask = getRandomTask({ monster: currentMonster });
    setCurrentTask(newRandomTask);
    setShowAttackDialog(false);
  };

  // Fail attack functions

  const handleShowFailAttackDialog = () => {
    setShowFailAttackDialog(true);
  };

  const handleFailAttack = () => {
    const newPlayerHp = playerCurrentHp - monsterAtk;
    setPlayerCurrentHp(newPlayerHp);
    if (newPlayerHp <= 0) {
      alert("You've been defeated!");
      // TODO: handle death logic
    }
    const newMonsterAtk = calculateMonsterDmg({ monster: currentMonster });
    setMonsterAtk(newMonsterAtk);
    const newAtkMultiplier = getRandomAtkMultiplier();
    setAtkMultiplier(newAtkMultiplier);
    const newFinalDmg = calculateFinalDmg(playerStats.atk, newAtkMultiplier);
    setFinalDmg(newFinalDmg);
    const newRandomTask = getRandomTask({ monster: currentMonster });
    setCurrentTask(newRandomTask);
    setShowFailAttackDialog(false);
  };

  return (
    <div className="container mx-auto flex flex-col h-screen justify-center items-center gap-8">
      <RewardsSection currentMonster={currentMonster} />
      <MonsterSection
        monsterCurrentHp={monsterCurrentHp}
        currentMonster={currentMonster}
      />
      <PlayerSection
        playerCurrentHp={playerCurrentHp}
        player={player}
        playerStats={playerStats}
        playerAtk={playerAtk}
        atkMultiplier={atkMultiplier}
        finalDmg={finalDmg}
      />
      <TaskSection currentTask={currentTask} />
      <FightButtons
        handleAttack={handleShowAtkDialog}
        handleFailAttack={handleShowFailAttackDialog}
      />
      <SuccessAttackDialog
        playerCurrentHp={playerCurrentHp}
        showAttackDialog={showAttackDialog}
        setShowAttackDialog={setShowAttackDialog}
        monsterCurrentHp={monsterCurrentHp}
        monsterAtk={monsterAtk}
        finalDmg={finalDmg}
        handleAttack={handleAttack}
      />
      <FailAttackDialog
        playerCurrentHp={playerCurrentHp}
        showFailAttackDialog={showFailAttackDialog}
        setShowFailAttackDialog={setShowFailAttackDialog}
        monsterAtk={monsterAtk}
        handleFailAttack={handleFailAttack}
      />
    </div>
  );
}
