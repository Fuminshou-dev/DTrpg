import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPlayer = mutation({
  args: { playerName: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existingPlayer = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingPlayer) {
      return existingPlayer;
    }

    const player = await ctx.db.insert("players", {
      userId: userId,
      playerName: args.playerName,
      gold: 0,
      current_exp: 0,
      img: "",
      level: 1,
      items: [
        {
          amount: 0,
          type: "reroll",
          itemName: "Reroll Potion",
        },
        {
          amount: 0,
          type: "restore1",
          itemName: "Healing Potion",
        },
        {
          amount: 0,
          type: "restore2",
          itemName: "Healing Hi-Potion",
        },
        {
          amount: 0,
          type: "special",
          itemName: "Special Potion",
        },
      ],
      currentMonster: 0,
    });

    return player;
  },
});

export const getPlayer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return;
    }
    const userId = identity.subject;
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!player) {
      return null;
    }
    return player;
  },
});
