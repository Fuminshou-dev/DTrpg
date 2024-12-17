"use client";

import PageControls from "@/components/Controls";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";

export default function BrothelPage() {
  const router = useRouter();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const customers = useQuery(api.customers.getAllCustomers);
  const task = useQuery(api.customer_tasks.getRandomTask);
  const allBrothelTasks = useQuery(api.customer_tasks.getCustomerTasks);
  const updateBrothelStatisticsMutation = useMutation(
    api.player_statistics.updateBrothelStatistics
  );
  const updateBrothelStatusMutation = useMutation(
    api.players.updateBrothelStatus
  );

  useEffect(() => {
    if (!customers || !task || task === undefined) {
      setIsLoading(true);
    } else setIsLoading(false);
  }, [customers, task]);

  const shuffledCustomers = useMemo(() => {
    if (!customers) return [];
    return [...customers].sort(() => Math.random() - 0.5);
  }, [customers]);

  function getRandomCustomer() {
    if (!customers) return;
    if (customers) {
      const timestamp = Date.now();
      const randomIndex = Math.floor(
        (timestamp % 1000) / (1000 / customers.length)
      );
      return customers[randomIndex];
    }
  }

  const handleBrothelButtonClick = async () => {
    setIsButtonLoading(true);
    const randomCustomer = getRandomCustomer();

    try {
      if (task && randomCustomer) {
        await updateBrothelStatusMutation({
          brothelStatus: {
            status: "hasBrothelTask",
            currentTask: {
              customer: {
                customerType: randomCustomer.customerType,
                price: randomCustomer.price,
                task: randomCustomer.task,
              },
              task: {
                gold: task.gold,
                task: task.task,
              },
            },
          },
        });
        await updateBrothelStatisticsMutation({
          toUpdate: {
            totalBrothlelTask: true,
          },
        });
      }
      router.refresh();
    } finally {
      // Add a delay before enabling the button again
      setTimeout(() => {
        setIsButtonLoading(false);
      }, 3000); // Adjust the delay time as needed
    }
  };

  return isLoading ? (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
      <LoadingSpinner className="w-24 h-24 md:w-72 md:h-72" />
    </div>
  ) : (
    <div className="container mx-auto">
      <div className="flex flex-col justify-center items-center  sm:min-h-screen p-4 md:p-8 mb-4">
        <PageControls showControlButton={true} doShowStatistics={false} />
        <div className="w-full max-w-6xl space-y-2 sm:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                    <span
                      className={customer.price === 1 ? "" : "text-red-500"}
                    >
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
          <div className="flex flex-col border rounded-lg p-4">
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
              onClick={handleBrothelButtonClick}
              className="w-full sm:w-auto px-8 py-3 text-lg"
              disabled={isButtonLoading}
            >
              {isButtonLoading ? "Processing..." : "Serve"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
