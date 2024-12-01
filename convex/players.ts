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
      throw new Error("Character name already taken");
    }
    const characterId = await ctx.db.insert("players", {
      player_name: args.player_name,
      password: args.password,
      gold: 0,
      current_exp: 0,
      img: "",
      items: [{}],
      level: 1,
    });

    return characterId;
  },
});

export const getPlayer = query({
  args: { playerName: v.string() },
  handler: async (ctx, args) => {
    const player = ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("player_name"), args.playerName))
      .first();
    return player;
  },
});
