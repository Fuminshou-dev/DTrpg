import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    brothel_customers: defineTable({
      price: v.float64(),
      task: v.float64(),
      customerType: v.string(),
    }),
    brothel_tasks: defineTable({
      gold: v.float64(),
      task: v.string(),
    }),
    monsters: defineTable({
      exp: v.float64(),
      gold: v.float64(),
      hp: v.float64(),
      showId: v.number(),

      max_dmg: v.float64(),
      min_dmg: v.float64(),
      monster_type: v.string(),
      tasks: v.array(
        v.object({
          break_time: v.float64(),
          task_description: v.string(),
        })
      ),
    }).index("by_monsterID", ["showId"]),
    player_stats: defineTable({
      atk: v.float64(),
      hp: v.float64(),
      level: v.float64(),
      required_exp: v.float64(),
    }).index("by_level", ["level"]),
    players: defineTable({
      hasSpecialPotionEffect: v.boolean(),
      brothelCooldownUntil: v.optional(v.number()),
      userId: v.string(),
      playerName: v.string(),
      level: v.float64(),
      current_exp: v.float64(),
      gold: v.float64(),
      img: v.string(),
      currentMonster: v.number(),
      fightStatus: v.union(
        v.literal("idle"),
        v.object({
          monsterId: v.number(),
          currentTask: v.object({
            task_description: v.string(),
            break_time: v.number(),
          }),
          status: v.literal("fighting"),
          playerAtk: v.number(),
          monsterAtk: v.number(),
          playerHp: v.number(),
          monsterHp: v.number(),
          atkMultiplier: v.number(),
          finalDmg: v.number(),
        })
      ),
      items: v.array(
        v.object({
          amount: v.number(),
          itemName: v.union(
            v.literal("Healing Potion"),
            v.literal("Healing Hi-Potion"),
            v.literal("Reroll Potion"),
            v.literal("Special Potion")
          ),
          type: v.union(
            v.literal("restore1"),
            v.literal("restore2"),
            v.literal("special"),
            v.literal("reroll")
          ),
        })
      ),
    }).index("by_userId", ["userId"]),
    player_statistics: defineTable({
      playerId: v.id("players"),
      gold: v.object({
        totalEarned: v.number(),
        totalSpent: v.number(),
      }),
      monsters: v.object({
        totalMonstersDefeated: v.number(),
        monsterSpecificStats: v.object({
          goblin: v.number(),
          werewolf: v.number(),
          minotaur: v.number(),
          vampire: v.number(),
          fox: v.number(),
          priest: v.number(),
          diety: v.number(),
        }),
      }),
      combat: v.object({
        totalCombatTasks: v.number(),
        totalDamageDealt: v.number(),
        totalDamageTaken: v.number(),
        totalCombatTasksCompleted: v.number(),
        totalCombatTasksFailed: v.number(),
      }),
      brothel: v.object({
        totalBrothelTasks: v.number(),
        totalBrothelTasksCompleted: v.number(),
        totalBrothelTasksFailed: v.number(),
      }),
      potions: v.object({
        totalPotionsBought: v.number(),
        totalHealingPotionsBought: v.number(),
        totalHealingHiPotionsBought: v.number(),
        totalRerollPotionsBought: v.number(),
        totalSpecialPotionsBought: v.number(),
        totalHealingpotionsUsed: v.number(),
        totalHealingHiPotionsUsed: v.number(),
        totalRerollPotionsUsed: v.number(),
        totalSpecialPotionsUsed: v.number(),
      }),
    }).index("by_playerId", ["playerId"]),
    shop_items: defineTable({
      amount: v.number(),
      effectDescription: v.string(),
      item: v.string(),
      price: v.float64(),
      type: v.string(),
    }),
  },
  {
    schemaValidation: true,
  }
);
