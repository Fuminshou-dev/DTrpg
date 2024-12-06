"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useQuery } from "convex/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";

export default function BrothelPage() {
  const [isLoading, setIsLoading] = useState(false);
  const customers = useQuery(api.customers.getAllCustomers);
  const allBrothelTasks = useQuery(api.customer_tasks.getCustomerTasks);

  useEffect(() => {
    if (!customers) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [customers]);

  const shuffledCustomers = useMemo(() => {
    if (!customers) return [];
    return [...customers].sort(() => Math.random() - 0.5);
  }, [customers]);

  return isLoading ? (
    <div className="flex flex-col h-screen justify-center items-center">
      <LoadingSpinner className="size-72"></LoadingSpinner>
    </div>
  ) : (
    <div className="container mx-auto">
      <div className="flex flex-col gap-4 p-8 w-full h-full justify-center items-center">
        <Button onClick={() => redirect("/main")}>Return to main menu</Button>
        <div className="flex flex-col items-center w-full gap-8">
          <div className={"grid grid-cols-3 gap-4"}>
            {shuffledCustomers?.map((customer) => (
              <div
                className="flex justify-center items-center border rounded-lg size-72 "
                key={customer._id}
              >
                <div className="flex flex-col justify-center items-center gap-12">
                  <p className="text-3xl underline underline-offset-8 mb-5">
                    {customer.customerType} customer
                  </p>
                  <div className="flex flex-col text-xl justify-center items-center text-center">
                    {customer.price === 1 ? (
                      <p>Pays the usual price</p>
                    ) : (
                      <p>
                        Pays{" "}
                        <span className="text-red-500">
                          {" "}
                          {customer.price}x{" "}
                        </span>
                        the price
                      </p>
                    )}
                    {customer.task === 1 ? (
                      <p>
                        You do the task
                        <span className="text-green-500">
                          {" "}
                          {customer.task}{" "}
                        </span>
                        time
                      </p>
                    ) : (
                      <p>
                        You do the task
                        <span className="text-red-500">
                          {" "}
                          {customer.task}
                        </span>{" "}
                        times
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border rounded-lg w-1/2  flex flex-col justify-center items-center p-8">
            <h1 className="text-3xl">Possible tasks:</h1>
            <ul className="flex-col gap-4 justify-center items-center list-disc list-item">
              {allBrothelTasks?.map((el) => (
                <li key={el._id} className="text-xl">
                  {el.task} -{" "}
                  {<span className="text-yellow-500">{el.gold}</span>} Gold
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-center items-center p-8">
          <Button className="w-24 h-12" asChild>
            <Link href={"/brothel/serve"}>Serve</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
