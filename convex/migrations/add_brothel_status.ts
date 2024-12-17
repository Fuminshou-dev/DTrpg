import { internalMutation } from "../_generated/server";

export const addBrothelStatusToAllPlayer = internalMutation({
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();

    for (const player of players) {
      await ctx.db.patch(player._id, { brothelStatus: "idle" });
    }
    return { success: true };
  },
});
