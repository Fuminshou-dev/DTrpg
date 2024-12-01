"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function CreatePage() {
  const [characterName, setCharacterName] = useState("");
  const [characterPassword, setCharacterPassword] = useState("");
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="flex flex-col gap-4 w-1/2 justify-center items-center">
        <div>
          <p>Name of your character</p>
          <Input
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />
        </div>
        <div>
          <p>Password for your character</p>
          <Input
            value={characterPassword}
            onChange={(e) => setCharacterPassword(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            localStorage.setItem("characterName", characterName);
            localStorage.setItem("characterPassword", characterPassword);
            redirect("/create-character");
          }}
        >
          Create
        </Button>

        <div className="flex flex-col w-1/2 justify-center items-center">
          <h1>Already have a character?</h1>
          <Button
            onClick={() => {
              redirect("/login");
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
