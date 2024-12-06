"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { redirect, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { api } from "../../../../../convex/_generated/api";

export default function ServePage() {
  const updateGold = useMutation(api.customer_tasks.completedBrothelTask);
  const customer = useQuery(api.customers.getRandomCustomer);
  const task = useQuery(api.customer_tasks.getRandomTask);
  const [showEarnedGold, setShowEarnedGold] = useState(false);
  const player = useQuery(api.players.getPlayer);
  const router = useRouter();

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
  let earnedGold = task.gold * customer.price;

  return (
    <div className="container mx-auto flex flex-col h-screen justify-center items-center gap-4">
      <AlertDialog defaultOpen={false} open={showEarnedGold}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl mb-2 border-b-2 p-2">
              Congratulations!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-2xl">
              You've earned{" "}
              <span className="text-yellow-400">{earnedGold}</span> gold from
              completing the task.
            </AlertDialogDescription>
            <AlertDialogDescription className="text-2xl">
              Your total gold is now:{" "}
              <span className="text-yellow-400">{player.gold}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                variant={"destructive"}
                className="bg-green-400 hover:bg-green-600"
                onClick={() => {
                  setShowEarnedGold(false);
                  router.replace("/brothel");
                }}
              >
                OK
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {!customer || !task ? (
        <div className="block">
          <LoadingSpinner className="size-24"></LoadingSpinner>
        </div>
      ) : (
        <div className={showEarnedGold ? "blur" : "flex flex-col gap-8"}>
          <div className="flex justify-center items-center gap-2">
            <div className="flex flex-col gap-4 border p-8 rounded-lg text-2xl">
              <div>
                Your customer is:{" "}
                <span className="text-red-500 text-xl">
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
                updateGold({ money: earnedGold });
                setShowEarnedGold(true);
              }}
            >
              Success
            </Button>
            <Button size={"lg"} variant={"destructive"} asChild>
              <Link href={"/brothel"}>Failure</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
