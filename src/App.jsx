import { useState, useEffect, useCallback, useRef } from 'react';
import './styles/globals.css';
import { CURRICULUM, BADGES } from './data/curriculum.js';
import { runApex, checkAnswer } from './utils/apexRunner.js';
import {
  getCompleted, markCompleted, isCompleted,
  getXP, addXP, getStreak, updateStreak,
  getBadges, awardBadge, getLevel, resetAll
} from './utils/storage.js';

// ─── MARKDOWN-LITE PARSER ──────────────────────────────────────────────────
function renderTheory(text) {
  if (!text) return null;
  const lines = text.trim().split('\n');
  const elements = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty
    if (!line.trim()) { i++; continue; }

    // H2
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++}>{line.slice(3)}</h2>);
      i++; continue;
    }
    // H3
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++}>{line.slice(4)}</h3>);
      i++; continue;
    }

    // Code block
    if (line.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre key={key++}><code>{codeLines.join('\n')}</code></pre>
      );
      continue;
    }

    // Blockquote / warning
    if (line.startsWith('> ')) {
      elements.push(<div key={key++} className="blockquote-warning">{inlineFormat(line.slice(2))}</div>);
      i++; continue;
    }

    // Table
    if (line.includes('|') && lines[i + 1] && lines[i + 1].includes('---')) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(renderTable(tableLines, key++));
      continue;
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(<li key={i}>{inlineFormat(lines[i].slice(2))}</li>);
        i++;
      }
      elements.push(<ul key={key++}>{items}</ul>);
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(<li key={i}>{inlineFormat(lines[i].replace(/^\d+\. /, ''))}</li>);
        i++;
      }
      elements.push(<ol key={key++}>{items}</ol>);
      continue;
    }

    // Paragraph
    elements.push(<p key={key++}>{inlineFormat(line)}</p>);
    i++;
  }

  return elements;
}

