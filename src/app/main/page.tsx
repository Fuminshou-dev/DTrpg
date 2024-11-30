"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { action } from "../../../convex/_generated/server";

const options = [
  {
    name: "Fight",
    redirect: "/",
  },
  {
    name: "Brothel",
    redirect: "/",
  },
  {
    name: "Shop",
    redirect: "/",
  },
  {
    name: "Leave",
    redirect: false,
  },
];

export default function Game() {
  const [leavePage, setLeavePage] = useState(false);
  return (
    <div className="container mx-auto h-screen flex flex-row justify-evenly items-center">
      <div>
        <div className="flex flex-col gap-4 justify-center items-center border rounded-lg p-4">
          <h2 className="text-3xl">Clarissa</h2>
          <Skeleton className="w-16 h-16 rounded-lg"></Skeleton>
          <p className="text-2xl">Lvl: lvl</p>
          <p className="text-2xl">Hp: hp</p>
          <p className="text-2xl">Attack: attack</p>
          <Progress value={50} className="" />
        </div>
        <div className="flex flex-col gap-2 justify-between items-center p-6">
          <h1>Backpack</h1>
          <div className="grid grid-cols-2 gap-4 border rounded-lg p-3">
            <div className="border rounded-lg p-8"></div>
            <div className="border rounded-lg p-8"></div>
            <div className="border rounded-lg p-8"></div>
            <div className="border rounded-lg p-8"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        {options.map((el) => (
          <Button
            key={el.name}
            className="border rounded-lg p-16 cursor-pointer text-3xl"
            variant={"ghost"}
            asChild
            onClick={() => {
              typeof el.redirect == "string"
                ? redirect(el.redirect)
                : setLeavePage(true);
            }}
          >
            <div>{el.name}</div>
          </Button>
        ))}
      </div>
      <div>
        <AlertDialog open={leavePage}>
          <AlertDialogContent className="">
            <AlertDialogHeader className="flex justify-center items-center">
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                After pressing confirm button you will leave the page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <Button
                  onClick={() => {
                    setLeavePage(false);
                    redirect("/");
                  }}
                >
                  Confirm
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
