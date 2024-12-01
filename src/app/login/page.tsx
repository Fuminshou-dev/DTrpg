"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function LoginPage() {
  const [characterName, setCharacterName] = useState("");
  const [characterPassword, setCharacterPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const player = useQuery(api.players.getPlayer, {
    playerName: characterName,
    password: characterPassword,
  });

  const handleLogin = () => {
    localStorage.setItem("characterName", characterName);
    localStorage.setItem("characterPassword", characterPassword);
    redirect("/confirm-character");
  };
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="flex flex-col gap-4 w-1/2 justify-center items-center">
        <div>
          <p>Name of your character</p>
          <Input
            value={characterName}
            onChange={(e) => {
              setCharacterName(e.target.value);
            }}
          />
        </div>
        <div>
          <p>Password for your character</p>
          <Input
            value={characterPassword}
            onChange={(e) => {
              setCharacterPassword(e.target.value);
            }}
          />
        </div>
        <Button onClick={handleLogin}>Login</Button>
        {isError ? <p className="text-red-500">Character wasn't found</p> : ""}

        <div className="flex flex-col w-1/2 justify-center items-center">
          <h1>Don't have a character?</h1>
          <Button
            onClick={() => {
              redirect("/create");
            }}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