function inlineFormat(text) {
  const parts = [];
  let remaining = text;
  let k = 0;

  // Process inline code, bold, and backtick
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={k++}>{text.slice(lastIndex, match.index)}</span>);
    }
    const m = match[0];
    if (m.startsWith('`')) {
      parts.push(<code key={k++}>{m.slice(1, -1)}</code>);
    } else {
      parts.push(<strong key={k++}>{m.slice(2, -2)}</strong>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(<span key={k++}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : text;
}

function renderTable(tableLines, key) {
  const rows = tableLines
    .filter(l => !l.match(/^[\s|:-]+$/))
    .map(l => l.split('|').filter(c => c.trim() !== '').map(c => c.trim()));

  if (rows.length === 0) return null;
  const [headers, ...bodyRows] = rows;

  return (
    <table key={key}>
      <thead>
        <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {bodyRows.map((row, ri) => (
          <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{inlineFormat(cell)}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} onClick={() => removeToast(t.id)}>
          <span className="toast-icon">{t.icon}</span>
          <div className="toast-text">
            <div className="toast-title">{t.title}</div>
            {t.sub && <div className="toast-sub">{t.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── HEADER ────────────────────────────────────────────────────────────────
function Header({ streak, xp, onLogoClick }) {
  const level = getLevel(xp);
  const pct = level.next === Infinity ? 100 : Math.floor(((xp - (getPrevXP(level.level))) / (level.next - getPrevXP(level.level))) * 100);

  function getPrevXP(lvl) {
    const map = { 1: 0, 2: 100, 3: 300, 4: 600, 5: 1000, 6: 1500, 7: 2200, 8: 3000, 9: 4000, 10: 5500 };
    return map[lvl] || 0;
  }

  return (
    <header className="header">
      <div className="header-logo" onClick={onLogoClick}>
        <div className="logo-mark">A</div>
        <span className="logo-text">ApexLearn</span>
      </div>

      <div className="header-ad">
        📢 Advertisement · 728×90 · Google AdSense Placeholder
      </div>

      <div className="header-right">
        <div className="streak-badge" title="Your learning streak">
          🔥 <span className="streak-num">{streak}</span>
        </div>
        <div className="xp-pill" title="Experience points">
          <span className="xp-val">{xp}</span>
          <span className="xp-label">XP</span>
        </div>
        <div className="level-chip">Lv.{level.level} {level.title}</div>
      </div>

      <div className="xp-progress-bar">
        <div className="xp-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </header>
  );
}

// ─── SIDEBAR ───────────────────────────────────────────────────────────────
function Sidebar({ currentLesson, onSelectLesson, completed }) {
  const [expanded, setExpanded] = useState(() => {
    const mod = CURRICULUM.find(m => m.lessons.some(l => l.id === currentLesson));
    return mod ? mod.id : CURRICULUM[0].id;
  });

  const toggle = (modId) => setExpanded(e => e === modId ? null : modId);

  const completedInModule = (mod) => mod.lessons.filter(l => completed.includes(l.id)).length;

  return (
    <nav className="sidebar">
      <div className="sidebar-section-label">Curriculum</div>

      {CURRICULUM.map(mod => {
        const done = completedInModule(mod);
        const total = mod.lessons.length;
        const isOpen = expanded === mod.id;
        const modColor = mod.color;

        return (
          <div key={mod.id} className="sidebar-module">
            <div
              className={`sidebar-module-header ${isOpen ? 'active' : ''}`}
              onClick={() => toggle(mod.id)}
            >
              <div className="module-icon-sm" style={{ background: `${modColor}18` }}>
                <span style={{ fontSize: 13 }}>{mod.icon}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="module-title-sm">{mod.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {done}/{total} · {mod.xpTotal} XP
                </div>
              </div>
              <span className={`module-chevron ${isOpen ? 'open' : ''}`}>▶</span>
            </div>

            {isOpen && mod.lessons.map(lesson => {
              const done = completed.includes(lesson.id);
              const active = lesson.id === currentLesson;
              return (
                <div
                  key={lesson.id}
                  className={`sidebar-lesson ${active ? 'active' : ''} ${done ? 'completed' : ''}`}
                  onClick={() => onSelectLesson(mod.id, lesson.id)}
                >
                  <div className={`lesson-check ${done ? 'done' : ''}`}>
                    {done && '✓'}
                  </div>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lesson.title}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                    +{lesson.xp}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="sidebar-bottom-ad">
        <span style={{ fontSize: 16 }}>📦</span>
        <span>Ad Placeholder</span>
        <span style={{ fontSize: 10 }}>160×200 · AdSense</span>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────
function HomePage({ onStartLesson, completed, xp, streak, badges }) {
  const totalLessons = CURRICULUM.reduce((s, m) => s + m.lessons.length, 0);
  const completedCount = completed.length;
  const pct = Math.round((completedCount / totalLessons) * 100);
  const level = getLevel(xp);

  const getModuleProgress = (mod) => {
    const done = mod.lessons.filter(l => completed.includes(l.id)).length;
    return { done, total: mod.lessons.length, pct: Math.round((done / mod.lessons.length) * 100) };
  };

  const earnedBadges = getBadges();

  // Find where to continue
  const findNextLesson = () => {
    for (const mod of CURRICULUM) {
      for (const lesson of mod.lessons) {
        if (!completed.includes(lesson.id)) {
          return { modId: mod.id, lessonId: lesson.id };
        }
      }
    }
    return null;
  };

  const next = findNextLesson();

  return (
    <div className="main-content">
      <div className="home-page">

        {/* Hero */}
        <div className="home-hero">
          <h1>
            The free platform to master<br />
            <span className="accent">Salesforce Apex.</span>
          </h1>
          <p>
            From zero to Apex-ready — interactive lessons, a real code editor, and exercises that mirror real Salesforce development.
            No login. No cost. Just code.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-val">{CURRICULUM.length}</span>
              <span className="stat-label">Modules</span>
            </div>
            <div className="hero-stat">
              <span className="stat-val">{totalLessons}</span>
              <span className="stat-label">Lessons</span>
            </div>
            <div className="hero-stat">
              <span className="stat-val">{CURRICULUM.reduce((s, m) => s + m.xpTotal, 0)}</span>
              <span className="stat-label">Total XP</span>
            </div>
            <div className="hero-stat">
              <span className="stat-val">Free</span>
              <span className="stat-label">Always</span>
            </div>
          </div>

          {next ? (
            <button className="cta-btn" onClick={() => onStartLesson(next.modId, next.lessonId)}>
              {completedCount === 0 ? '🚀 Start Learning' : '▶ Continue Learning'}
            </button>
          ) : (
            <div className="feedback-bar success">🏆 You've completed the entire curriculum! Apex Champion!</div>
          )}
        </div>

        {/* Progress */}
        {completedCount > 0 && (
          <div className="overall-progress">
            <div className="progress-header">
              <div className="progress-title">Your Progress</div>
              <div className="progress-pct">{pct}%</div>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="level-info">
              <div className="level-badge">Level {level.level} — {level.title}</div>
              <div className="xp-to-next">{xp} XP {level.next !== Infinity ? `/ ${level.next} to next level` : '— Max level!'}</div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  🔥 <strong style={{ color: 'var(--orange)' }}>{streak}</strong> day streak
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  ✓ <strong style={{ color: 'var(--green)' }}>{completedCount}</strong> lessons done
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modules */}
        <div className="section-title">📚 Curriculum</div>
        <div className="module-grid">
          {CURRICULUM.map(mod => {
            const prog = getModuleProgress(mod);
            return (
              <div
                key={mod.id}
                className="module-card"
                style={{ '--module-color': mod.color }}
                onClick={() => {
                  const first = mod.lessons[0];
                  onStartLesson(mod.id, first.id);
                }}
              >
                <style>{`.module-card:hover::before { background: linear-gradient(90deg, ${mod.color}, transparent); }`}</style>
                <div className="module-card-header">
                  <div className="module-icon" style={{ background: `${mod.color}20` }}>
                    {mod.icon}
                  </div>
                  <div>
                    <div className="module-card-title">{mod.title}</div>
                    <div className="module-card-meta">{mod.lessons.length} lessons · {mod.xpTotal} XP</div>
                  </div>
                </div>
                <div className="module-card-desc">{mod.description}</div>
                <div className="module-card-footer">
                  <div className="module-progress-track">
                    <div
                      className="module-progress-fill"
                      style={{ width: `${prog.pct}%`, background: mod.color }}
                    />
                  </div>
                  <span className="module-progress-text">{prog.done}/{prog.total}</span>
                  {prog.done === prog.total && prog.total > 0 && (
                    <span style={{ color: 'var(--green-dim)', fontSize: 13 }}>✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges */}
        <div className="section-title">🏅 Achievements</div>
        <div className="badges-section">
          <div className="badges-grid">
            {BADGES.map(badge => {
              const earned = earnedBadges.includes(badge.id);
              return (
                <div key={badge.id} className={`badge-chip ${earned ? 'earned' : 'locked'}`}>
                  <span className="badge-icon">{badge.icon}</span>
                  <div className="badge-info">
                    <div className="badge-title">{badge.title}</div>
                    <div className="badge-desc">{badge.desc || badge.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) { resetAll(); window.location.reload(); } }}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 14px', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CODE EDITOR ──────────────────────────────────────────────────────────
function CodeEditor({ value, onChange }) {
  const textareaRef = useRef(null);
  const lineCount = (value.match(/\n/g) || []).length + 1;

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newVal);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4; }, 0);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const line = value.substring(0, start).split('\n').pop();
      const indent = line.match(/^(\s*)/)[1];
      const extraIndent = line.trimEnd().endsWith('{') ? '    ' : '';
      const newVal = value.substring(0, start) + '\n' + indent + extraIndent + value.substring(ta.selectionEnd);
      onChange(newVal);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 1 + indent.length + extraIndent.length; }, 0);
    }
  };

  return (
    <div className="code-editor-wrap">
      <div className="code-editor-inner">
        <div className="line-numbers">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="code-textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="// Write your Apex code here..."
        />
      </div>
    </div>
  );
}

// ─── CONSOLE ──────────────────────────────────────────────────────────────
function DebugConsole({ lines, hasError, onClear }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [lines]);

  const statusDot = lines.length === 0 ? 'idle' : hasError ? 'error' : '';

  return (
    <div className="console-panel">
      <div className="console-header">
        <div className={`console-dot ${statusDot}`} />
        <span className="console-label">DEBUG LOG</span>
        {lines.length > 0 && (
          <button className="console-clear-btn" onClick={onClear}>clear</button>
        )}
      </div>
      <div className="console-output">
        {lines.length === 0 ? (
          <div className="console-empty">Run your code to see debug output...</div>
        ) : (
          lines.map((line, i) => (
            <div key={i} className={`console-line ${line.type || ''}-line`}>
              <span className="line-prefix">[{String(i + 1).padStart(2, '0')}]</span>
              <span className="line-val">{line.text}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────
function Modal({ title, body, code, onClose, onApply, applyLabel }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">{title}</div>
        {body && <div className="modal-body">{body}</div>}
        {code && <div className="modal-code">{code}</div>}
        <div className="modal-footer">
          <button className="modal-btn" onClick={onClose}>Close</button>
          {onApply && (
            <button className="modal-btn apply" onClick={onApply}>{applyLabel || 'Apply'}</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LESSON PAGE ──────────────────────────────────────────────────────────
function LessonPage({ modId, lessonId, onBack, onComplete, onNavigate, completed }) {
  const mod = CURRICULUM.find(m => m.id === modId);
  const lesson = mod?.lessons.find(l => l.id === lessonId);

  const [activeTab, setActiveTab] = useState('exercise'); // 'exercise' | 'example'
  const [code, setCode] = useState(lesson?.exercise?.starterCode || '');
  const [consoleLines, setConsoleLines] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [feedback, setFeedback] = useState(null); // null | 'success' | 'error'
  const [modal, setModal] = useState(null); // null | 'hint' | 'solution'
  const [isLessonDone, setIsLessonDone] = useState(isCompleted(lessonId));

  // Reset on lesson change
  useEffect(() => {
    setCode(lesson?.exercise?.starterCode || '');
    setConsoleLines([]);
    setHasError(false);
    setFeedback(null);
    setModal(null);
    setIsLessonDone(isCompleted(lessonId));
  }, [lessonId]);

  const lessonIndex = mod?.lessons.findIndex(l => l.id === lessonId) ?? 0;
  const prevLesson = lessonIndex > 0 ? mod.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < (mod?.lessons.length ?? 0) - 1 ? mod.lessons[lessonIndex + 1] : null;

  // Find overall next (across modules)
  const modIndex = CURRICULUM.findIndex(m => m.id === modId);
  const nextModFirstLesson =
    !nextLesson && modIndex < CURRICULUM.length - 1
      ? { mod: CURRICULUM[modIndex + 1], lesson: CURRICULUM[modIndex + 1].lessons[0] }
      : null;

  const handleRun = () => {
    const { output, error } = runApex(code);
    const lines = [];

    if (error) {
      lines.push({ text: error, type: 'error' });
      setHasError(true);
      setFeedback('error');
    } else {
      output.forEach(o => lines.push({ text: o, type: '' }));
      setHasError(false);

      if (lesson?.exercise?.expectedOutput) {
        const passed = checkAnswer(output, lesson.exercise.expectedOutput);
        setFeedback(passed ? 'success' : 'error');
        if (passed && !isLessonDone) {
          markCompleted(lessonId);
          const newXP = addXP(lesson.xp);
          updateStreak();
          setIsLessonDone(true);
          onComplete(lessonId, lesson.xp, newXP);
        }
      }
    }

    lines.push({ text: `→ Ran at ${new Date().toLocaleTimeString()}`, type: 'system' });
    setConsoleLines(lines);
  };

  const handleReset = () => {
    setCode(lesson?.exercise?.starterCode || '');
    setConsoleLines([]);
    setHasError(false);
    setFeedback(null);
  };

  if (!mod || !lesson) return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <div className="empty-state-title">Lesson not found</div>
    </div>
  );

  return (
    <div className="lesson-page">
      {/* Lesson Header */}
      <div className="lesson-header-bar">
        <button className="back-btn" onClick={onBack}>← Home</button>
        <div className="lesson-title-bar">
          <div className="lesson-breadcrumb">{mod.title}</div>
          <div className="lesson-title-main">{lesson.title}</div>
        </div>
        <div className="lesson-xp-badge">+{lesson.xp} XP</div>
        <div className="lesson-nav-btns">
          <button
            className="nav-btn"
            disabled={!prevLesson}
            onClick={() => prevLesson && onNavigate(modId, prevLesson.id)}
          >
            ← Prev
          </button>
          <button
            className="nav-btn"
            disabled={!nextLesson && !nextModFirstLesson}
            onClick={() => {
              if (nextLesson) onNavigate(modId, nextLesson.id);
              else if (nextModFirstLesson) onNavigate(nextModFirstLesson.mod.id, nextModFirstLesson.lesson.id);
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="lesson-body">
        {/* Theory */}
        <div className="theory-panel">
          <div className="theory-content">
            {renderTheory(lesson.theory)}
          </div>
        </div>

        {/* Editor + Console */}
        <div className="editor-panel">
          {/* Tabs */}
          <div className="editor-tabs">
            <div
              className={`editor-tab ${activeTab === 'exercise' ? 'active' : ''}`}
              onClick={() => setActiveTab('exercise')}
            >
              ✏️ Exercise
            </div>
            <div
              className={`editor-tab ${activeTab === 'example' ? 'active' : ''}`}
              onClick={() => setActiveTab('example')}
            >
              📋 Example
            </div>
            {isLessonDone && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--green-dim)', fontFamily: 'var(--font-mono)', padding: '0 8px' }}>
                ✓ Completed
              </div>
            )}
          </div>

          {activeTab === 'example' ? (
            <div className="example-view">
              <div className="example-label">Code Example</div>
              <div className="example-code">{lesson.codeExample}</div>
            </div>
          ) : (
            <div className="editor-main">
              {/* Exercise description */}
              <div className="exercise-banner">
                <div className="exercise-title">🎯 {lesson.exercise.title}</div>
                <div className="exercise-instructions">
                  {lesson.exercise.instructions.split('\n').map((line, i) => {
                    if (line.startsWith('```')) return null;
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                      return <div key={i} style={{ paddingLeft: 12 }}>• {line.slice(2)}</div>;
                    }
                    const parts = line.split(/(`[^`]+`)/g);
                    return (
                      <div key={i}>
                        {parts.map((p, j) => p.startsWith('`') && p.endsWith('`')
                          ? <code key={j}>{p.slice(1, -1)}</code>
                          : <span key={j}>{p.replace(/\*\*/g, '')}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Code Editor */}
              <CodeEditor value={code} onChange={setCode} />

              {/* Feedback */}
              {feedback === 'success' && (
                <div className="feedback-bar success">
                  ✅ Correct! {isLessonDone ? 'Already earned XP for this lesson.' : `+${lesson.xp} XP earned!`}
                  {(nextLesson || nextModFirstLesson) && (
                    <button
                      className="next-lesson-btn"
                      onClick={() => {
                        if (nextLesson) onNavigate(modId, nextLesson.id);
                        else if (nextModFirstLesson) onNavigate(nextModFirstLesson.mod.id, nextModFirstLesson.lesson.id);
                      }}
                    >
                      Next Lesson →
                    </button>
                  )}
                </div>
              )}
              {feedback === 'error' && (
                <div className="feedback-bar error">
                  ❌ Not quite. Check your output and try again!
                </div>
              )}
            </div>
          )}

          {/* Toolbar */}
          <div className="editor-toolbar">
            <button className="run-btn" onClick={handleRun}>▶ Run Code</button>
            <button className="reset-btn" onClick={handleReset}>↺ Reset</button>
            <button className="hint-btn" onClick={() => setModal('hint')}>💡 Hint</button>
            <button className="solution-btn" onClick={() => setModal('solution')}>🔑 Solution</button>
            <span className="toolbar-spacer" />
            {isLessonDone && (
              <span className="complete-status">✓ Lesson Complete</span>
            )}
          </div>

          {/* Console */}
          <DebugConsole
            lines={consoleLines}
            hasError={hasError}
            onClear={() => setConsoleLines([])}
          />
        </div>
      </div>

      {/* Modals */}
      {modal === 'hint' && (
        <Modal
          title="💡 Hint"
          body={lesson.exercise.hint}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'solution' && (
        <Modal
          title="🔑 Solution"
          body="Here's one way to solve this exercise:"
          code={lesson.exercise.solution}
          onClose={() => setModal(null)}
          onApply={() => { setCode(lesson.exercise.solution); setModal(null); }}
          applyLabel="Apply Solution"
        />
      )}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'lesson'
  const [currentMod, setCurrentMod] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completed, setCompleted] = useState(getCompleted);
  const [xp, setXP] = useState(getXP);
  const [streak, setStreak] = useState(getStreak);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { ...toast, id }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const openLesson = (modId, lessonId) => {
    setCurrentMod(modId);
    setCurrentLesson(lessonId);
    setView('lesson');
  };

  const handleLessonComplete = (lessonId, xpEarned, newXP) => {
    setCompleted(getCompleted());
    setXP(newXP);
    setStreak(getStreak());

    addToast({ type: 'xp', icon: '⭐', title: `+${xpEarned} XP earned!`, sub: `Total: ${newXP} XP` });

    // Check badges
    const allCompleted = getCompleted();
    const s = updateStreak();

    if (allCompleted.length === 1) {
      if (awardBadge('first-lesson')) addToast({ type: 'badge', icon: '🚀', title: 'Badge Unlocked!', sub: 'First Steps' });
    }
    if (newXP >= 100 && awardBadge('xp-100')) {
      addToast({ type: 'badge', icon: '⭐', title: 'Badge Unlocked!', sub: 'First 100 XP' });
    }
    if (newXP >= 500 && awardBadge('xp-500')) {
      addToast({ type: 'badge', icon: '💫', title: 'Badge Unlocked!', sub: 'Power Learner' });
    }
    if (s >= 3 && awardBadge('streak-3')) {
      addToast({ type: 'streak', icon: '🔥', title: '3-Day Streak!', sub: 'Keep it going!' });
    }
    if (s >= 7 && awardBadge('streak-7')) {
      addToast({ type: 'streak', icon: '⚡', title: 'Week Warrior!', sub: '7-day streak!' });
    }

    // Module completion badges
    const foundationsDone = CURRICULUM.find(m => m.id === 'foundations')?.lessons.every(l => allCompleted.includes(l.id));
    if (foundationsDone && awardBadge('foundations-done')) {
      addToast({ type: 'badge', icon: '🏗️', title: 'Badge Unlocked!', sub: 'Foundation Builder' });
    }
    const collectionsDone = CURRICULUM.find(m => m.id === 'collections')?.lessons.every(l => allCompleted.includes(l.id));
    if (collectionsDone && awardBadge('collections-done')) {
      addToast({ type: 'badge', icon: '📦', title: 'Badge Unlocked!', sub: 'Data Wrangler' });
    }
    const oopDone = CURRICULUM.find(m => m.id === 'oop')?.lessons.every(l => allCompleted.includes(l.id));
    if (oopDone && awardBadge('oop-done')) {
      addToast({ type: 'badge', icon: '🏛️', title: 'Badge Unlocked!', sub: 'Object Architect' });
    }
    const completedMods = CURRICULUM.filter(m => m.lessons.every(l => allCompleted.includes(l.id))).length;
    if (completedMods >= 5 && awardBadge('halfway')) {
      addToast({ type: 'badge', icon: '🎯', title: 'Badge Unlocked!', sub: 'Halfway There' });
    }
    const allDone = CURRICULUM.every(m => m.lessons.every(l => allCompleted.includes(l.id)));
    if (allDone && awardBadge('champion')) {
      addToast({ type: 'badge', icon: '🏆', title: 'APEX CHAMPION!', sub: 'All modules complete!' });
    }
  };

  return (
    <div className="app-wrapper">
      <Header streak={streak} xp={xp} onLogoClick={() => setView('home')} />

      <div className="app-body">
        <Sidebar
          currentLesson={currentLesson}
          onSelectLesson={openLesson}
          completed={completed}
        />

        {view === 'home' ? (
          <HomePage
            onStartLesson={openLesson}
            completed={completed}
            xp={xp}
            streak={streak}
            badges={getBadges()}
          />
        ) : (
          <div className="main-content" style={{ padding: 0 }}>
            <LessonPage
              modId={currentMod}
              lessonId={currentLesson}
              onBack={() => setView('home')}
              onComplete={handleLessonComplete}
              onNavigate={openLesson}
              completed={completed}
            />
          </div>
        )}
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
