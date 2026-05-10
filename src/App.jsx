import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './styles/globals.css';
import { CURRICULUM, CHEAT_SHEETS, BADGES, DAILY_CHALLENGES, TOTAL_LESSONS, TOTAL_XP, TOTAL_MODULES } from './data/curriculum.js';
import { FLASHCARDS, FLASHCARD_DECKS, TOTAL_CARDS } from './data/flashcards.js';
import { runApex, checkAnswer } from './utils/apexRunner.js';
import {
  getCompleted, markCompleted, isCompleted, getXP, addXP,
  getStreak, updateStreak, getBadges, awardBadge, getLevel, getLevelProgress,
  getQuizScore, saveQuizScore, isDailyChallengeComplete, markDailyChallengeComplete,
  isOnboarded, setOnboarded, trackSpeedLesson, resetAll,
  getDueCards, getCardsDueCount, updateSRSCard, getSRSCard, getSRSStats, recordSRSReview,
} from './utils/storage.js';

// ─── MARKDOWN RENDERER ────────────────────────────────────────────────────────
function inlineFmt(text) {
  if (!text) return text;
  const parts = [], re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0, k = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={k++}>{text.slice(last, m.index)}</span>);
    const s = m[0];
    parts.push(s.startsWith('`')
      ? <code key={k++} className="ic">{s.slice(1,-1)}</code>
      : <strong key={k++}>{s.slice(2,-2)}</strong>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(<span key={k++}>{text.slice(last)}</span>);
  return parts.length ? parts : text;
}

function renderMD(text) {
  if (!text) return null;
  const lines = text.trim().split('\n'), out = []; let i = 0, k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith('## ')) { out.push(<h2 key={k++}>{line.slice(3)}</h2>); i++; continue; }
    if (line.startsWith('### ')) { out.push(<h3 key={k++}>{line.slice(4)}</h3>); i++; continue; }
    if (line.startsWith('```')) {
      const codeLines = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
      i++;
      out.push(<pre key={k++}><code>{codeLines.join('\n')}</code></pre>);
      continue;
    }
    if (line.startsWith('> ')) { out.push(<div key={k++} className="callout">{inlineFmt(line.slice(2))}</div>); i++; continue; }
    if (line.includes('|') && lines[i+1] && lines[i+1].match(/^\|?[-| ]+\|?$/)) {
      const rows = [];
      while (i < lines.length && lines[i].includes('|')) { rows.push(lines[i]); i++; }
      const pr = r => r.split('|').map(c=>c.trim()).filter(c=>c!=='');
      const [head,,...body] = rows;
      out.push(<table key={k++}><thead><tr>{pr(head).map((c,j)=><th key={j}>{c}</th>)}</tr></thead>
        <tbody>{body.map((r,ri)=><tr key={ri}>{pr(r).map((c,j)=><td key={j}>{inlineFmt(c)}</td>)}</tr>)}</tbody></table>);
      continue;
    }
    if (line.match(/^[-*] /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) { items.push(<li key={i}>{inlineFmt(lines[i].slice(2))}</li>); i++; }
      out.push(<ul key={k++}>{items}</ul>); continue;
    }
    if (line.match(/^\d+\. /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) { items.push(<li key={i}>{inlineFmt(lines[i].replace(/^\d+\. /,''))}</li>); i++; }
      out.push(<ol key={k++}>{items}</ol>); continue;
    }
    out.push(<p key={k++}>{inlineFmt(line)}</p>); i++;
  }
  return out;
}

