"use client";

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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function CharacterCreation() {
  const [characterName, setCharacterName] = useState("");
  const [characterCreated, setCharactedCreated] = useState(false);
  return (
    <div>
      <div>
        <AlertDialog open={!characterCreated}>
          <AlertDialogContent className="">
            <AlertDialogHeader className="flex justify-center items-center">
              <AlertDialogTitle>
                Please enter the name of your character.
              </AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  required
                  placeholder="Name of your character..."
                  onChange={(e) => setCharacterName(e.target.value)}
                ></Input>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (characterName == "") {
                      alert("No character name");
                      return;
                    }
                    setCharactedCreated(true);
                  }}
                >
                  Confirm
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div
        className={
          characterCreated
            ? "flex flex-col justify-center items-center h-screen gap-4"
            : "hidden"
        }
      >
        <h1>Your Character</h1>
        <div className="border rounded-lg p-8 flex flex-col items-center gap-4">
          {characterName}
          <Skeleton className="h-12 w-12 rounded-full" />
          <p>Lvl: 1</p>
          <p>Hp: 50</p>
          <p>ATK: 10</p>
          <p>Exp needed for next lvl: 20</p>
          <Button
            onClick={() => {
              setCharacterName("");
              setCharactedCreated(false);
            }}
          >
            Change
          </Button>
        </div>
        <Button
          asChild
          onClick={() =>
            alert("run a fucntion to add the character to convex db")
          }
        >
          <Link href={"/main"}>Let's go</Link>
        </Button>
      </div>
    </div>
  );
}
