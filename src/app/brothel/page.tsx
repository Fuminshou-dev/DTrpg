"use client";

import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function BrothelPage() {
  const customers = useQuery(api.customers.getAllCustomers);
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-8 container mx-auto">
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
                {customer.price == "1" ? (
                  <p>Pays the usual price</p>
                ) : (
                  <p>
                    Pays{" "}
                    <span className="text-red-500"> {customer.price}x </span>
                    the price
                  </p>
                )}
                {customer.task == "1" ? (
                  <p>
                    You do the task
                    <span className="text-green-500"> {customer.task} </span>
                    time
                  </p>
                ) : (
                  <p>
                    You do the task
                    <span className="text-red-500"> {customer.task}</span> times
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Button className="w-24 h-12">Serve</Button>
      </div>
    </div>
  );
}
