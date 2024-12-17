"use client";
import { Authenticated } from "convex/react";
import React from "react";
import { Button } from "./ui/button";
import { SignOutButton } from "@clerk/nextjs";

export default function CustomSignOutButton() {
  return (
    <Authenticated>
      <Button asChild>
        <SignOutButton redirectUrl="/login">Sign Out</SignOutButton>
      </Button>
    </Authenticated>
  );
}
