"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Unauthenticated, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const createPlayer = useMutation(api.players.createPlayer);

  if (isSignedIn || user) {
    const playerName = user.username;
    if (!playerName) {
      throw new Error("no playername");
    }
    const player = createPlayer({ playerName });
    console.log("Created player:", player);
    router.push("/main");
  }

  // Show login/signup buttons if not signed in
  return (
    <div className="flex flex-col gap-8 container mx-auto h-screen justify-center items-center">
      <h1 className="text-5xl font-bold">
        Please, log in or create an account (character){" "}
      </h1>
      <Unauthenticated>
        <div className="flex gap-4">
          <SignInButton forceRedirectUrl={"/main"} mode="modal">
            <Button variant={"outline"} className="w-24 h-12 ">
              <p className="text-blue-500">Sign In</p>
            </Button>
          </SignInButton>
          <SignUpButton forceRedirectUrl={"/main"} mode="modal">
            <Button variant={"outline"} className="w-24 h-12">
              <p className="text-green-500">Sign Up</p>
            </Button>
          </SignUpButton>
        </div>
      </Unauthenticated>
    </div>
  );
}
