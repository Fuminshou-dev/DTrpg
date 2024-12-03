import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { handleClientScriptLoad } from "next/script";

export const createPlayer = mutation({
  args: { player_name: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("player_name"), args.player_name))
      .first();
    if (existing) {
      throw new Error("Character name already taken", {
        cause: "character already exists",
      });
    }
    const characterId = await ctx.db.insert("players", {
      player_name: args.player_name,
      password: args.password,
      gold: 0,
      current_exp: 0,
      img: "",
      items: [
        {
          amount: 0,
          type: "reroll",
        },
        {
          amount: 0,
          type: "restore1",
        },
        {
          amount: 0,
          type: "restore2",
        },
        {
          amount: 0,
          type: "special",
        },
      ],
      level: 1,
    });

    return characterId;
  },
});

export const getPlayer = query({
  args: { password: v.string(), playerName: v.string() },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query("players")
      .filter((q) =>
        q.and(
          q.eq(q.field("player_name"), args.playerName),
          q.eq(q.field("password"), args.password)
        )
      )
      .first();

    if (!player) {
      return null;
    }
    return player;
  },
});
