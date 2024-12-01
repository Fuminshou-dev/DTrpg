import { v } from "convex/values";
import { query } from "./_generated/server";

export const getLevelStats = query({
  args: { level: v.float64() },
  handler: async (ctx, args) => {
    const levelStats = ctx.db
      .query("player_stats")
      .filter((q) => q.eq(q.field("level"), args.level))
      .first();
    return levelStats;
  },
});
