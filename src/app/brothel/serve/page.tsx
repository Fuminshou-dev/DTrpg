"use client";

import { BrothelFailTaskDialog } from "@/components/BrothelFailTaskDialog";
import { BrothelSuccessTaskDialog } from "@/components/BrothelSuccessTaskDialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";

export default function ServePage() {
  const updateGoldMutation = useMutation(
    api.customer_tasks.completedBrothelTask
  );
  const customer = useQuery(api.customers.getRandomCustomer);
  const task = useQuery(api.customer_tasks.getRandomTask);
  const [showEarnedGold, setShowEarnedGold] = useState(false);
  const player = useQuery(api.players.getPlayer);
  const [showFailTaskDialog, setShowFailTaskDialog] = useState(false);
  const setBrothelCooldownMutation = useMutation(
    api.customers.setBrothelCooldown
  );
  const updateBrothelStatisticsMutation = useMutation(
    api.player_statistics.updateBrothelStatistics
  );
  const updateGoldStatisticsMutation = useMutation(
    api.player_statistics.updateGoldStatistics
  );

  if (!player) {
    return (
      <div className="container mx-auto flex flex-col h-screen justify-center items-center">
        <LoadingSpinner className="size-72" />
      </div>
    );
  }

  if (!customer || !task) {
    return (
      <div className="container mx-auto flex flex-col h-screen justify-center items-center">
        <LoadingSpinner className="size-72" />
      </div>
    );
  }
  const earnedGold = task.gold * customer.price;

  return (
    <div className="container mx-auto flex flex-col h-screen justify-center items-center gap-4">
      {!customer || !task ? (
        <div className="block">
          <LoadingSpinner className="size-24"></LoadingSpinner>
        </div>
      ) : (
        <div className={showEarnedGold ? "blur" : "flex flex-col gap-8"}>
          <BrothelSuccessTaskDialog
            updateGoldStatisticsMutation={updateGoldStatisticsMutation}
            updateBrothelStatisticsMutation={updateBrothelStatisticsMutation}
            updateGoldMutation={updateGoldMutation}
            earnedGold={earnedGold}
            player={player}
            setShowEarnedGold={setShowEarnedGold}
            showEarnedGold={showEarnedGold}
          />
          <BrothelFailTaskDialog
            updateBrothelStatisticsMutation={updateBrothelStatisticsMutation}
            setBrothelCooldownMutation={setBrothelCooldownMutation}
            showFailTaskDialog={showFailTaskDialog}
            setShowFailTaskDialog={setShowFailTaskDialog}
          />
          <div className="flex justify-center items-center gap-2">
            <div className="flex flex-col gap-4 border p-8 rounded-lg text-2xl">
              <div>
                Your customer is:{" "}
                <span className="text-red-500 text-2xl">
                  {customer.customerType}
                </span>{" "}
                customer
              </div>
              <p>
                He is going to make you do the task{" "}
                <span className="text-red-500">{customer.task}x</span> time
              </p>
              <p>
                And will pay you{" "}
                <span className="text-red-500">{customer.price}x</span> the gold
              </p>
            </div>
          </div>
          <div className="border rounded-lg p-12 flex flex-col items-center justify-center gap-8">
            <h1 className="text-2xl">Task: {task.task}</h1>
            {customer.task !== 1 ? (
              <p>You also have to do the task {customer.task} times</p>
            ) : (
              <></>
            )}
          </div>
          <div className="border rounded-lg p-12 flex flex-col items-center justify-center gap-8">
            <h1 className="text-2xl">
              You will get:{" "}
              <span className="text-yellow-400">{earnedGold}</span> Gold
            </h1>
          </div>
          <div className="flex flex-row gap-12 justify-center items-center">
            <Button
              size={"lg"}
              variant={"default"}
              onClick={() => {
                setShowEarnedGold(true);
              }}
            >
              Success
            </Button>
            <Button
              onClick={() => {
                setShowFailTaskDialog(true);
              }}
              size={"lg"}
              variant={"destructive"}
            >
              Fail
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
