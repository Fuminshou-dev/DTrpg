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
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function CharacterCreation() {
  const [characterName, setCharacterName] = useState("");
  const [characterPassword, setCharacterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [characterCreated, setCharactedCreated] = useState(false);
  const maskedPassword = "*".repeat(characterPassword.length);
  const createNewCharacter = useMutation(api.players.createPlayer);
  return (
    <div>
      <div>
        <AlertDialog open={!characterCreated}>
          <AlertDialogContent className="">
            <AlertDialogHeader className="flex justify-center items-center">
              <AlertDialogTitle>
                Please enter the name and password for your character.
              </AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  required
                  placeholder="Name of your character..."
                  onChange={(e) => setCharacterName(e.target.value)}
                ></Input>
                <Input
                  required
                  placeholder="Password for your character..."
                  onChange={(e) => setCharacterPassword(e.target.value)}
                ></Input>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (characterName == "" || characterPassword == "") {
                      alert("No character name or password");
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
          <div className="flex flex-col gap-4 text-2xl">
            <p>{characterName}</p>
            <div className="flex flex-row">
              {showPassword ? (
                <p>{characterPassword}</p>
              ) : (
                <p>{maskedPassword}</p>
              )}
              {showPassword ? (
                <Button
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  Hide password
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  Show password
                </Button>
              )}
            </div>
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
          <p>Lvl: 1</p>
          <p>Hp: 50</p>
          <p>ATK: 10</p>
          <p>Gold: 0</p>
          <p>Current exp: 0</p>
          <p>No items in backpack</p>
          <Button
            onClick={() => {
              setCharacterName("");
              setCharactedCreated(false);
              setCharacterPassword("");
              setShowPassword(false);
            }}
          >
            Change
          </Button>
        </div>
        <Button
          asChild
          onClick={() => {
            createNewCharacter({
              player_name: characterName,
              password: characterPassword,
            });
            localStorage.setItem("characterName", characterName);
          }}
        >
          <Link href={"/main"}>Let's go</Link>
        </Button>
      </div>
    </div>
  );
}
