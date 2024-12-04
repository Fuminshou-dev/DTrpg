import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

type Player = Doc<"players">;

type BuyItemResponse = {
  success: boolean;
  error?: string;
  player?: Player;
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
  handler: async (ctx, args): Promise<BuyItemResponse> => {
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
      return { success: false, error: "Player not found" };
    }
    const itemPrice = args.price;

    if (player.gold < itemPrice) {
      return { success: false, error: "Not enough money" };
    }

    const currentItems = player.items;

    const updatedItems = currentItems.map((item) =>
      item.type === args.type ? { ...item, amount: item.amount + 1 } : item
    );
    const updatedPlayer = await ctx.db.patch(player._id, {
      items: updatedItems,
      gold: player.gold - itemPrice,
    });

    const finalPlayer = await ctx.db.get(player._id);
    if (!finalPlayer) {
      return { success: false, error: "Failed to update player" };
    }
    return { success: true, player: finalPlayer };
  },
});
