"use client";
import { Authenticated } from "convex/react";
import React from "react";
import { Button } from "./ui/button";
import { SignOutButton } from "@clerk/nextjs";

export default function CustomSignOutButton() {
  return (
    <Authenticated>
      <Button asChild className="fixed top-6 left-6 h-12 w-20">
        <SignOutButton redirectUrl="/login" />
      </Button>
    </Authenticated>
  );
}
