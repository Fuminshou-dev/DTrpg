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
      hasSpecialPotionEffect: false,
      userId: userId,
      playerName: args.playerName,
      gold: 0,
      current_exp: 0,
      img: "",
      level: 1,
      fightStatus: "idle",
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

    const player_statistics = await ctx.db.insert("player_statistics", {
      playerId: player,
      gold: {
        totalEarned: 0,
        totalSpent: 0,
      },
      monsters: {
        totalMonstersDefeated: 0,
        monsterSpecificStats: {
          goblin: 0,
          werewolf: 0,
          minotaur: 0,
          vampire: 0,
          fox: 0,
          priest: 0,
          diety: 0,
        },
      },
      combat: {
        totalCombatTasks: 0,
        totalDamageDealt: 0,
        totalDamageTaken: 0,
        totalCombatTasksCompleted: 0,
        totalCombatTasksFailed: 0,
      },
      brothel: {
        totalBrothelTasks: 0,
        totalBrothelTasksCompleted: 0,
        totalBrothelTasksFailed: 0,
      },
      potions: {
        totalPotionsBought: 0,
        totalHealingPotionsBought: 0,
        totalHealingHiPotionsBought: 0,
        totalRerollPotionsBought: 0,
        totalSpecialPotionsBought: 0,
        totalHealingpotionsUsed: 0,
        totalHealingHiPotionsUsed: 0,
        totalRerollPotionsUsed: 0,
        totalSpecialPotionsUsed: 0,
      },
    });

    return { player: player, player_statistics: player_statistics };
  },
});

export const getPlayerById = query({
  args: {
    playerId: v.string(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", args.playerId))
      .first();

    if (!player) {
      return null;
    }
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
export const updatePlayerAfterDefeatingAMonster = mutation({
  args: {
    monsterId: v.number(),
    earnedGold: v.number(),
    earnedExp: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!player) {
      throw new Error("Player not found");
    }

    const playerStats = await ctx.db
      .query("player_stats")
      .withIndex("by_level", (q) => q.eq("level", player.level))
      .first();

    if (!playerStats) {
      throw new Error("No stats found for this level");
    }

    const nextLevelStats = await ctx.db
      .query("player_stats")
      .withIndex("by_level", (q) => q.eq("level", player.level + 1))
      .first();
    if (!nextLevelStats) {
      throw new Error("No stats found for next level");
    }
    const newPlayerExp = player.current_exp + args.earnedExp;
    const newPlayerGold = player.gold + args.earnedGold;
    const newPlayerMonster = args.monsterId + 1;
    // get monster data from monsterid, check if it exists, if player.currentMonster = monster.showid increment player.currentmonster

    const monster = await ctx.db
      .query("monsters")
      .withIndex("by_monsterID", (q) => q.eq("showId", args.monsterId))
      .first();

    if (!monster) {
      throw new Error("No such monster");
    }

    if (player.currentMonster === monster.showId) {
      await ctx.db.patch(player._id, {
        currentMonster: newPlayerMonster,
      });
    }

    if (newPlayerExp >= nextLevelStats.required_exp) {
      await ctx.db.patch(player._id, {
        level: player.level + 1,
        current_exp: newPlayerExp,
      });
    }
    await ctx.db.patch(player._id, {
      gold: newPlayerGold,
      current_exp: newPlayerExp < 543 ? newPlayerExp : 543,
      fightStatus: "idle",
      hasSpecialPotionEffect: false,
    });

    const newPlayer = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!newPlayer) {
      throw new Error("Player not found after update");
    }

    return newPlayer;
  },
});

export const resetPlayer = mutation({
  args: {
    playerId: v.id("players"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, {
      brothelCooldownUntil: undefined,
      hasSpecialPotionEffect: false,
      gold: 0,
      current_exp: 0,
      currentMonster: 0,
      level: 1,
      fightStatus: "idle",
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
    });
    return "Successfully reset player";
  },
});

export const updatePlayerFightStatus = mutation({
  args: {
    fightStatus: v.union(
      v.literal("idle"),
      v.object({
        status: v.literal("fighting"),
        monsterId: v.number(),
        currentTask: v.object({
          task_description: v.string(),
          break_time: v.number(),
        }),
        playerAtk: v.number(),
        monsterAtk: v.number(),
        playerHp: v.number(),
        monsterHp: v.number(),
        atkMultiplier: v.number(),
        finalDmg: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const indentity = await ctx.auth.getUserIdentity();
    if (!indentity) {
      throw new Error("Not authenticated");
    }
    const userId = indentity.subject;

    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!player) {
      throw new Error("Player not found");
    }

    await ctx.db.patch(player._id, {
      fightStatus: args.fightStatus,
    });

    const newPlayer = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!newPlayer) {
      throw new Error("Player not found after update");
    }

    return newPlayer;
  },
});
export const getPlayerFightStatus = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!player) {
      return null;
    }
    return player.fightStatus;
  },
});

export const getPlayerBrothelCooldown = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return player?.brothelCooldownUntil || 0;
  },
});

export const updatePlayerItemsAfterUse = mutation({
  args: {
    itemType: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!player) {
      throw new Error("Player not found");
    }

    const itemIndex = player.items.findIndex(
      (item) => item.type === args.itemType
    );
    if (itemIndex === -1 || player.items[itemIndex].amount === 0) {
      return { success: false, message: "You do not have this item" };
    }
    const updatedItems = [...player.items];

    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      amount: updatedItems[itemIndex].amount - 1,
    };

    await ctx.db.patch(player._id, {
      items: updatedItems,
    });
    return { success: true, message: "Item used successfully" };
  },
});

export const updatePlayerSpecialPotionEffect = mutation({
  args: {
    shouldPlayerHaveSpecialEffect: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!player) {
      throw new Error("Player not found");
    }

    await ctx.db.patch(player._id, {
      ...player,
      hasSpecialPotionEffect: args.shouldPlayerHaveSpecialEffect,
    });
  },
});
