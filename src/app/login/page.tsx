"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Unauthenticated, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";

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
    <div className="flex h-screen justify-center items-center">
      <Unauthenticated>
        <div className="flex gap-4">
          <SignInButton forceRedirectUrl={"/main"} mode="modal">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton forceRedirectUrl={"/main"} mode="modal">
            <button className="px-4 py-2 bg-green-500 text-white rounded">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </Unauthenticated>
    </div>
  );
}
