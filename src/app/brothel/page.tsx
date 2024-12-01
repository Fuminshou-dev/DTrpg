"use client";

import { useQuery } from "convex/react";
import React, { Suspense, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { redirect } from "next/navigation";

export default function BrothelPage() {
  const [isLoading, setIsLoading] = useState(false);
  const customers = useQuery(api.customers.getAllCustomers);
  useEffect(() => {
    if (!customers) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [customers]);
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-8 container mx-auto">
      {isLoading ? (
        <LoadingSpinner className="size-24"></LoadingSpinner>
      ) : (
        <div className="flex flex-col gap-8">
          <Button onClick={() => redirect("/main")}>Go back</Button>
          <div className="grid grid-cols-3 gap-4">
            {customers?.map((customer) => (
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
          <div className="flex justify-center items-center">
            <Button className="w-24 h-12" asChild>
              <Link href={"/brothel/serve"}>Serve</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
