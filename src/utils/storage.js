const K = {
  COMPLETED:'al_completed_v2',STREAK:'al_streak_v2',LAST_DATE:'al_last_date_v2',
  XP:'al_xp_v2',BADGES:'al_badges_v2',QUIZ:'al_quiz_v2',DAILY_DONE:'al_daily_done_v2',
  ONBOARDED:'al_onboarded_v2',SPEED_START:'al_speed_start',SPEED_COUNT:'al_speed_count',
  SRS_CARDS:'al_srs_cards_v2',SRS_STATS:'al_srs_stats_v2',
};
const todayStr=()=>new Date().toISOString().split('T')[0];
const yestStr=()=>{const d=new Date();d.setDate(d.getDate()-1);return d.toISOString().split('T')[0];};
function safe(k,fb){try{const v=localStorage.getItem(k);return v!==null?JSON.parse(v):fb;}catch{return fb;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}

export function getCompleted(){return safe(K.COMPLETED,[]);}
export function markCompleted(id){const c=getCompleted();if(!c.includes(id)){c.push(id);save(K.COMPLETED,c);}}
export function isCompleted(id){return getCompleted().includes(id);}
export function getXP(){return safe(K.XP,0);}
export function addXP(n){const v=getXP()+n;save(K.XP,v);return v;}
export function getStreak(){const s=safe(K.STREAK,0),last=safe(K.LAST_DATE,null);if(!last)return 0;if(last===todayStr()||last===yestStr())return s;return 0;}
export function updateStreak(){const last=safe(K.LAST_DATE,null),today=todayStr(),yest=yestStr();let s=safe(K.STREAK,0);if(last===today)return s;s=(last===yest)?s+1:1;save(K.STREAK,s);save(K.LAST_DATE,today);return s;}
export function getBadges(){return safe(K.BADGES,[]);}
export function awardBadge(id){const b=getBadges();if(b.includes(id))return false;b.push(id);save(K.BADGES,b);return true;}
export function getQuizScore(modId){return(safe(K.QUIZ,{}))[modId]||0;}
export function saveQuizScore(modId,score){const q=safe(K.QUIZ,{});q[modId]=Math.max(score,q[modId]||0);save(K.QUIZ,q);}
export function isDailyChallengeComplete(id){const d=safe(K.DAILY_DONE,{});return(d[todayStr()]||[]).includes(id);}
export function markDailyChallengeComplete(id){const d=safe(K.DAILY_DONE,{});const t=todayStr();if(!d[t])d[t]=[];if(!d[t].includes(id))d[t].push(id);save(K.DAILY_DONE,d);}
export function isOnboarded(){return safe(K.ONBOARDED,false);}
export function setOnboarded(){save(K.ONBOARDED,true);}
export function trackSpeedLesson(){const today=todayStr();if(safe(K.SPEED_START,null)!==today){save(K.SPEED_START,today);save(K.SPEED_COUNT,1);return 1;}const n=safe(K.SPEED_COUNT,0)+1;save(K.SPEED_COUNT,n);return n;}

// ── SRS (Spaced Repetition — SM-2 simplified) ────────────────────────────────
export function getSRSCards(){return safe(K.SRS_CARDS,{});}
export function getSRSCard(id){return getSRSCards()[id]||{interval:0,easeFactor:2.5,due:0,reviews:0};}
export function updateSRSCard(cardId,rating){
  const cards=getSRSCards();
  const card=cards[cardId]||{interval:0,easeFactor:2.5,due:0,reviews:0};
  let{interval,easeFactor}=card;
  const DAY=86400000;
  if(rating===1){interval=0;easeFactor=Math.max(1.3,easeFactor-0.2);}
  else if(rating===2){interval=interval<1?1:Math.ceil(interval*1.2);easeFactor=Math.max(1.3,easeFactor-0.15);}
  else if(rating===3){interval=interval<1?1:Math.ceil(interval*easeFactor);}
  else{interval=interval<1?4:Math.ceil(interval*easeFactor*1.3);easeFactor=Math.min(3.0,easeFactor+0.1);}
  interval=Math.min(365,Math.max(0,interval));
  const due=Date.now()+interval*DAY;
  cards[cardId]={interval,easeFactor,due,reviews:(card.reviews||0)+1};
  save(K.SRS_CARDS,cards);
  return cards[cardId];
}
export function getDueCards(allIds){const cards=getSRSCards();const now=Date.now();return allIds.filter(id=>{const c=cards[id];return!c||c.due<=now;});}
export function getCardsDueCount(allIds){return getDueCards(allIds).length;}
export function getSRSStats(){return safe(K.SRS_STATS,{reviewed:0,correct:0});}
export function recordSRSReview(wasCorrect){const s=getSRSStats();s.reviewed+=1;if(wasCorrect)s.correct+=1;save(K.SRS_STATS,s);}

// ── Levels — unique names, no Salesforce trademarks ──────────────────────────
const LEVELS=[
  {level:1,title:'Rookie',         min:0,   next:100 },
  {level:2,title:'Syntax Scout',   min:100, next:300 },
  {level:3,title:'Code Builder',   min:300, next:600 },
  {level:4,title:'Logic Writer',   min:600, next:1000},
  {level:5,title:'Query Crafter',  min:1000,next:1500},
  {level:6,title:'Trigger Smith',  min:1500,next:2200},
  {level:7,title:'Limit Bender',   min:2200,next:3200},
  {level:8,title:'Async Ninja',    min:3200,next:4500},
  {level:9,title:'Test Engineer',  min:4500,next:6000},
  {level:10,title:'Apex Pro',      min:6000,next:9999},
];
export function getLevel(xp){for(let i=LEVELS.length-1;i>=0;i--){if(xp>=LEVELS[i].min)return LEVELS[i];}return LEVELS[0];}
export function getLevelProgress(xp){const lv=getLevel(xp);if(lv.level===10)return 100;return Math.min(100,Math.round(((xp-lv.min)/(lv.next-lv.min))*100));}
export function resetAll(){Object.values(K).forEach(k=>{try{localStorage.removeItem(k);}catch{}});}
