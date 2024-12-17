"use client";

import CustomSignOutButton from "@/components/sign-out-button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "@/app/theme-toggle";
import { useRouter } from "next/navigation";

export default function PageControls({
  doShowStatistics,
  showDetails,
  setShowDetails,
  showControlButton,
}: {
  doShowStatistics: boolean;
  showDetails?: boolean;
  setShowDetails?: (showDetails: boolean) => void;
  showControlButton?: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex sm:w-fit sm:gap-0 justify-center items-center flex-col w-fit mx-auto container md:my-0">
      <Button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:w-fit mb-2"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>
      {isMenuOpen && (
        <div className="flex flex-col gap-4 md:w-fit md:flex-row pb-2 max-h-[calc(100vh-100px)] overflow-y-auto">
          <CustomSignOutButton />
          <ModeToggle />
          {doShowStatistics && showDetails !== undefined && setShowDetails && (
            <Button onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? "Hide Statistics" : "Show Statistics"}
            </Button>
          )}
        </div>
      )}
      {showControlButton && (
        <Button className="w-fit" onClick={() => router.push("/main")}>
          Go to Main
        </Button>
      )}
    </div>
  );
}
