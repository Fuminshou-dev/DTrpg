import { mutation, query } from "./_generated/server";

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

export const setBrothelCooldown = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!player) {
      throw new Error("Player not found");
    }

    const cooldownDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
    const cooldownUntil = Date.now() + cooldownDuration;

    await ctx.db.patch(player._id, {
      brothelCooldownUntil: cooldownUntil,
    });
  },
});
