import reroll from "@/public/reroll.jpg";
import restore1 from "@/public/restore1.jpg";
import restore2 from "@/public/restore2.jpg";
import special from "@/public/special.jpg";
import { useMutation } from "convex/react";
import { StaticImageData } from "next/image";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";

export const ATK_MULTIPLIER = [0, 1, 2, 2, 3, 4];

export type itemTypes = "restore1" | "restore2" | "reroll" | "special";

export const itemOrder = ["restore1", "restore2", "reroll", "special"];

export const itemImages: { [key: string]: StaticImageData } = {
  restore1: restore1,
  restore2: restore2,
  special: special,
  reroll: reroll,
};
export const ItemDescriptions: { [key: string]: string } = {
  restore1: "Restores half of your hp",
  restore2: "Restores full hp",
  special: "Doubles the experience gained and damage dealt in the next battle",
  reroll: "Allows you to rerrol current roll",
};

export interface UseRollPotionProps {
  playerAtk: number;
  monsterId: number;
  monsterHp: number;
  playerHp: number;
  itemType: itemTypes;
  updatePlayerFightStatusMutation: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerFightStatus>
  >;
  hasSpecialPotionEffect: boolean;
}

export interface itemsDialogProps {
  setShowItems: (value: boolean) => void;
  player: Doc<"players">;
  showItems: boolean;
  playerHp: number;
  levelStats: Doc<"player_stats">;
  monsterHp: number;
  monsterId: number;
  playerAtk: number;
  updatePlayerFightStatusMutation: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerFightStatus>
  >;
  handleUseHealingItem: (
    playerCurrentHp: number,
    playerMaxHp: number,
    itemType: itemTypes
  ) => Promise<void>;
  handleUseRerollPotion: ({
    playerAtk,
    monsterId,
    monsterHp,
    playerHp,
    hasSpecialPotionEffect,
    itemType,
    updatePlayerFightStatusMutation,
  }: UseRollPotionProps) => Promise<void>;
  isButtonLoading: boolean;
}

export interface UseSpecialPotionProps {
  itemType: itemTypes;
  updatePlayerItemsAfterUseMutation: ReturnType<
    typeof useMutation<typeof api.players.updatePlayerItemsAfterUse>
  >;
  updatePlayerPotionStatisticsMutation: ReturnType<
    typeof useMutation<
      typeof api.player_statistics.updatePlayerPotionStatistics
    >
  >;
  setShowError: (value: boolean) => void;
  setErrorMsg: (value: string) => void;
  setIsButtonLoading: (value: boolean) => void;
}
