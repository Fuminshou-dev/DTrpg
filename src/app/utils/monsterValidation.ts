import { VALID_MONSTERS, ValidMonster } from "./constants";

export function isValidMonster(monster: string): monster is ValidMonster {
  return VALID_MONSTERS.includes(monster as ValidMonster);
}

export function validateMonsterRoute(path: string) {
  if (path.startsWith("/fight/")) {
    const monster = path.split("/").pop();
    return isValidMonster(monster as string);
  }
  return true;
}
