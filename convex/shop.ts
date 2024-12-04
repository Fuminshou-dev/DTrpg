import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { use } from "react";

const Playertype = {
  userId: v.string(),
  playerName: v.string(),
  level: v.float64(),
  current_exp: v.float64(),
  gold: v.float64(),
  img: v.string(),
  items: v.array(
    v.object({
      amount: v.number(),
      type: v.union(
        v.literal("restore1"),
        v.literal("restore2"),
        v.literal("special"),
        v.literal("reroll")
      ),
    })
  ),
};

export const getAllShopItems = query({
  args: {},
  handler: async (ctx) => {
    const allPotions = await ctx.db.query("shop_items").collect();
    return allPotions;
  },
});

export const buyItem = mutation({
  args: {
    price: v.number(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) {
      throw new Error("No userid");
    }
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!player) {
      throw new Error("player was not found");
    }
    const itemPrice = args.price;

    if (player.gold < itemPrice) {
      throw new Error("Not enough money");
    }

    const currentItems = player.items;

    const updatedItems = currentItems.map((item) =>
      item.type === args.type ? { ...item, amount: item.amount + 1 } : item
    );
    const updatedPlayer = await ctx.db.patch(player._id, {
      items: updatedItems,
      gold: player.gold - itemPrice,
    });
    return updatedPlayer;
  },
});
