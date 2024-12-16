import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPlayerStatistics = query({
  args: {
    playerId: v.id("players"),
  },
  handler: async (ctx, args) => {
    const playerSpecificStats = await ctx.db
      .query("player_statistics")
      .withIndex("by_playerId", (q) => q.eq("playerId", args.playerId))
      .first();

    return playerSpecificStats;
  },
});

// export const updatePlayerStatisticsAfterDefeatingAMonster = mutation({
//   args: {
//     playerId: v.id("players"),
//     monsterId: v.id("monsters"),
//   },
//   handler: async (ctx, args) => {

//   },
// });

export const updateBrothelStatistics = mutation({
  args: {
    toUpdate: v.object({
      totalBrothlelTask: v.optional(v.boolean()),
      totalBrothelTaskCompleted: v.optional(v.boolean()),
      totalBrothelTaskFailed: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!player) {
      throw new Error("Player not found");
    }

    const playerSpecificStats = await ctx.db
      .query("player_statistics")
      .withIndex("by_playerId", (q) => q.eq("playerId", player._id))
      .first();

    if (!playerSpecificStats) {
      throw new Error("Player statistics not found");
    }

    if (args.toUpdate.totalBrothlelTask) {
      playerSpecificStats.brothel.totalBrothelTasks++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }

    if (args.toUpdate.totalBrothelTaskCompleted) {
      playerSpecificStats.brothel.totalBrothelTasksCompleted++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }

    if (args.toUpdate.totalBrothelTaskFailed) {
      playerSpecificStats.brothel.totalBrothelTasksFailed++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
  },
});

export const updateShopStatistics = mutation({
  args: {
    toUpdate: v.object({
      healingPotionsBought: v.boolean(),
      healingHiPotionsBought: v.boolean(),
      rerollPotionsBought: v.boolean(),
      specialPotionsBought: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!player) {
      throw new Error("Player not found");
    }
    const playerSpecificStats = await ctx.db
      .query("player_statistics")
      .withIndex("by_playerId", (q) => q.eq("playerId", player._id))
      .first();

    if (!playerSpecificStats) {
      throw new Error("Player statistics not found");
    }

    if (args.toUpdate.healingHiPotionsBought) {
      playerSpecificStats.potions.totalHealingHiPotionsBought++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
    if (args.toUpdate.healingPotionsBought) {
      playerSpecificStats.potions.totalHealingPotionsBought++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
    if (args.toUpdate.rerollPotionsBought) {
      playerSpecificStats.potions.totalRerollPotionsBought++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
    if (args.toUpdate.specialPotionsBought) {
      playerSpecificStats.potions.totalSpecialPotionsBought++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }

    playerSpecificStats.potions.totalPotionsBought++;
    await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
  },
});

export const updateGoldStatistics = mutation({
  args: {
    toUpdate: v.object({
      goldEarned: v.number(),
      goldSpent: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!player) {
      throw new Error("Player not found");
    }
    const playerSpecificStats = await ctx.db
      .query("player_statistics")
      .withIndex("by_playerId", (q) => q.eq("playerId", player._id))
      .first();

    if (!playerSpecificStats) {
      throw new Error("Player statistics not found");
    }

    await ctx.db.patch(playerSpecificStats._id, {
      gold: {
        totalEarned:
          playerSpecificStats.gold.totalEarned + args.toUpdate.goldEarned,
        totalSpent:
          playerSpecificStats.gold.totalSpent + args.toUpdate.goldSpent,
      },
    });
  },
});

export const updatePlayerPotionStatistics = mutation({
  args: {
    toUpdate: v.object({
      healingPotionUsed: v.optional(v.boolean()),
      healingHiPotionUsed: v.optional(v.boolean()),
      rerollPotionUsed: v.optional(v.boolean()),
      specialPotionUsed: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!player) {
      throw new Error("Player not found");
    }

    const playerSpecificStats = await ctx.db
      .query("player_statistics")
      .withIndex("by_playerId", (q) => q.eq("playerId", player._id))
      .first();

    if (!playerSpecificStats) {
      throw new Error("Player statistics not found");
    }

    if (args.toUpdate.healingPotionUsed) {
      playerSpecificStats.potions.totalHealingPotionsUsed++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
    if (args.toUpdate.healingHiPotionUsed) {
      playerSpecificStats.potions.totalHealingHiPotionsUsed++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
    if (args.toUpdate.rerollPotionUsed) {
      playerSpecificStats.potions.totalRerollPotionsUsed++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
    if (args.toUpdate.specialPotionUsed) {
      playerSpecificStats.potions.totalSpecialPotionsUsed++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }

    playerSpecificStats.potions.totalPotionsUsed++;
    await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
  },
});

export const updatePlayerCombatStatistics = mutation({
  args: {
    toUpdate: v.object({
      totalCombatTasks: v.optional(v.boolean()),
      totalCombatTasksCompleted: v.optional(v.boolean()),
      totalCombatTasksFailed: v.optional(v.boolean()),
      totalDamageDealt: v.optional(v.number()),
      totalDamageTaken: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!player) {
      throw new Error("Player not found");
    }
    const playerSpecificStats = await ctx.db
      .query("player_statistics")
      .withIndex("by_playerId", (q) => q.eq("playerId", player._id))
      .first();

    if (!playerSpecificStats) {
      throw new Error("Player statistics not found");
    }

    if (args.toUpdate.totalCombatTasks) {
      playerSpecificStats.combat.totalCombatTasks++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
    if (args.toUpdate.totalCombatTasksCompleted) {
      playerSpecificStats.combat.totalCombatTasksCompleted++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
    if (args.toUpdate.totalCombatTasksFailed) {
      playerSpecificStats.combat.totalCombatTasksFailed++;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
    if (args.toUpdate.totalDamageDealt) {
      playerSpecificStats.combat.totalDamageDealt +=
        args.toUpdate.totalDamageDealt;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
    if (args.toUpdate.totalDamageTaken) {
      playerSpecificStats.combat.totalDamageTaken +=
        args.toUpdate.totalDamageTaken;
      await ctx.db.patch(playerSpecificStats._id, playerSpecificStats);
    }
  },
});

export const updatePlayerMonstersStatistics = mutation({
  args: {
    toUpdate: v.object({
      monsterKilled: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const player = await ctx.db
      .query("players")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!player) {
      throw new Error("Player not found");
    }
    const playerSpecificStats = await ctx.db
      .query("player_statistics")
      .withIndex("by_playerId", (q) => q.eq("playerId", player._id))
      .first();

    if (!playerSpecificStats) {
      throw new Error("Player statistics not found");
    }

    playerSpecificStats.monsters.totalMonstersDefeated++;

    // Update monster-specific statistics
    const monsterTypeMap: {
      [
        key: string
      ]: keyof typeof playerSpecificStats.monsters.monsterSpecificStats;
    } = {
      "Evil Deity": "diety",
      "Dark Priest": "priest",
      "Nine-tailed fox": "fox",
      Vampire: "vampire",
      Minotaur: "minotaur",
      Werewolf: "werewolf",
      Goblin: "goblin",
    };

    const monsterType = monsterTypeMap[args.toUpdate.monsterKilled];
    if (
      monsterType &&
      monsterType in playerSpecificStats.monsters.monsterSpecificStats
    ) {
      playerSpecificStats.monsters.monsterSpecificStats[monsterType]++;
    }

    await ctx.db.patch(playerSpecificStats._id, {
      monsters: playerSpecificStats.monsters,
    });
  },
});