// Strip markdown to plain text for TTS
function mdToPlainText(text) {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, '')   // remove code blocks
    .replace(/#{1,3} /g, '')           // remove headers
    .replace(/\*\*/g, '')              // remove bold
    .replace(/`[^`]+`/g, '')           // remove inline code
    .replace(/\|[^|\n]+/g, '')         // remove table cells
    .replace(/^[-*] /gm, '')           // remove list markers
    .replace(/^\d+\. /gm, '')          // remove numbered list markers
    .replace(/^> /gm, '')              // remove blockquotes
    .replace(/\n{3,}/g, '\n\n')        // collapse blank lines
    .trim();
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toasts({ toasts, remove }) {
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => remove(t.id)}>
          <span className="toast-icon">{t.icon}</span>
          <div><div className="toast-title">{t.title}</div>{t.sub && <div className="toast-sub">{t.sub}</div>}</div>
        </div>
      ))}
    </div>
  );
}
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback(t => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p.slice(-4), {...t, id}]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 4500);
  }, []);
  const remove = useCallback(id => setToasts(p => p.filter(x => x.id !== id)), []);
  return { toasts, add, remove };
}

// ─── TTS READER ────────────────────────────────────────────────────────────────
function TTSReader({ text, onClose }) {
  const [state, setState] = useState('idle'); // idle | playing | paused
  const [progress, setProgress] = useState(0);
  const uttRef = useRef(null);
  const intervalRef = useRef(null);

  const plainText = useMemo(() => mdToPlainText(text), [text]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      clearInterval(intervalRef.current);
    };
  }, []);

  const play = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(plainText);
    utt.rate = 0.95;
    utt.pitch = 1;
    utt.lang = 'en-US';
    utt.onstart = () => { setState('playing'); setProgress(0); };
    utt.onend = () => { setState('idle'); setProgress(100); clearInterval(intervalRef.current); };
    utt.onerror = () => { setState('idle'); clearInterval(intervalRef.current); };
    // Estimate progress
    const wordCount = plainText.split(/\s+/).length;
    const estimatedMs = (wordCount / 2.5) * 1000; // ~2.5 words/sec at 0.95 rate
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(99, Math.round((elapsed / estimatedMs) * 100)));
    }, 500);
    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
    setState('playing');
  };

  const pause = () => {
    window.speechSynthesis?.pause();
    setState('paused');
    clearInterval(intervalRef.current);
  };

  const resume = () => {
    window.speechSynthesis?.resume();
    setState('playing');
    // resume progress tracking
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setState('idle');
    setProgress(0);
    clearInterval(intervalRef.current);
  };

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <div className="tts-bar">
      <span className="tts-icon">🎧</span>
      <span className="tts-label">Listen to this lesson</span>
      <div className="tts-progress-track">
        <div className="tts-progress-fill" style={{width:`${state==='idle'?0:progress}%`}}/>
      </div>
      {!supported ? (
        <span className="tts-unsupported">Not supported in this browser</span>
      ) : (
        <div className="tts-controls">
          {state === 'idle'    && <button className="tts-btn" onClick={play}>▶ Read</button>}
          {state === 'playing' && <button className="tts-btn" onClick={pause}>⏸ Pause</button>}
          {state === 'paused'  && <button className="tts-btn" onClick={resume}>▶ Resume</button>}
          {state !== 'idle'    && <button className="tts-btn tts-stop" onClick={stop}>■ Stop</button>}
        </div>
      )}
    </div>
  );
}

// ─── CODE EDITOR ─────────────────────────────────────────────────────────────
function CodeEditor({ value, onChange }) {
  const ref = useRef();
  const lines = (value.match(/\n/g) || []).length + 1;
  const handleKey = (e) => {
    const ta = ref.current;
    const s = ta.selectionStart, en = ta.selectionEnd;
    if (e.key === 'Tab') {
      e.preventDefault();
      const nv = value.slice(0,s) + '    ' + value.slice(en);
      onChange(nv);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 4; }, 0);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const line = value.slice(0,s).split('\n').pop();
      const indent = line.match(/^(\s*)/)[1];
      const extra = line.trimEnd().endsWith('{') ? '    ' : '';
      const nv = value.slice(0,s) + '\n' + indent + extra + value.slice(en);
      onChange(nv);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 1 + indent.length + extra.length; }, 0);
    }
    const pairs = {'(':')', '{':'}', '[':']'};
    if (pairs[e.key] && s === en) {
      e.preventDefault();
      const nv = value.slice(0,s) + e.key + pairs[e.key] + value.slice(en);
      onChange(nv);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 1; }, 0);
    }
  };
  return (
    <div className="editor-wrap">
      <div className="editor-inner">
        <div className="line-nums" aria-hidden>
          {Array.from({length: lines}, (_,i) => <div key={i}>{i+1}</div>)}
        </div>
        <textarea ref={ref} className="editor-textarea" value={value}
          onChange={e => onChange(e.target.value)} onKeyDown={handleKey}
          spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
          placeholder="// Write your Apex code here…" />
      </div>
    </div>
  );
}

// ─── DEBUG CONSOLE ────────────────────────────────────────────────────────────
function Console({ lines, onClear }) {
  const ref = useRef();
  useEffect(() => { ref.current?.scrollTo(0, 99999); }, [lines]);
  const hasError = lines.some(l => l.type === 'error');
  return (
    <div className="console">
      <div className="console-bar">
        <span className={`console-dot ${lines.length ? (hasError ? 'red' : 'green') : ''}`}/>
        <span className="console-label">DEBUG LOG</span>
        {lines.length > 0 && <button className="console-clear" onClick={onClear}>clear</button>}
      </div>
      <div className="console-body" ref={ref}>
        {lines.length === 0
          ? <div className="console-empty">Run your code to see output…</div>
          : lines.map((l, i) => (
            <div key={i} className={`console-line ${l.type||''}`}>
              <span className="ln-num">[{String(i+1).padStart(2,'0')}]</span>
              <span className="ln-val">{l.text}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function OnboardingModal({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: '⚡', title: 'Welcome to ApexLearn', body: 'The most effective way to learn Salesforce Apex — built by developers, for developers. Interactive lessons, a real code editor, boss quizzes, and flashcards. Free forever.' },
    { icon: '✏️', title: 'Write & Run Real Apex', body: 'Every lesson has a live code editor. Write actual Apex syntax, hit Run, and see your debug output instantly. Get specific feedback on syntax errors vs. wrong output — so you always know exactly what to fix.' },
    { icon: '🧠', title: 'Flashcards + Streaks', body: 'Our spaced repetition flashcard system (SRS) surfaces the cards you need to review at exactly the right time. Build daily streaks, earn XP, and unlock 20 achievements as you progress from Rookie to Apex Pro.' },
  ];
  const s = steps[step];
  return (
    <div className="modal-overlay">
      <div className="modal onboarding-modal">
        <div className="onboarding-icon">{s.icon}</div>
        <div className="onboarding-dots">{steps.map((_,i)=><span key={i} className={`dot ${i===step?'active':''}`}/>)}</div>
        <h2 className="onboarding-title">{s.title}</h2>
        <p className="onboarding-body">{s.body}</p>
        <div className="disclaimer-note">
          ⚠️ Independent educational project — not affiliated with or endorsed by Salesforce.
        </div>
        <div className="onboarding-footer">
          {step < steps.length-1
            ? <button className="btn-primary" onClick={() => setStep(s=>s+1)}>Next →</button>
            : <button className="btn-primary" onClick={onDone}>Let's Go! 🚀</button>}
        </div>
      </div>
    </div>
  );
}

// ─── FLASHCARD PAGE ───────────────────────────────────────────────────────────
function FlashcardPage({ onBack, addToast }) {
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [sessionCards, setSessionCards] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [stats, setStats] = useState({ again:0, hard:0, good:0, easy:0 });
  const [showAllDecks, setShowAllDecks] = useState(false);
  const srsStats = getSRSStats();

  const startDeck = (deckId) => {
    const deckCards = FLASHCARDS.filter(c => deckId === 'all' || c.deck === deckId);
    const dueIds = getDueCards(deckCards.map(c => c.id));
    const due = dueIds.map(id => deckCards.find(c => c.id === id)).filter(Boolean);
    // Shuffle
    const shuffled = due.sort(() => Math.random() - 0.5);
    setSessionCards(shuffled.length > 0 ? shuffled : deckCards.sort(() => Math.random() - 0.5).slice(0, 10));
    setCurrentIdx(0);
    setFlipped(false);
    setSessionDone(false);
    setStats({ again:0, hard:0, good:0, easy:0 });
    setSelectedDeck(deckId);
  };

  const rate = (rating) => {
    const card = sessionCards[currentIdx];
    updateSRSCard(card.id, rating);
    recordSRSReview(rating >= 3);
    const label = ['','again','hard','good','easy'][rating];
    setStats(s => ({...s, [label]: s[label]+1}));
    if (currentIdx + 1 >= sessionCards.length) {
      setSessionDone(true);
      const xpEarned = sessionCards.length * 3;
      addXP(xpEarned);
      addToast({ type: 'xp', icon: '🧠', title: `+${xpEarned} XP`, sub: `Reviewed ${sessionCards.length} cards` });
      awardBadge('first-flashcard');
    } else {
      setCurrentIdx(i => i+1);
      setFlipped(false);
    }
  };

  const allDueCount = getCardsDueCount(FLASHCARDS.map(c => c.id));

  // Deck selection
  if (!selectedDeck) {
    return (
      <div className="flashcard-page">
        <div className="fc-page-header">
          <button className="btn-ghost btn-sm" onClick={onBack}>← Back</button>
          <div>
            <h1 className="fc-page-title">🧠 Flashcards</h1>
            <p className="fc-page-sub">Spaced repetition — review at the perfect moment for long-term memory</p>
          </div>
          <div className="fc-global-stats">
            <div className="fc-stat"><div className="fc-stat-val">{TOTAL_CARDS}</div><div className="fc-stat-label">Total Cards</div></div>
            <div className="fc-stat"><div className="fc-stat-val" style={{color:'var(--orange)'}}>{allDueCount}</div><div className="fc-stat-label">Due Now</div></div>
            <div className="fc-stat"><div className="fc-stat-val" style={{color:'var(--green)'}}>{srsStats.reviewed}</div><div className="fc-stat-label">Reviewed</div></div>
          </div>
        </div>

        {/* Study All due */}
        {allDueCount > 0 && (
          <div className="fc-study-all" onClick={() => startDeck('all')}>
            <div className="fc-study-all-icon">⚡</div>
            <div>
              <div className="fc-study-all-title">Study All Due Cards</div>
              <div className="fc-study-all-sub">{allDueCount} cards across all decks are due for review</div>
            </div>
            <button className="btn-primary">Study Now</button>
          </div>
        )}

        <div className="fc-decks-grid">
          {FLASHCARD_DECKS.map(deck => {
            const deckCards = FLASHCARDS.filter(c => c.deck === deck.id);
            const due = getCardsDueCount(deckCards.map(c => c.id));
            return (
              <div key={deck.id} className="fc-deck-card" style={{'--dc': deck.color}} onClick={() => startDeck(deck.id)}>
                <div className="fc-deck-icon" style={{background:`${deck.color}20`}}>{deck.icon}</div>
                <div className="fc-deck-title">{deck.title}</div>
                <div className="fc-deck-desc">{deck.description}</div>
                <div className="fc-deck-footer">
                  <span className="fc-deck-count">{deckCards.length} cards</span>
                  {due > 0 && <span className="fc-deck-due">{due} due</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="fc-srs-explainer">
          <div className="fc-srs-title">How SRS works</div>
          <div className="fc-srs-body">
            Rate each card after reviewing. <strong>Easy</strong> = show again in weeks. <strong>Good</strong> = show in days. <strong>Hard</strong> = show tomorrow. <strong>Again</strong> = show immediately. The system surfaces cards exactly when you're about to forget them.
          </div>
        </div>
      </div>
    );
  }

  // Session done
  if (sessionDone) {
    const total = stats.again + stats.hard + stats.good + stats.easy;
    const correct = stats.good + stats.easy;
    const pct = total > 0 ? Math.round((correct/total)*100) : 0;
    return (
      <div className="flashcard-page">
        <div className="fc-done">
          <div className="fc-done-icon">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📖'}</div>
          <h2 className="fc-done-title">Session Complete!</h2>
          <div className="fc-done-pct" style={{color: pct>=80?'var(--green)':pct>=60?'var(--blue)':'var(--orange)'}}>{pct}% correct</div>
          <div className="fc-done-breakdown">
            <div className="fc-done-stat"><span className="rate-dot again">↩</span> Again: {stats.again}</div>
            <div className="fc-done-stat"><span className="rate-dot hard">⟳</span> Hard: {stats.hard}</div>
            <div className="fc-done-stat"><span className="rate-dot good">✓</span> Good: {stats.good}</div>
            <div className="fc-done-stat"><span className="rate-dot easy">★</span> Easy: {stats.easy}</div>
          </div>
          <div className="fc-done-actions">
            <button className="btn-primary" onClick={() => startDeck(selectedDeck)}>Study Again</button>
            <button className="btn-ghost" onClick={() => setSelectedDeck(null)}>All Decks</button>
          </div>
        </div>
      </div>
    );
  }

  const card = sessionCards[currentIdx];
  if (!card) return null;
  const cardSRS = getSRSCard(card.id);
  const remaining = sessionCards.length - currentIdx;

  return (
    <div className="flashcard-page">
      <div className="fc-session-header">
        <button className="btn-ghost btn-sm" onClick={() => setSelectedDeck(null)}>← Decks</button>
        <div className="fc-progress-info">
          <span className="fc-progress-text">{currentIdx+1} / {sessionCards.length}</span>
          <div className="fc-progress-bar">
            <div className="fc-progress-fill" style={{width:`${((currentIdx)/sessionCards.length)*100}%`}}/>
          </div>
        </div>
        <span className="fc-remaining">{remaining} left</span>
      </div>

      {/* Card */}
      <div className={`fc-card-container ${flipped ? 'flipped' : ''}`} onClick={() => !flipped && setFlipped(true)}>
        <div className="fc-card">
          <div className="fc-card-front">
            <div className="fc-card-deck">{FLASHCARD_DECKS.find(d=>d.id===card.deck)?.icon} {FLASHCARD_DECKS.find(d=>d.id===card.deck)?.title}</div>
            <div className="fc-card-question">{card.front}</div>
            <div className="fc-card-tap-hint">Tap to reveal answer →</div>
          </div>
          <div className="fc-card-back">
            <div className="fc-card-answer">{card.back}</div>
            {card.code && (
              <pre className="fc-card-code">{card.code}</pre>
            )}
          </div>
        </div>
      </div>

      {/* Rating buttons — only show after flip */}
      {flipped ? (
        <div className="fc-rating">
          <div className="fc-rating-label">How well did you know this?</div>
          <div className="fc-rating-btns">
            <button className="fc-rate-btn again" onClick={() => rate(1)}>
              <span className="fc-rate-icon">↩</span>
              <span className="fc-rate-label">Again</span>
              <span className="fc-rate-sub">&lt;1 min</span>
            </button>
            <button className="fc-rate-btn hard" onClick={() => rate(2)}>
              <span className="fc-rate-icon">⟳</span>
              <span className="fc-rate-label">Hard</span>
              <span className="fc-rate-sub">1 day</span>
            </button>
            <button className="fc-rate-btn good" onClick={() => rate(3)}>
              <span className="fc-rate-icon">✓</span>
              <span className="fc-rate-label">Good</span>
              <span className="fc-rate-sub">{Math.max(1, Math.ceil((cardSRS.interval||1)*2.5))} days</span>
            </button>
            <button className="fc-rate-btn easy" onClick={() => rate(4)}>
              <span className="fc-rate-icon">★</span>
              <span className="fc-rate-label">Easy</span>
              <span className="fc-rate-sub">{Math.max(4, Math.ceil((cardSRS.interval||1)*3))} days</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="fc-flip-prompt">
          <div className="fc-flip-hint">👆 Tap the card to see the answer</div>
          <div className="fc-keyboard-hint">or press <kbd>Space</kbd></div>
        </div>
      )}
    </div>
  );
}

// ─── BOSS QUIZ ────────────────────────────────────────────────────────────────
function BossQuiz({ mod, onDone, addToast }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const questions = mod.quizQuestions || [];

  const submit = () => {
    let sc = 0;
    questions.forEach((q,i) => { if (answers[i] === q.answer) sc++; });
    setScore(sc);
    setSubmitted(true);
    const xpEarned = sc * 20;
    addXP(xpEarned);
    saveQuizScore(mod.id, sc);
    if (sc === questions.length) {
      awardBadge('quiz-perfect');
      addToast({ type:'badge', icon:'🎯', title:'Perfect Score!', sub:`${sc}/${questions.length} — +${xpEarned} XP` });
    } else {
      addToast({ type:'xp', icon:'⭐', title:`+${xpEarned} XP`, sub:`Quiz: ${sc}/${questions.length}` });
    }
  };

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <div className="quiz-badge">⚔️ BOSS QUIZ</div>
        <h2>{mod.title} — Final Test</h2>
        <p>{questions.length} questions · +{questions.length*20} XP possible</p>
      </div>
      <div className="quiz-questions">
        {questions.map((q,qi) => (
          <div key={qi} className={`quiz-q ${submitted?(answers[qi]===q.answer?'correct':'wrong'):''}`}>
            <div className="quiz-q-num">Q{qi+1}</div>
            <div className="quiz-q-text">{q.q}</div>
            <div className="quiz-options">
              {q.options.map((opt,oi) => (
                <button key={oi}
                  className={`quiz-opt ${answers[qi]===oi?'selected':''} ${submitted?(oi===q.answer?'answer':answers[qi]===oi?'wrong-pick':''):''}`}
                  onClick={() => !submitted && setAnswers(a=>({...a,[qi]:oi}))}>
                  <span className="quiz-opt-letter">{['A','B','C','D'][oi]}</span>{opt}
                </button>
              ))}
            </div>
            {submitted && <div className={`quiz-feedback ${answers[qi]===q.answer?'fb-correct':'fb-wrong'}`}>
              {answers[qi]===q.answer ? '✅ Correct!' : `❌ Answer: ${q.options[q.answer]}`}
            </div>}
          </div>
        ))}
      </div>
      {!submitted
        ? <button className="btn-primary btn-wide" disabled={Object.keys(answers).length < questions.length} onClick={submit}>
            Submit ({Object.keys(answers).length}/{questions.length})
          </button>
        : <div className="quiz-result">
            <div className={`quiz-score-big ${score===questions.length?'perfect':''}`}>{score}/{questions.length}</div>
            <div className="quiz-score-label">{score===questions.length?'🏆 Perfect!':score>=3?'✅ Passed!':'📖 Review & retry'}</div>
            <div className="quiz-xp-earned">+{score*20} XP earned</div>
            <button className="btn-primary" onClick={() => onDone(score)}>Back to Module</button>
          </div>}
    </div>
  );
}

// ─── DAILY CHALLENGE ─────────────────────────────────────────────────────────
function DailyChallengePage({ challenge, onDone, addToast }) {
  const [code, setCode] = useState(challenge.starterCode);
  const [lines, setLines] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(isDailyChallengeComplete(challenge.id));

  const run = () => {
    const { output, error } = runApex(code);
    const ls = [];
    if (error) {
      output.forEach(t => ls.push({text:t,type:''}));
      ls.push({text:'⚠ '+error, type:'error'});
      setFeedback({ type:'syntax', message: error });
    } else {
      output.forEach(t => ls.push({text:t,type:''}));
      const pass = checkAnswer(output, challenge.expectedOutput);
      if (pass) {
        setFeedback({ type:'pass' });
        if (!done) {
          markDailyChallengeComplete(challenge.id);
          const newXP = addXP(challenge.xpBonus);
          updateStreak();
          setDone(true);
          awardBadge('daily-challenge');
          addToast({ type:'xp', icon:'📅', title:`Daily Complete! +${challenge.xpBonus} XP`, sub:'Bonus XP earned!' });
        }
      } else {
        setFeedback({ type:'wrong-output', got: output, expected: challenge.expectedOutput });
      }
    }
    ls.push({text:`→ ${new Date().toLocaleTimeString()}`, type:'system'});
    setLines(ls);
  };

  return (
    <div className="daily-page">
      <div className="daily-header">
        <div className="daily-badge">📅 DAILY CHALLENGE</div>
        <h2>{challenge.title}</h2>
        <span className="daily-xp-pill">+{challenge.xpBonus} Bonus XP</span>
        {done && <span className="daily-done-chip">✓ Completed Today</span>}
      </div>
      <div className="daily-body">
        <div className="daily-instructions">{challenge.instructions}</div>
        <CodeEditor value={code} onChange={setCode} />
        <FeedbackBar feedback={feedback} xpEarned={challenge.xpBonus} isDone={done} />
        <div className="editor-toolbar">
          <button className="btn-run" onClick={run}>▶ Run</button>
          <button className="btn-ghost btn-sm" onClick={() => { setCode(challenge.starterCode); setLines([]); setFeedback(null); }}>↺ Reset</button>
          <button className="btn-ghost btn-sm" onClick={() => setCode(challenge.solution)}>🔑 Solution</button>
          <button className="btn-ghost btn-sm ml-auto" onClick={onDone}>← Back</button>
        </div>
        <Console lines={lines} onClear={() => setLines([])} />
      </div>
    </div>
  );
}

// ─── FEEDBACK BAR — smart error messages ─────────────────────────────────────
// FIX #2: Distinguish syntax errors from wrong output
function FeedbackBar({ feedback, xpEarned, isDone, onNext }) {
  if (!feedback) return null;

  if (feedback.type === 'syntax') {
    return (
      <div className="feedback syntax-error">
        <div className="fb-icon">🔴</div>
        <div className="fb-content">
          <div className="fb-title">Syntax / Runtime Error</div>
          <div className="fb-detail">
            Your code has an error that prevented it from running: <code className="ic">{feedback.message}</code>
            <div className="fb-tip">💡 Check spelling, missing semicolons, and bracket pairs.</div>
          </div>
        </div>
      </div>
    );
  }

  if (feedback.type === 'wrong-output') {
    const got = (feedback.got || []).join(', ') || '(nothing)';
    const expected = (feedback.expected || []).join(', ');
    return (
      <div className="feedback wrong-output">
        <div className="fb-icon">🟡</div>
        <div className="fb-content">
          <div className="fb-title">Code ran — but output doesn't match</div>
          <div className="fb-detail">
            <div className="fb-row"><span className="fb-label got">Your output:</span> <code className="ic">{got}</code></div>
            <div className="fb-row"><span className="fb-label expected">Expected:</span> <code className="ic">{expected}</code></div>
            <div className="fb-tip">💡 Your syntax is correct — just adjust your logic or values to match the expected output.</div>
          </div>
        </div>
      </div>
    );
  }

  if (feedback.type === 'pass') {
    return (
      <div className="feedback pass">
        <div className="fb-icon">✅</div>
        <div className="fb-content">
          <div className="fb-title">{isDone ? 'Correct! (XP already earned)' : `Correct! +${xpEarned} XP earned!`}</div>
        </div>
        {onNext && <button className="btn-next" onClick={onNext}>Next →</button>}
      </div>
    );
  }

  return null;
}

// ─── CHEAT SHEET PAGE ────────────────────────────────────────────────────────
function CheatSheetPage({ sheet, onBack }) {
  return (
    <div className="cheatsheet-page">
      <div className="cheatsheet-header">
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <h1>{sheet.icon} {sheet.title}</h1>
      </div>
      <div className="cheatsheet-grid">
        {sheet.sections.map((sec,i) => (
          <div key={i} className="cheatsheet-card">
            <div className="cheatsheet-section-title">{sec.title}</div>
            <pre className="cheatsheet-code">{sec.content}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ current, onSelect, completed, onHome, onCheatSheets, onDailyChallenge, onFlashcards, streak, xp }) {
  const [expanded, setExpanded] = useState(() => {
    const m = CURRICULUM.find(m => m.lessons.some(l => l.id === current?.lessonId));
    return m ? m.id : null;
  });
  const toggle = id => setExpanded(e => e === id ? null : id);
  const lv = getLevel(xp);
  const prog = getLevelProgress(xp);
  const allDue = getCardsDueCount(FLASHCARDS.map(c => c.id));

  return (
    <nav className="sidebar">
      <div className="sidebar-logo" onClick={onHome}>
        <div className="logo-mark">A</div>
        <span className="logo-text">ApexLearn</span>
      </div>

      <div className="sidebar-level">
        <div className="sidebar-level-row">
          <span className="lv-badge">Lv.{lv.level}</span>
          <span className="lv-title">{lv.title}</span>
          <span className="lv-xp">{xp} XP</span>
        </div>
        <div className="lv-bar-track"><div className="lv-bar-fill" style={{width:`${prog}%`}}/></div>
      </div>

      <div className="sidebar-links">
        <button className="sidebar-link" onClick={onFlashcards}>
          <span>🧠</span> Flashcards
          {allDue > 0 && <span className="sidebar-link-badge hot">{allDue} due</span>}
        </button>
        <button className="sidebar-link" onClick={onDailyChallenge}>
          <span>📅</span> Daily Challenge
          <span className="sidebar-link-badge hot">+XP</span>
        </button>
        <button className="sidebar-link" onClick={onCheatSheets}>
          <span>📋</span> Cheat Sheets
        </button>
      </div>

      <div className="sidebar-divider"/>
      <div className="sidebar-section-label">Curriculum</div>

      {CURRICULUM.map(mod => {
        const done = mod.lessons.filter(l => completed.includes(l.id)).length;
        const isOpen = expanded === mod.id;
        return (
          <div key={mod.id} className="sidebar-module">
            <div className={`sidebar-module-hd ${isOpen?'open':''}`} onClick={() => toggle(mod.id)}>
              <span className="sidebar-mod-icon" style={{background:`${mod.color}20`}}>{mod.icon}</span>
              <div className="sidebar-mod-info">
                <div className="sidebar-mod-title">{mod.title}</div>
                <div className="sidebar-mod-meta">{done}/{mod.lessons.length}</div>
              </div>
              <span className={`sidebar-chevron ${isOpen?'open':''}`}>▾</span>
            </div>
            {isOpen && mod.lessons.map(lesson => {
              const lDone = completed.includes(lesson.id);
              const active = current?.lessonId === lesson.id;
              return (
                <div key={lesson.id}
                  className={`sidebar-lesson ${active?'active':''} ${lDone?'done':''}`}
                  onClick={() => onSelect(mod.id, lesson.id)}>
                  <span className={`lesson-dot ${lDone?'done':active?'active':''}`}>{lDone?'✓':''}</span>
                  <span className="lesson-name">{lesson.title}</span>
                  <span className="lesson-xp">+{lesson.xp}</span>
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="sidebar-ad">
        <span>📢</span><span>Ad Placeholder</span>
        <span style={{fontSize:10,opacity:.6}}>160×250 · AdSense</span>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ onStart, completed, xp, streak, onDailyChallenge, onCheatSheet, onFlashcards }) {
  const donePct = Math.round((completed.length / TOTAL_LESSONS) * 100);
  const lv = getLevel(xp);
  const earnedBadges = getBadges();
  const allDue = getCardsDueCount(FLASHCARDS.map(c => c.id));

  const todayChallenge = useMemo(() => {
    const day = new Date().getDay();
    return DAILY_CHALLENGES[day % DAILY_CHALLENGES.length];
  }, []);

  const nextLesson = useMemo(() => {
    for (const mod of CURRICULUM) {
      for (const lesson of mod.lessons) {
        if (!completed.includes(lesson.id)) return { mod, lesson };
      }
    }
    return null;
  }, [completed]);

  return (
    <div className="home">
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">⚡ Free · No Login · Independent Project</div>
          <h1 className="hero-h1">Master<br/><span className="hero-gradient">Salesforce Apex.</span></h1>
          <p className="hero-sub">
            From variables to callouts — interactive lessons, a real code editor, boss quizzes,
            SRS flashcards, and daily challenges. Built specifically for Apex.
          </p>
          <div className="hero-stats">
            {[{val:TOTAL_MODULES,label:'Modules'},{val:TOTAL_LESSONS,label:'Lessons'},
              {val:TOTAL_CARDS,label:'Flashcards'},{val:'Free',label:'Forever'}].map(s => (
              <div key={s.label} className="hero-stat">
                <div className="hero-stat-val">{s.val}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="hero-actions">
            {nextLesson
              ? <button className="btn-primary btn-hero" onClick={() => onStart(nextLesson.mod.id, nextLesson.lesson.id)}>
                  {completed.length === 0 ? '🚀 Start Learning Free' : '▶ Continue Learning'}
                </button>
              : <div className="hero-complete">🏆 All modules complete!</div>}
            <button className="btn-ghost btn-hero-ghost" onClick={onFlashcards}>
              🧠 Flashcards {allDue > 0 && <span className="hero-due-badge">{allDue} due</span>}
            </button>
          </div>
        </div>
        <div className="hero-code">
          <div className="hero-code-bar">
            <span className="hcb-dot red"/><span className="hcb-dot yellow"/><span className="hcb-dot green"/>
            <span className="hcb-title">LeadScorer.apex</span>
          </div>
          <pre className="hero-code-body">{`public class LeadScorer {

  public static Integer score(Lead ld) {
    Integer pts = 0;

    if (ld.Title?.contains('VP'))   pts += 30;
    if (ld.Company != null)          pts += 20;
    if (ld.Email != null)            pts += 10;

    switch on ld.LeadSource {
      when 'Web'              { pts += 15; }
      when 'Partner Referral' { pts += 25; }
      when else               { pts += 5;  }
    }
    return pts;
  }
}`}</pre>
        </div>
      </div>

      {/* Progress */}
      {completed.length > 0 && (
        <div className="progress-card">
          <div className="progress-card-header">
            <div>
              <div className="progress-card-title">Your Journey</div>
              <div className="progress-card-sub">
                Lv.{lv.level} {lv.title} · {xp} XP
                {streak > 0 && <span className="streak-txt"> · 🔥 {streak}-day streak</span>}
              </div>
            </div>
            <div className="progress-pct-big">{donePct}%</div>
          </div>
          <div className="progress-track-big"><div className="progress-fill-big" style={{width:`${donePct}%`}}/></div>
          <div className="progress-lessons-done">{completed.length} / {TOTAL_LESSONS} lessons</div>
        </div>
      )}

      {/* Quick actions row */}
      <div className="quick-actions-row">
        <div className="quick-action" onClick={() => onDailyChallenge(todayChallenge)}>
          <span className="qa-icon">📅</span>
          <div className="qa-info">
            <div className="qa-title">Daily Challenge</div>
            <div className="qa-sub">+{todayChallenge.xpBonus} bonus XP</div>
          </div>
          <span className="qa-arrow">{isDailyChallengeComplete(todayChallenge.id)?'✓ Done':'Go →'}</span>
        </div>
        <div className="quick-action" onClick={onFlashcards}>
          <span className="qa-icon">🧠</span>
          <div className="qa-info">
            <div className="qa-title">Flashcards</div>
            <div className="qa-sub">{allDue > 0 ? `${allDue} cards due` : 'All caught up!'}</div>
          </div>
          <span className="qa-arrow">{allDue > 0 ? `${allDue} due →` : '✓'}</span>
        </div>
        <div className="quick-action" onClick={() => onCheatSheet(CHEAT_SHEETS[0])}>
          <span className="qa-icon">📋</span>
          <div className="qa-info">
            <div className="qa-title">Cheat Sheets</div>
            <div className="qa-sub">{CHEAT_SHEETS.length} quick references</div>
          </div>
          <span className="qa-arrow">View →</span>
        </div>
      </div>

      {/* Ad banner */}
      <div className="ad-banner">
        📢 Advertisement Placeholder — 728×90 — Replace with Google AdSense tag
      </div>

      {/* Modules */}
      <div className="section-header">
        <span>📚 Curriculum</span>
        <span className="section-sub">{TOTAL_MODULES} modules · Complete in order for best results</span>
      </div>
      <div className="module-grid">
        {CURRICULUM.map(mod => {
          const done = mod.lessons.filter(l => completed.includes(l.id)).length;
          const pct = Math.round((done/mod.lessons.length)*100);
          const qScore = getQuizScore(mod.id);
          return (
            <div key={mod.id} className="module-card" style={{'--mc':mod.color}}
              onClick={() => onStart(mod.id, mod.lessons[0].id)}>
              <div className="mc-top">
                <div className="mc-icon" style={{background:`${mod.color}20`}}>{mod.icon}</div>
                <div className="mc-info">
                  <div className="mc-title">{mod.title}</div>
                  <div className="mc-meta">{mod.lessons.length} lessons · {mod.xpTotal} XP</div>
                </div>
                {done===mod.lessons.length && <span className="mc-check">✓</span>}
              </div>
              <div className="mc-desc">{mod.description}</div>
              <div className="mc-footer">
                <div className="mc-prog-track"><div className="mc-prog-fill" style={{width:`${pct}%`,background:mod.color}}/></div>
                <span className="mc-prog-txt">{pct}%</span>
                {qScore>0 && <span className="mc-quiz-score">⚔️{qScore}/5</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cheat sheets */}
      <div className="section-header"><span>📋 Cheat Sheets</span></div>
      <div className="cheatsheet-list">
        {CHEAT_SHEETS.map(cs => (
          <div key={cs.id} className="cs-chip" onClick={() => onCheatSheet(cs)}>
            <span>{cs.icon}</span> {cs.title}
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="section-header">
        <span>🏅 Achievements</span>
        <span className="section-sub">{earnedBadges.length}/{BADGES.length} earned</span>
      </div>
      <div className="badges-grid">
        {BADGES.map(b => (
          <div key={b.id} className={`badge-card ${earnedBadges.includes(b.id)?'earned':'locked'}`}>
            <div className="badge-icon">{b.icon}</div>
            <div className="badge-title">{b.title}</div>
            <div className="badge-desc">{b.description}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="home-footer">
        <div className="disclaimer">
          ⚠️ ApexLearn is an independent educational project and is not affiliated with, endorsed by,
          or connected to Salesforce. All trademarks belong to their respective owners.
          Content is original and created for learning purposes only.
        </div>
        <button className="btn-reset" onClick={() => { if(confirm('Reset all progress?')) { resetAll(); window.location.reload(); } }}>
          Reset Progress
        </button>
      </div>
    </div>
  );
}

// ─── LESSON PAGE ─────────────────────────────────────────────────────────────
function LessonPage({ modId, lessonId, onBack, onComplete, onNavigate, completed, addToast }) {
  const mod = useMemo(() => CURRICULUM.find(m => m.id === modId), [modId]);
  const lesson = useMemo(() => mod?.lessons.find(l => l.id === lessonId), [mod, lessonId]);
  const [tab, setTab] = useState('exercise');
  const [code, setCode] = useState('');
  const [consoleLines, setConsoleLines] = useState([]);
  const [feedback, setFeedback] = useState(null);  // { type, message?, got?, expected? }
  const [modal, setModal] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (!lesson) return;
    setCode(lesson.exercise?.starterCode || '');
    setConsoleLines([]);
    setFeedback(null);
    setModal(null);
    setIsDone(isCompleted(lessonId));
    setTab('exercise');
  }, [lessonId]);

  const lessonIdx = mod?.lessons.findIndex(l => l.id === lessonId) ?? 0;
  const prevLesson = lessonIdx > 0 ? mod.lessons[lessonIdx-1] : null;
  const nextLesson = lessonIdx < (mod?.lessons.length??0)-1 ? mod.lessons[lessonIdx+1] : null;
  const modIdx = CURRICULUM.findIndex(m => m.id === modId);
  const nextMod = !nextLesson && modIdx < CURRICULUM.length-1 ? CURRICULUM[modIdx+1] : null;
  const allModDone = mod?.lessons.every(l => completed.includes(l.id));

  // FIX #2: Smart error detection
  const run = useCallback(() => {
    const { output, error } = runApex(code);
    const ls = [];

    if (error) {
      // Syntax / runtime error — code never ran properly
      output.forEach(t => ls.push({text:t,type:''}));
      ls.push({text:'⚠ '+error, type:'error'});
      setFeedback({ type:'syntax', message: error });
    } else {
      output.forEach(t => ls.push({text:t,type:''}));

      if (lesson?.exercise?.expectedOutput) {
        const pass = checkAnswer(output, lesson.exercise.expectedOutput);
        if (pass) {
          setFeedback({ type:'pass' });
          if (!isDone) {
            markCompleted(lessonId);
            const newXP = addXP(lesson.xp);
            const newStreak = updateStreak();
            setIsDone(true);
            const speedCount = trackSpeedLesson();
            onComplete(lessonId, lesson.xp, newXP, newStreak, speedCount);
          }
        } else {
          // Code ran fine — output just doesn't match
          setFeedback({ type:'wrong-output', got: output, expected: lesson.exercise.expectedOutput });
        }
      } else {
        setFeedback({ type:'pass' });
      }
    }

    ls.push({text:`→ ${new Date().toLocaleTimeString()}`, type:'system'});
    setConsoleLines(ls);
  }, [code, lesson, lessonId, isDone, onComplete]);

  const goNext = () => {
    if (nextLesson) onNavigate(modId, nextLesson.id);
    else if (nextMod) onNavigate(nextMod.id, nextMod.lessons[0].id);
  };

  if (!mod || !lesson) return <div className="empty-state">Lesson not found.</div>;
  if (showQuiz) return <BossQuiz mod={mod} onDone={() => setShowQuiz(false)} addToast={addToast}/>;

  return (
    <div className="lesson-page">
      <div className="lesson-topbar">
        <button className="btn-ghost btn-sm" onClick={onBack}>← Home</button>
        <div className="lesson-breadcrumb">
          <span className="lbc-mod">{mod.title}</span>
          <span className="lbc-sep">›</span>
          <span className="lbc-title">{lesson.title}</span>
        </div>
        <div className="lesson-topbar-right">
          {isDone && <span className="done-chip">✓ Done</span>}
          <span className="xp-chip">+{lesson.xp} XP</span>
          <button className="btn-ghost btn-sm" disabled={!prevLesson} onClick={() => prevLesson && onNavigate(modId, prevLesson.id)}>‹</button>
          <button className="btn-ghost btn-sm" disabled={!nextLesson&&!nextMod} onClick={goNext}>›</button>
        </div>
      </div>

      <div className="lesson-body">
        {/* Theory panel */}
        <div className="theory-panel">
          <div className="theory-inner">
            {/* TTS Reader — FIX #4 */}
            <TTSReader text={lesson.theory} />
            <div className="theory-content">{renderMD(lesson.theory)}</div>
          </div>
        </div>

        {/* Editor panel */}
        <div className="editor-panel">
          <div className="ep-tabs">
            {[['exercise','✏️ Exercise'],['example','📋 Example']].map(([id,label]) => (
              <button key={id} className={`ep-tab ${tab===id?'active':''}`} onClick={() => setTab(id)}>{label}</button>
            ))}
            {allModDone && mod.quizQuestions?.length > 0 && (
              <button className="ep-tab quiz-tab" onClick={() => setShowQuiz(true)}>
                ⚔️ Boss Quiz {getQuizScore(mod.id)>0?`(${getQuizScore(mod.id)}/5)`:''}
              </button>
            )}
          </div>

          {tab === 'example' ? (
            <div className="example-view">
              <div className="example-label">Code Example</div>
              <pre className="example-code">{lesson.codeExample}</pre>
            </div>
          ) : (
            <div className="exercise-view">
              <div className="exercise-banner">
                <div className="ex-title">🎯 {lesson.exercise?.title}</div>
                <div className="ex-instructions">{renderInstructions(lesson.exercise?.instructions)}</div>
              </div>
              <CodeEditor value={code} onChange={setCode} />
              {/* FIX #2: Smart feedback */}
              <FeedbackBar
                feedback={feedback}
                xpEarned={lesson.xp}
                isDone={isDone}
                onNext={(nextLesson||nextMod) ? goNext : null}
              />
            </div>
          )}

          <div className="editor-toolbar">
            <button className="btn-run" onClick={run}>▶ Run Code</button>
            <button className="btn-ghost btn-sm" onClick={() => { setCode(lesson.exercise?.starterCode||''); setConsoleLines([]); setFeedback(null); }}>↺ Reset</button>
            <button className="btn-ghost btn-sm" onClick={() => setModal('hint')}>💡 Hint</button>
            <button className="btn-ghost btn-sm" onClick={() => setModal('solution')}>🔑 Solution</button>
          </div>

          <Console lines={consoleLines} onClear={() => setConsoleLines([])} />
        </div>
      </div>

      {modal === 'hint' && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal">
            <div className="modal-title">💡 Hint</div>
            <div className="modal-body">{lesson.exercise?.hint}</div>
            <div className="modal-footer"><button className="btn-ghost" onClick={()=>setModal(null)}>Close</button></div>
          </div>
        </div>
      )}
      {modal === 'solution' && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal">
            <div className="modal-title">🔑 Solution</div>
            <div className="modal-body">One correct solution:</div>
            <pre className="modal-code">{lesson.exercise?.solution}</pre>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={()=>setModal(null)}>Close</button>
              <button className="btn-primary" onClick={()=>{setCode(lesson.exercise?.solution||'');setModal(null);}}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderInstructions(text) {
  if (!text) return null;
  return text.split('\n').map((line,i) => {
    if (!line) return <br key={i}/>;
    if (line.startsWith('```')) return null;
    const parts = line.split(/(`[^`]+`)/g).map((p,j) =>
      p.startsWith('`')&&p.endsWith('`') ? <code key={j} className="ic">{p.slice(1,-1)}</code> : <span key={j}>{p.replace(/\*\*/g,'')}</span>
    );
    return <div key={i} style={{marginBottom:2}}>{parts}</div>;
  });
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('home');
  const [currentMod, setCurrentMod] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentCS, setCurrentCS] = useState(null);
  const [currentDaily, setCurrentDaily] = useState(null);
  const [completed, setCompleted] = useState(getCompleted);
  const [xp, setXP] = useState(getXP);
  const [streak, setStreak] = useState(getStreak);
  const [showOnboard, setShowOnboard] = useState(!isOnboarded());
  const { toasts, add: addToast, remove: removeToast } = useToasts();

  const openLesson = useCallback((modId, lessonId) => {
    setCurrentMod(modId); setCurrentLesson(lessonId); setView('lesson'); window.scrollTo(0,0);
  }, []);

  const handleComplete = useCallback((lessonId, xpEarned, newXP, newStreak, speedCount) => {
    setCompleted(getCompleted()); setXP(newXP); setStreak(newStreak);
    addToast({ type:'xp', icon:'⭐', title:`+${xpEarned} XP`, sub:`Total: ${newXP} XP` });
    const all = getCompleted();
    const chk = (id, t) => { if (awardBadge(id)) addToast(t); };
    if (all.length===1) chk('first-lesson',{type:'badge',icon:'🚀',title:'First Steps!',sub:'First lesson done'});
    if (newXP>=100)  chk('xp-100', {type:'badge',icon:'⭐',title:'First 100 XP!',sub:''});
    if (newXP>=500)  chk('xp-500', {type:'badge',icon:'💫',title:'Power Learner!',sub:'500 XP'});
    if (newXP>=1000) chk('xp-1000',{type:'badge',icon:'✨',title:'XP Collector!',sub:'1000 XP'});
    if (newXP>=2500) chk('xp-2500',{type:'badge',icon:'🌠',title:'Dedication!',sub:'2500 XP'});
    if (newStreak>=3)  chk('streak-3', {type:'streak',icon:'🔥',title:'3-Day Streak!',sub:''});
    if (newStreak>=7)  chk('streak-7', {type:'streak',icon:'⚡',title:'Week Warrior!',sub:''});
    if (newStreak>=30) chk('streak-30',{type:'streak',icon:'🌟',title:'Monthly Master!',sub:''});
    if (speedCount>=5) chk('speed-run',{type:'badge',icon:'💨',title:'Speed Runner!',sub:'5 lessons today'});
    CURRICULUM.forEach(mod => {
      if (mod.lessons.every(l => all.includes(l.id))) {
        chk('first-module',{type:'badge',icon:mod.icon,title:'Module Complete!',sub:mod.title});
        const map = {collections:'collections-done',oop:'oop-done',soql:'soql-done',triggers:'triggers-done','async-apex':'async-done',testing:'testing-done'};
        if (map[mod.id]) chk(map[mod.id],{type:'badge',icon:mod.icon,title:`${mod.title} Master!`,sub:''});
      }
    });
    const doneMods = CURRICULUM.filter(m=>m.lessons.every(l=>all.includes(l.id))).length;
    if (doneMods>=8) chk('halfway',{type:'badge',icon:'🎯',title:'Halfway Hero!',sub:'8 modules done'});
    if (doneMods===CURRICULUM.length) chk('champion',{type:'badge',icon:'🏆',title:'APEX PRO!',sub:'All 15 modules!'});
  }, [addToast]);

  const openDaily = () => {
    const day = new Date().getDay();
    setCurrentDaily(DAILY_CHALLENGES[day % DAILY_CHALLENGES.length]);
    setView('daily');
  };

  return (
    <div className="app">
      <div className="top-ad">
        📢 Advertisement · 728×90 · Replace with Google AdSense tag
      </div>
      <div className="app-layout">
        <Sidebar
          current={{modId:currentMod, lessonId:currentLesson}}
          onSelect={openLesson}
          completed={completed}
          onHome={() => setView('home')}
          onCheatSheets={() => setView('cheatsheets')}
          onDailyChallenge={openDaily}
          onFlashcards={() => setView('flashcards')}
          streak={streak}
          xp={xp}
        />
        <main className="main">
          {view==='home' && <HomePage onStart={openLesson} completed={completed} xp={xp} streak={streak}
            onDailyChallenge={ch=>{setCurrentDaily(ch);setView('daily');}}
            onCheatSheet={cs=>{setCurrentCS(cs);setView('cheatsheet');}}
            onFlashcards={()=>setView('flashcards')} />}
          {view==='lesson' && <LessonPage modId={currentMod} lessonId={currentLesson} onBack={()=>setView('home')}
            onComplete={handleComplete} onNavigate={openLesson} completed={completed} addToast={addToast} />}
          {view==='flashcards' && <FlashcardPage onBack={()=>setView('home')} addToast={addToast} />}
          {view==='cheatsheets' && (
            <div className="home">
              <div className="section-header"><span>📋 Cheat Sheets</span></div>
              <div className="cheatsheet-list" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14}}>
                {CHEAT_SHEETS.map(cs => (
                  <div key={cs.id} className="module-card" style={{'--mc':'#00A1E0'}}
                    onClick={()=>{setCurrentCS(cs);setView('cheatsheet');}}>
                    <div className="mc-top"><div className="mc-icon" style={{background:'rgba(0,161,224,.15)',fontSize:24}}>{cs.icon}</div>
                      <div className="mc-info"><div className="mc-title">{cs.title}</div><div className="mc-meta">{cs.sections.length} sections</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {view==='cheatsheet' && currentCS && <CheatSheetPage sheet={currentCS} onBack={()=>setView('cheatsheets')} />}
          {view==='daily' && currentDaily && <DailyChallengePage challenge={currentDaily} onDone={()=>setView('home')} addToast={addToast} />}
        </main>
      </div>
      <Toasts toasts={toasts} remove={removeToast} />
      {showOnboard && <OnboardingModal onDone={()=>{setOnboarded();setShowOnboard(false);}} />}
    </div>
  );
}
