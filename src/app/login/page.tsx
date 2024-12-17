"use client";

import { SignInButton, SignUpButton, useUser, useAuth } from "@clerk/nextjs";
import { Unauthenticated, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded: isUserLoaded } = useUser();
  const { userId, isLoaded: isAuthLoaded } = useAuth();
  const createPlayer = useMutation(api.players.createPlayer);
  const [isCreatingPlayer, setIsCreatingPlayer] = useState(false);

  useEffect(() => {
    const handlePlayerCreation = async () => {
      console.log("Auth state check", {
        isSignedIn,
        user,
        userId,
        isUserLoaded,
        isAuthLoaded,
      });

      if (!isUserLoaded || !isAuthLoaded) {
        console.log("Auth state not yet loaded");
        return;
      }

      if (isSignedIn && user && user.username && userId && !isCreatingPlayer) {
        setIsCreatingPlayer(true);
        try {
          await createPlayer({
            playerName: user.username,
            userId,
          });
          router.push("/main");
        } catch (error) {
          console.error("Error creating player:", error);
          setIsCreatingPlayer(false);
        }
      } else {
        return;
      }
    };

    handlePlayerCreation();
  }, [
    isSignedIn,
    user,
    userId,
    createPlayer,
    router,
    isUserLoaded,
    isAuthLoaded,
    isCreatingPlayer,
  ]);

  return (
    <div className="flex flex-col gap-8 container mx-auto h-screen justify-center items-center">
      <h1 className="text-5xl font-bold">
        Please, log in or create an account (character){" "}
      </h1>
      <Unauthenticated>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <Button variant={"outline"} className="w-24 h-12 ">
              <p className="text-blue-500">Sign In</p>
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant={"outline"} className="w-24 h-12">
              <p className="text-green-500">Sign Up</p>
            </Button>
          </SignUpButton>
        </div>
      </Unauthenticated>
    </div>
  );
}
