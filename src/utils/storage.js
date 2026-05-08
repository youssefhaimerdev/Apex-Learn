const KEYS = {
  COMPLETED: 'apexlearn_completed',
  STREAK: 'apexlearn_streak',
  LAST_DATE: 'apexlearn_last_date',
  XP: 'apexlearn_xp',
  BADGES: 'apexlearn_badges',
};

function today() {
  return new Date().toISOString().split('T')[0];
}

export function getCompleted() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.COMPLETED) || '[]');
  } catch { return []; }
}

export function markCompleted(lessonId) {
  const completed = getCompleted();
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem(KEYS.COMPLETED, JSON.stringify(completed));
  }
}

export function isCompleted(lessonId) {
  return getCompleted().includes(lessonId);
}

export function getXP() {
  return parseInt(localStorage.getItem(KEYS.XP) || '0', 10);
}

export function addXP(amount) {
  const current = getXP();
  const newXP = current + amount;
  localStorage.setItem(KEYS.XP, String(newXP));
  return newXP;
}

export function getStreak() {
  const streak = parseInt(localStorage.getItem(KEYS.STREAK) || '0', 10);
  const lastDate = localStorage.getItem(KEYS.LAST_DATE);
  const todayStr = today();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (!lastDate) return 0;
  if (lastDate === todayStr) return streak;
  if (lastDate === yesterdayStr) return streak;
  // streak broken
  return 0;
}

export function updateStreak() {
  const lastDate = localStorage.getItem(KEYS.LAST_DATE);
  const todayStr = today();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let streak = parseInt(localStorage.getItem(KEYS.STREAK) || '0', 10);

  if (!lastDate || lastDate !== todayStr) {
    if (lastDate === yesterdayStr) {
      streak += 1;
    } else if (!lastDate) {
      streak = 1;
    } else if (lastDate !== todayStr) {
      streak = 1; // reset
    }
    localStorage.setItem(KEYS.STREAK, String(streak));
    localStorage.setItem(KEYS.LAST_DATE, todayStr);
  }

  return streak;
}

export function getBadges() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.BADGES) || '[]');
  } catch { return []; }
}

export function awardBadge(badgeId) {
  const badges = getBadges();
  if (!badges.includes(badgeId)) {
    badges.push(badgeId);
    localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
    return true;
  }
  return false;
}

export function getLevel(xp) {
  if (xp < 100) return { level: 1, title: 'Trailblazer', next: 100 };
  if (xp < 300) return { level: 2, title: 'Apex Apprentice', next: 300 };
  if (xp < 600) return { level: 3, title: 'Code Crafter', next: 600 };
  if (xp < 1000) return { level: 4, title: 'Logic Builder', next: 1000 };
  if (xp < 1500) return { level: 5, title: 'SOQL Slinger', next: 1500 };
  if (xp < 2200) return { level: 6, title: 'Trigger Handler', next: 2200 };
  if (xp < 3000) return { level: 7, title: 'Limit Bender', next: 3000 };
  if (xp < 4000) return { level: 8, title: 'Async Architect', next: 4000 };
  if (xp < 5500) return { level: 9, title: 'Test Master', next: 5500 };
  return { level: 10, title: 'Apex Champion', next: Infinity };
}

export function resetAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
