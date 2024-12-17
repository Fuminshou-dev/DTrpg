"use client";

import { ReturnToMainMenuButton } from "@/components/return-to-main-button";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

export default function BrothelPage() {
  const router = useRouter();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const customers = useQuery(api.customers.getAllCustomers);
  const allBrothelTasks = useQuery(api.customer_tasks.getCustomerTasks);
  const updateBrothelStatisticsMutation = useMutation(
    api.player_statistics.updateBrothelStatistics
  );

  useEffect(() => {
    setIsLoading(!customers);
  }, [customers]);

  const shuffledCustomers = useMemo(() => {
    if (!customers) return [];
    return [...customers].sort(() => Math.random() - 0.5);
  }, [customers]);

  return isLoading ? (
    <div className="flex flex-col h-screen justify-center items-center">
      <LoadingSpinner className="w-24 h-24 md:w-72 md:h-72" />
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 md:p-8">
      <ReturnToMainMenuButton />
      <div className="w-full max-w-6xl space-y-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shuffledCustomers?.map((customer) => (
            <div
              className="border rounded-lg p-4 flex flex-col items-center text-center"
              key={customer._id}
            >
              <p className="text-xl md:text-2xl font-semibold mb-2">
                {customer.customerType} customer
              </p>
              <div className="text-sm md:text-base">
                <p>
                  Pays{" "}
                  <span className={customer.price === 1 ? "" : "text-red-500"}>
                    {customer.price}x
                  </span>{" "}
                  the price
                </p>
                <p>
                  You do the task{" "}
                  <span
                    className={
                      customer.task === 1 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {customer.task}
                  </span>{" "}
                  time{customer.task !== 1 && "s"}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="border rounded-lg p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Possible tasks:
          </h1>
          <ul className="list-disc list-inside space-y-2">
            {allBrothelTasks?.map((el) => (
              <li key={el._id} className="text-base md:text-xl">
                {el.task} - <span className="text-yellow-500">{el.gold}</span>{" "}
                Gold
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={async () => {
              setIsButtonLoading(true);
              router.push("/brothel/serve");
              await updateBrothelStatisticsMutation({
                toUpdate: {
                  totalBrothlelTask: true,
                },
              });
              setIsButtonLoading(false);
            }}
            className="w-full sm:w-auto px-8 py-3 text-lg"
            disabled={isButtonLoading}
          >
            Serve
          </Button>
        </div>
      </div>
    </div>
  );
}
