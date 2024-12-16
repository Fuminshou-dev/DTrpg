import reroll from "@/public/reroll.jpg";
import restore1 from "@/public/restore1.jpg";
import restore2 from "@/public/restore2.jpg";
import special from "@/public/special.jpg";
import { StaticImageData } from "next/image";

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
