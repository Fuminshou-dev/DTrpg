"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { redirect } from "next/navigation";

export default function ServePage() {
  const [isLoading, setIsLoading] = useState(false);
  const updateGold = useMutation(api.customer_tasks.completedBrothelTask);
  const customer = useQuery(api.customers.getRandomCustomer);
  const task = useQuery(api.customer_tasks.getRandomTask);
  const playerName = localStorage.getItem("characterName");

  if (!playerName) {
    return "No character";
  }

  if (!customer || !task) {
    return (
      <div className="container mx-auto flex flex-col h-screen justify-center items-center">
        <LoadingSpinner className="size-24" />
      </div>
    );
  }
  let earnedGold = task.gold * customer.price;

  return (
    <div className="container mx-auto flex flex-col h-screen justify-center items-center gap-4">
      {!customer || !task ? (
        <div className="block">
          <LoadingSpinner className="size-24"></LoadingSpinner>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex justify-center items-center gap-2">
            <div>
              Your customer is:{" "}
              <span className="text-red-500 text-xl">
                {customer.customerType}
              </span>{" "}
              customer
              <div></div>
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
            <h1 className="">Task: {task.task}</h1>
            {customer.task !== 1 ? (
              <p>You also have to do the task {customer.task} times</p>
            ) : (
              <></>
            )}
          </div>
          <div className="border rounded-lg p-12 flex flex-col items-center justify-center gap-8">
            <h1 className="">
              You will get:{" "}
              <span className="text-yellow-400">{earnedGold}</span> Gold
            </h1>
          </div>
          <div className="flex flex-row gap-12 justify-center items-center">
            <Button
              variant={"default"}
              onClick={() => {
                updateGold({ player_name: playerName, money: earnedGold });
                redirect("/brothel");
              }}
            >
              Success
            </Button>
            <Button variant={"destructive"} asChild>
              <Link href={"/brothel"}>Failure</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
