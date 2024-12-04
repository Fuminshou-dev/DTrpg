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
  const [errorItemType, setErrorItemType] = useState<string | null>(null);
  const [successItemType, setSuccessItemType] = useState<string | null>(null);

  const items = useQuery(api.shop.getAllShopItems);
  const router = useRouter();
  const player = useQuery(api.players.getPlayer);
  const buyItem = useMutation(api.shop.buyItem);
  const handleItemBuy = async (price: number, type: string) => {
    const result = await buyItem({ price, type });

    if (!result.success) {
      if (result.error === "Not enough money") setErrorItemType(type);
    } else {
      setErrorItemType(null);
    }

    if (result.success) {
      setSuccessItemType(type);
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
    <div className="container mx-auto h-screen py-12 justify-center flex">
      <div className="flex flex-col  gap-12 items-center w-3/4 h-3/4">
        <Button
          className="flex p-4 text-lg"
          variant={"outline"}
          onClick={() => {
            router.back();
          }}
        >
          Go back
        </Button>
        <div className="grid grid-cols-2 flex-1 w-full gap-12 p-4">
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
              <p className="text-xl">
                You have{" "}
                {player.items.map((el) =>
                  el.type === item.type ? (
                    el.amount === 0 ? (
                      <span key={el.type} className="text-red-500">
                        {el.amount}
                      </span>
                    ) : (
                      <span key={el.type} className="text-green-500">
                        {el.amount}
                      </span>
                    )
                  ) : (
                    ""
                  )
                )}{" "}
                of this item
              </p>
              <div className="flex flex-col justify-center items-center gap-2">
                <Button
                  disabled={player.gold < item.price ? true : false}
                  onClick={() => handleItemBuy(item.price, item.type)}
                  variant={
                    player.gold < item.price ? "destructive" : "secondary"
                  }
                  className={
                    player.gold < item.price
                      ? "w-24 h-12 disabled:cursor-not-allowed"
                      : "w-24 h-12 bg-green-600"
                  }
                >
                  Buy
                </Button>
                {errorItemType === item.type && (
                  <p className="text-red-500">Not enough gold</p>
                )}
                {successItemType === item.type && (
                  <p className="text-green-500">Successfully bought an item</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
