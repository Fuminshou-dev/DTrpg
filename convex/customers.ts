import { query } from "./_generated/server";

export const getAllCustomers = query({
  args: {},
  handler: async (ctx) => {
    const customers = await ctx.db.query("brothel_customers").collect();
    return customers;
  },
});
