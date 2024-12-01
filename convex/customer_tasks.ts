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
  args: { player_name: v.string(), money: v.float64() }, // TODO: look for a specific player
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("player_name"), args.player_name))
      .first();
    if (!player) {
      return "No such player";
    }
    const currentGold = player.gold;
    const newGold = currentGold + args.money;
    await ctx.db.patch(player._id, { gold: newGold });
    return player!.gold;
  },
});
