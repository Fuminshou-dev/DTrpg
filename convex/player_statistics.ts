import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPlayerStatistics = query({
  args: {
    playerId: v.id("players"),
  },
  handler: async (ctx, args) => {
    const playerSpecificStats = await ctx.db
      .query("player_statistics")
      .withIndex("by_playerId", (q) => q.eq("playerId", args.playerId))
      .first();

    return playerSpecificStats;
  },
});

// export const updatePlayerStatisticsAfterDefeatingAMonster = mutation({
//   args: {
//     playerId: v.id("players"),
//     monsterId: v.id("monsters"),
//   },
//   handler: async (ctx, args) => {

//   },
// });

export const updateBrothelStatistics = mutation({
  args: {
    toUpdate: v.object({
      totalBrothlelTask: v.optional(v.boolean()),
      totalBrothelTaskCompleted: v.optional(v.boolean()),
      totalBrothelTaskFailed: v.optional(v.boolean()),
    }),
  },
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
      throw new Error("Player not found");
    }

    const playerSpecificStats = await ctx.db
      .query("player_statistics")
      .withIndex("by_playerId", (q) => q.eq("playerId", player._id))
      .first();

    if (!playerSpecificStats) {
      throw new Error("Player statistics not found");
    }

    if (args.toUpdate.totalBrothlelTask) {
      playerSpecificStats.brothel.totalBrothelTasks++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }

    if (args.toUpdate.totalBrothelTaskCompleted) {
      playerSpecificStats.brothel.totalBrothelTasksCompleted++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }

    if (args.toUpdate.totalBrothelTaskFailed) {
      playerSpecificStats.brothel.totalBrothelTasksFailed++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
  },
});
