import { query } from "./_generated/server";

export const getAllCustomers = query({
  args: {},
  handler: async (ctx) => {
    const customers = await ctx.db.query("brothel_customers").collect();
    return customers;
  },
});

export const getRandomCustomer = query({
  args: {},
  handler: async (ctx) => {
    const customers = await ctx.db.query("brothel_customers").collect();
    const timestamp = Date.now();
    const randomIndex = Math.floor(
      (timestamp % 1000) / (1000 / customers.length)
    );
    const randomCustomer = customers[randomIndex];
    return randomCustomer;
  },
});
