"use client";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";

import PageControls from "@/components/Controls";
import { api } from "../../../convex/_generated/api";
import { itemImages } from "../utils/constants";

export default function ShopPage() {
  const [errorItemType, setErrorItemType] = useState<string | null>(null);
  const [successItemType, setSuccessItemType] = useState<string | null>(null);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  const items = useQuery(api.shop.getAllShopItems);
  const updateShopStatisticsMutation = useMutation(
    api.player_statistics.updateShopStatistics
  );
  const updateGoldStatisticsMutation = useMutation(
    api.player_statistics.updateGoldStatistics
  );
  const player = useQuery(api.players.getPlayer);
  const buyItem = useMutation(api.shop.buyItem);

  const handleItemBuy = async ({
    price,
    type,
    updateShopStatisticsMutation,
    updateGoldStatisticsMutation,
  }: {
    price: number;
    type: string;
    updateShopStatisticsMutation: ReturnType<
      typeof useMutation<typeof api.player_statistics.updateShopStatistics>
    >;
    updateGoldStatisticsMutation: ReturnType<
      typeof useMutation<typeof api.player_statistics.updateGoldStatistics>
    >;
  }) => {
    setIsButtonLoading(true);
    const result = await buyItem({ price, type });

    if (!result.success) {
      if (result.error === "Not enough money") setErrorItemType(type);
    } else {
      setErrorItemType(null);
    }

    if (result.success) {
      await updateShopStatisticsMutation({
        toUpdate: {
          healingHiPotionsBought: type === "restore2",
          healingPotionsBought: type === "restore1",
          rerollPotionsBought: type === "reroll",
          specialPotionsBought: type === "special",
        },
      });
      await updateGoldStatisticsMutation({
        toUpdate: {
          goldSpent: price,
          goldEarned: 0,
        },
      });
      setSuccessItemType(type);
    }

    setTimeout(() => {
      setIsButtonLoading(false);
    }, 1500);
  };

  if (!items || !player) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <LoadingSpinner className="size-72"></LoadingSpinner>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="py-2 flex flex-col justify-center items-center gap-0">
        <PageControls doShowStatistics={false} showControlButton />

        <div className="flex flex-col gap-2 w-full max-w-6xl mt-2 px-2">
          <div className="flex gap-4 text-center justify-evenly items-center border p-4 rounded-lg w-full text-sm md:text-lg lg:text-xl">
            <p>Current Gold</p>
            <p>
              <span
                className={player.gold < 0 ? "text-red-500" : "text-yellow-400"}
              >
                {player.gold}
              </span>{" "}
              Gold
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items?.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-4 text-center justify-between items-center border p-2 rounded-lg w-full"
              >
                <h1 className="text-xl sm:text-2xl">{item.item}</h1>
                <Image
                  className="rounded-lg w-24 aspect-square "
                  width={10000}
                  src={itemImages[item.type]}
                  alt={item.item}
                ></Image>
                <p className="text-sm sm:text-base">{item.effectDescription}</p>
                <p className="text-lg sm:text-xl">
                  Cost: <span className="text-yellow-400">{item.price}</span>{" "}
                  Gold
                </p>
                <p className="text-lg sm:text-xl">
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
                  {errorItemType === item.type && (
                    <p className="text-red-500 text-sm">Not enough gold</p>
                  )}
                  {successItemType === item.type && (
                    <p className="text-green-500 text-sm">
                      Successfully bought an item
                    </p>
                  )}
                  <Button
                    disabled={isButtonLoading || player.gold < item.price}
                    onClick={() =>
                      handleItemBuy({
                        updateGoldStatisticsMutation,
                        price: item.price,
                        type: item.type,
                        updateShopStatisticsMutation,
                      })
                    }
                    variant={
                      player.gold < item.price ? "destructive" : "secondary"
                    }
                    className={
                      player.gold < item.price
                        ? "w-24 h-12 disabled:cursor-not-allowed"
                        : "w-24 h-12 bg-green-600"
                    }
                  >
                    {isButtonLoading ? "Loading..." : "Buy"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
