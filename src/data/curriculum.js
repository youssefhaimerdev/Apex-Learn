import { CURRICULUM as PART1 } from './curriculum_part1.js';
import { CURRICULUM_PART2, CHEAT_SHEETS, BADGES, DAILY_CHALLENGES } from './curriculum_part2.js';

export const CURRICULUM = [...PART1, ...CURRICULUM_PART2];
export { CHEAT_SHEETS, BADGES, DAILY_CHALLENGES };
export const TOTAL_LESSONS = CURRICULUM.reduce((s, m) => s + m.lessons.length, 0);
export const TOTAL_XP = CURRICULUM.reduce((s, m) => s + m.xpTotal, 0);
export const TOTAL_MODULES = CURRICULUM.length;
