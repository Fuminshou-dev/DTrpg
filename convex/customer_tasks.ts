import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCustomerTasks = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("brothel_tasks").collect();
    return tasks;
  },
});

export const getRandomTask = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("brothel_tasks").collect();
    const timestamp = Date.now();
    const randomIndex = Math.floor((timestamp % 1000) / (1000 / tasks.length));
    return tasks[randomIndex];
  },
});

export const completedBrothelTask = mutation({
  args: { money: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!player) {
      return "No such player";
    }
    const currentGold = player.gold;
    const newGold = currentGold + args.money;
    await ctx.db.patch(player._id, { gold: newGold });
    return player.gold;
  },
});
