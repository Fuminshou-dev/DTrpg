import { Doc } from "./_generated/dataModel";
import { query } from "./_generated/server";

type Monster = Doc<"monsters">;

type MonsterQueryResponse = {
  success: boolean;
  error?: string;
  monsters?: Monster[];
};

export const getAllMonstersVisibleToPlayer = query({
  handler: async (ctx): Promise<MonsterQueryResponse> => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) {
      return { success: false, error: "No userid" };
    }
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!player) {
      return { success: false, error: "No player" };
    }
    const monsters = await ctx.db
      .query("monsters")
      .filter((q) => q.lte(q.field("showId"), player?.currentMonster))
      .collect();

    if (!monsters) {
      return { success: false, error: "No monsters" };
    }

    return { success: true, monsters: monsters };
  },
});
