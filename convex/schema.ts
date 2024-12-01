import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
  }),
  player_stats: defineTable({
    atk: v.float64(),
    hp: v.float64(),
    level: v.float64(),
    required_exp: v.float64(),
  }),
  players: defineTable({
    current_exp: v.float64(),
    gold: v.float64(),
    img: v.string(),
    items: v.array(v.object({})),
    level: v.float64(),
    password: v.string(),
    player_name: v.string(),
  }),
  shop_items: defineTable({
    amount: v.string(),
    effectDescription: v.string(),
    item: v.string(),
    price: v.float64(),
    type: v.string(),
  }),
});
