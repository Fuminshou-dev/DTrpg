/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as customers from "../customers.js";
import type * as customer_tasks from "../customer_tasks.js";
import type * as migrations_add_brothel_status from "../migrations/add_brothel_status.js";
import type * as monsters from "../monsters.js";
import type * as players from "../players.js";
import type * as player_statistics from "../player_statistics.js";
import type * as player_stats from "../player_stats.js";
import type * as shop from "../shop.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  customers: typeof customers;
  customer_tasks: typeof customer_tasks;
  "migrations/add_brothel_status": typeof migrations_add_brothel_status;
  monsters: typeof monsters;
  players: typeof players;
  player_statistics: typeof player_statistics;
  player_stats: typeof player_stats;
  shop: typeof shop;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
