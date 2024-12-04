"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Image from "next/image";

import restore1 from "../../../public/restore1.jpg";
import restore2 from "../../../public/restore2.jpg";
import reroll from "../../../public/reroll.jpg";
import special from "../../../public/special.jpg";
import { useRouter } from "next/navigation";

const itemImages: { [key: string]: any } = {
  restore1: restore1,
  restore2: restore2,
  special: special,
  reroll: reroll,
};

export default function ShopPage() {
  const [showError, setShowError] = useState(false);
  const items = useQuery(api.shop.getAllShopItems);
  const router = useRouter();
  const player = useQuery(api.players.getPlayer);
  const buyItem = useMutation(api.shop.buyItem);
  const handleItemBuy = async (itemPrice: number, itemType: string) => {
    try {
      await buyItem({ type: itemType, price: itemPrice });
    } catch (error) {
      setShowError(true);
    }
  };

  if (!items || !player) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <LoadingSpinner className="size-72"></LoadingSpinner>
      </div>
    );
  }

  return (
    <div className="container mx-auto h-screen items-center justify-center flex">
      <div className="flex flex-col  gap-24 items-center w-3/4 h-3/4">
        <Button
          className="flex p-4 text-lg"
          variant={"outline"}
          onClick={() => {
            router.back();
          }}
        >
          Go back
        </Button>
        <div className="grid grid-cols-2 flex-1 w-full gap-12">
          {items?.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-8 text-center justify-center items-center border p-8 rounded-lg"
            >
              <h1 className="text-2xl">{item.item}</h1>
              <Image
                className="rounded-lg"
                width={70}
                src={itemImages[item.type]}
                alt={item.item}
              ></Image>
              <p>{item.effectDescription}</p>
              <p className="text-xl">
                Cost: <span className="text-yellow-400">{item.price}</span> Gold
              </p>
              {player.gold < item.price ? (
                <div className="flex flex-col justify-center items-center gap-2">
                  <Button
                    onClick={() => handleItemBuy(item.price, item.type)}
                    variant={"destructive"}
                  >
                    Buy
                  </Button>
                  {showError ? (
                    <p className="text-red-500">Not enough gold</p>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center gap-2">
                  <Button
                    onClick={() => handleItemBuy(item.price, item.type)}
                    variant={"secondary"}
                    className="bg-green-600"
                  >
                    Buy
                  </Button>
                  {showError ? (
                    <p className="text-red-500">Not enough gold</p>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
