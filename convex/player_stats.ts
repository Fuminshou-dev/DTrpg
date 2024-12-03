import { v } from "convex/values";
import { query } from "./_generated/server";

export const getLevelStats = query({
  args: { level: v.float64() },
  handler: async (ctx, args) => {
    const levelStats = ctx.db
      .query("player_stats")
      .withIndex("by_level", (q) => q.eq("level", args.level))
      .first();
    return levelStats;
  },
});
