"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function ReturnToMainMenuButton() {
  const router = useRouter();
  return (
    <Button
      className="fixed top-2 right-1 sm:top-8 sm:right-8 md:top-12 md:right-12 w-fit z-50"
      onClick={() => router.push("/main")}
    >
      Return
    </Button>
  );
}
