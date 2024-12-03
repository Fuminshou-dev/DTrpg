import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

type Item = {
  amount: number;
  type: "restore1" | "restore2" | "special" | "reroll";
};

type Items = [Item, Item, Item, Item];
export default defineSchema({
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
    max_dmg: v.float64(),
    min_dmg: v.float64(),
    monster_type: v.string(),
    tasks: v.array(
      v.object({
        break_time: v.float64(),
        task_description: v.string(),
      })
    ),
  }).index("by_monster_type", ["monster_type"]),
  player_stats: defineTable({
    atk: v.float64(),
    hp: v.float64(),
    level: v.float64(),
    required_exp: v.float64(),
  }).index("by_level", ["level"]),
  players: defineTable({
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
  }).index("by_userId", ["userId"]),
  shop_items: defineTable({
    amount: v.number(),
    effectDescription: v.string(),
    item: v.string(),
    price: v.float64(),
    type: v.string(),
  }),
});
