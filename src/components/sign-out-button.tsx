"use client";
import { Authenticated } from "convex/react";
import React from "react";
import { Button } from "./ui/button";
import { SignOutButton } from "@clerk/nextjs";

export default function CustomSignOutButton() {
  return (
    <Authenticated>
      <Button
        asChild
        className="fixed top-2 left-2 h-8 w-16 sm:top-6 sm:left-6 sm:h-12 sm:w-20 lg:w-24 z-50 text-xs sm:text-sm md:text-base"
      >
        <SignOutButton redirectUrl="/login">Sign Out</SignOutButton>
      </Button>
    </Authenticated>
  );
}
