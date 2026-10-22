import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PHASES, POWERUPS, AVATARS, isScored } from './engine';
import { joinRoom, transportSupported } from './channel';
import { play } from './sound';
import { Icon, PlayerAvatar, MuteButton, Countdown, Confetti, answerStyle, typeLabel } from './gameUi';

const EASE = [0.22, 1, 0.36, 1];

// One id per browser tab, so several tabs can join the demo as separate players
const tabId = (() => {
  try {
    let id = sessionStorage.getItem('connect_arena_tab');
    if (!id) {
      id = Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem('connect_arena_tab', id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2, 8);
  }
})();

/**
 * Attendee's game screen (/play or /play/CODE). Players use their Connect
 * account, so there is no separate game sign-up.
 */
export const PlayerGame = ({ currentUser, initialCode = '', onExit }) => {
  const reduced = useReducedMotion();
  const playerId = `${currentUser?.email || 'guest'}#${tabId}`;
  const [code, setCode] = useState(initialCode.toUpperCase());
  const [name, setName] = useState((currentUser?.name || 'Player').split(' ')[0]);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [status, setStatus] = useState('form'); // form | connecting | playing | notfound | closed
  const [game, setGame] = useState(null);
  const [myAnswer, setMyAnswer] = useState(null);
  const conn = useRef(null);
  const lastPhase = useRef(null);
  const lastPowerups = useRef(0);
  const [toast, setToast] = useState(null);

  const me = game?.players?.[playerId];

  const connect = (e) => {
    e?.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    setStatus('connecting');
    setGame(null);
    conn.current?.close();
    conn.current = joinRoom(clean, {
      onState: (state) => {
        setGame(state);
        setStatus('playing');
      },
      onClosed: () => setStatus('closed'),
    });
    conn.current.send({ type: 'join', player: { id: playerId, name: name.trim() || 'Player', avatar } });
  };

  // Give up if no host answers
  useEffect(() => {
    if (status !== 'connecting') return undefined;
    const id = setTimeout(() => setStatus((s) => (s === 'connecting' ? 'notfound' : s)), 2500);
    return () => clearTimeout(id);
  }, [status]);

  // Re-join if the host doesn't list us (e.g. host screen reopened)
  useEffect(() => {
    if (status === 'playing' && game && !me && game.phase === PHASES.LOBBY) {
      conn.current?.send({ type: 'join', player: { id: playerId, name: name.trim() || 'Player', avatar } });
    }
  }, [status, game, me, playerId, name, avatar]);

  useEffect(() => () => {
    conn.current?.send({ type: 'leave', playerId });
    conn.current?.close();
  }, [playerId]);

  // Phase change effects: reset answer, play result sounds
  useEffect(() => {
    if (!game) return;
    const key = `${game.phase}-${game.qIndex}`;
    if (lastPhase.current === key) return;
    lastPhase.current = key;
    if (game.phase === PHASES.QUESTION) {
      setMyAnswer(null);
      play('go');
    }
    if (game.phase === PHASES.REVEAL && isScored(game.type)) {
      const mine = game.answers?.[playerId];
      play(mine?.correct ? 'correct' : 'wrong');
    }
    if (game.phase === PHASES.PODIUM) play('fanfare');
    if (game.phase === PHASES.LOBBY && me) play('join');
  }, [game, playerId, me]);

  // Toast when a power-up is earned
  useEffect(() => {
    const count = me?.powerups?.length || 0;
    if (count > lastPowerups.current && game?.phase === PHASES.REVEAL) {
      const earned = POWERUPS[me.powerups[me.powerups.length - 1]];
      setToast(`Power-up earned: ${earned?.label}`);
      play('powerup');
      setTimeout(() => setToast(null), 2600);
    }
    lastPowerups.current = count;
  }, [me?.powerups, game?.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = (i) => {
    if (myAnswer !== null || game.phase !== PHASES.QUESTION) return;
    setMyAnswer(i);
    play('lock');
    conn.current?.send({ type: 'answer', playerId, option: i });
  };

  const usePowerup = (id) => {
    if (myAnswer !== null) return;
    play('powerup');
    conn.current?.send({ type: 'powerup', playerId, powerup: id });
  };

  const onSecond = useCallback((s) => {
    if (s > 0 && s <= 3) play('tick');
  }, []);

  const standings = useMemo(() => {
    if (!game?.players) return [];
    return Object.values(game.players).sort((a, b) => b.score - a.score || a.joinedAt - b.joinedAt);
  }, [game?.players]);
  const myRank = standings.findIndex((p) => p.id === playerId) + 1;

  // ------------------------------------------------------------------ join form
  if (status === 'form' || status === 'connecting' || status === 'notfound' || status === 'closed') {
    return (
      <Shell onExit={onExit}>
        <motion.form
          onSubmit={connect}
          className="glass-strong rounded-[32px] p-6 sm:p-8 w-full max-w-md mx-auto space-y-6"
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="text-center">
            <span className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-[rgb(var(--accent-rgb))] text-ink-950">
              <Icon name="sports_esports" className="!text-[30px]" />
            </span>
            <h1 className="mt-4 font-geist text-[28px] font-semibold tracking-tight text-fg">
              Join a <span className="font-display italic font-normal text-[color:var(--accent-ink)]">live game</span>
            </h1>
            <p className="mt-1 text-[14px] text-fg/60">Enter the code shown on the organizer’s screen.</p>
          </div>

          <label className="block">
            <span className="text-[12px] uppercase tracking-[0.16em] text-fg/50">Game code</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
              placeholder="e.g. QUIZ8472"
              autoFocus
              autoComplete="off"
              className="mt-2 w-full rounded-2xl bg-fg/[0.05] border border-fg/10 px-4 py-4 text-center font-geist text-2xl font-semibold tracking-[0.25em] text-fg placeholder:text-fg/25 placeholder:tracking-normal placeholder:text-lg outline-none focus:border-[color:var(--accent-ink)]"
            />
          </label>

          <label className="block">
            <span className="text-[12px] uppercase tracking-[0.16em] text-fg/50">Display name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              className="mt-2 w-full rounded-2xl bg-fg/[0.05] border border-fg/10 px-4 py-3 text-fg outline-none focus:border-[color:var(--accent-ink)]"
            />
          </label>

          <fieldset>
            <legend className="text-[12px] uppercase tracking-[0.16em] text-fg/50">Avatar</legend>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  aria-pressed={avatar === a}
                  aria-label={a.replace(/_/g, ' ')}
                  className={`h-12 rounded-2xl flex items-center justify-center cursor-pointer transition ${
                    avatar === a ? 'bg-[rgb(var(--accent-rgb))] text-ink-950 scale-105' : 'bg-fg/[0.05] text-fg/70 hover:bg-fg/10'
                  }`}
                >
                  <Icon name={a} className="!text-[22px]" />
                </button>
              ))}
            </div>
          </fieldset>

          {status === 'notfound' && (
            <p className="text-[13px] text-[#e2667a] text-center" role="alert">
              No live game with that code right now. Check the code on the organizer’s screen.
            </p>
          )}
          {status === 'closed' && (
            <p className="text-[13px] text-fg/60 text-center" role="status">The organizer ended this game.</p>
          )}
          {!transportSupported && (
            <p className="text-[13px] text-[#e2667a] text-center">This browser can’t run the demo game connection.</p>
          )}

          <button
            type="submit"
            disabled={!code.trim() || status === 'connecting'}
            className="w-full rounded-full py-4 font-geist text-[15px] font-semibold text-ink-950 bg-[rgb(var(--accent-rgb))] hover:brightness-[0.96] active:scale-[0.99] transition cursor-pointer disabled:opacity-40"
          >
            {status === 'connecting' ? 'Joining…' : 'Join game'}
          </button>
        </motion.form>
      </Shell>
    );
  }

  if (!game) return null;
  const q = game.question;
  const scored = isScored(game.type);
  const mineReveal = game.answers?.[playerId];

  return (
    <Shell onExit={onExit} game={game} me={me}>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[85] rounded-full px-5 py-2.5 bg-[rgb(var(--accent-rgb))] text-ink-950 font-semibold text-[14px] shadow-lg flex items-center gap-2"
          role="status"
        >
          <Icon name="auto_awesome" className="!text-[18px]" /> {toast}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* Lobby */}
        {game.phase === PHASES.LOBBY && (
          <motion.div key="lobby" className="flex-1 flex flex-col items-center justify-center text-center gap-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div animate={reduced ? {} : { y: [0, -10, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
              <PlayerAvatar icon={me?.avatar || avatar} name={name} size={96} highlight />
            </motion.div>
            <h2 className="font-geist text-[30px] font-semibold tracking-tight text-fg">
              You’re in, <span className="font-display italic font-normal text-[color:var(--accent-ink)]">{me?.name || name}!</span>
            </h2>
            <p className="text-fg/60">Waiting for the organizer to start · {Object.keys(game.players).length} playing</p>
            <PowerupTray me={me} disabled />
          </motion.div>
        )}

        {/* Question */}
        {game.phase === PHASES.QUESTION && q && (
          <motion.div
            key={`q-${game.qIndex}`}
            className="flex-1 flex flex-col gap-5 w-full max-w-xl mx-auto"
            initial={{ opacity: 0, x: reduced ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : -40 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="font-geist text-[20px] sm:text-[24px] font-semibold leading-snug text-fg">{q.text}</p>
              <Countdown deadline={game.deadline + (me?.extraMs || 0)} total={game.timeLimit + (me?.extraMs || 0)} size={68} onSecond={onSecond} />
            </div>

            {myAnswer === null ? (
              <>
                <div className="grid grid-cols-2 gap-3 flex-1 min-h-[260px]">
                  {q.options.map((opt, i) => {
                    const st = answerStyle(i);
                    const hidden = me?.hidden?.includes(i);
                    return (
                      <motion.button
                        key={i}
                        type="button"
                        onClick={() => answer(i)}
                        disabled={hidden}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: reduced ? 1 : 0.9 }}
                        animate={{ opacity: hidden ? 0.15 : 1, scale: 1 }}
                        transition={{ delay: 0.05 * i, duration: 0.3 }}
                        className="rounded-[24px] p-4 flex flex-col items-start justify-between text-left text-ink-950 cursor-pointer disabled:cursor-not-allowed min-h-[120px]"
                        style={{ background: st.bg }}
                        aria-label={`${st.name}: ${opt}`}
                      >
                        <Icon name={st.shape} className="!text-[28px]" />
                        <span className="font-geist text-[15px] sm:text-[17px] font-semibold leading-snug">{opt}</span>
                      </motion.button>
                    );
                  })}
                </div>
                {scored && <PowerupTray me={me} onUse={usePowerup} />}
              </>
            ) : (
              <motion.div className="flex-1 flex flex-col items-center justify-center text-center gap-4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <span className="w-20 h-20 rounded-[28px] flex items-center justify-center text-ink-950" style={{ background: answerStyle(myAnswer).bg }}>
                  <Icon name={answerStyle(myAnswer).shape} className="!text-[40px]" />
                </span>
                <p className="font-geist text-2xl font-semibold text-fg">Answer locked in</p>
                <p className="text-fg/60">{game.answeredCount} of {Object.keys(game.players).length} answered · waiting for the reveal</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Reveal */}
        {game.phase === PHASES.REVEAL && q && (
          <motion.div key={`r-${game.qIndex}`} className="flex-1 flex flex-col items-center justify-center text-center gap-5 w-full max-w-md mx-auto" initial={{ opacity: 0, scale: reduced ? 1 : 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
            {scored ? (
              <>
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ background: mineReveal?.correct ? '#a3c9a8' : '#f3a0ad', color: '#07080c' }}
                >
                  <Icon name={mineReveal?.correct ? 'check' : mineReveal ? 'close' : 'hourglass_empty'} className="!text-[48px]" />
                </motion.span>
                <h2 className="font-geist text-[32px] font-semibold tracking-tight text-fg">
                  {mineReveal?.correct ? 'Correct!' : mineReveal ? 'Not quite' : 'Too slow!'}
                </h2>
                {mineReveal?.correct && (
                  <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="font-geist text-[40px] font-semibold text-[color:var(--accent-ink)] tabular-nums">
                    +{mineReveal.points}
                  </motion.p>
                )}
                {me?.streak >= 2 && (
                  <p className="flex items-center gap-1.5 text-[15px] font-semibold text-[color:var(--speaker-ink)]">
                    <Icon name="local_fire_department" className="!text-[20px]" /> {me.streak} answer streak
                  </p>
                )}
                {!mineReveal?.correct && q.correct != null && (
                  <p className="text-fg/65">
                    Answer: <span className="font-semibold text-fg">{q.options[q.correct]}</span>
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className="font-geist text-[28px] font-semibold text-fg">Votes are in</h2>
                <div className="w-full space-y-2">
                  {q.options.map((opt, i) => {
                    const total = (game.tally || []).reduce((s, n) => s + n, 0) || 1;
                    const share = (game.tally?.[i] || 0) / total;
                    return (
                      <div key={i} className="relative rounded-2xl overflow-hidden glass px-4 py-3 text-left">
                        <motion.span className="absolute inset-y-0 left-0" style={{ background: answerStyle(i).bg, opacity: 0.55 }} initial={{ width: 0 }} animate={{ width: `${share * 100}%` }} transition={{ duration: 0.8, ease: EASE }} />
                        <span className="relative flex justify-between text-fg font-medium">
                          {opt} <span className="tabular-nums">{Math.round(share * 100)}%</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Leaderboard */}
        {game.phase === PHASES.LEADERBOARD && (
          <motion.div key={`lb-${game.qIndex}`} className="flex-1 flex flex-col items-center justify-center text-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="text-[13px] uppercase tracking-[0.2em] text-fg/50">Your position</p>
            <motion.p initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} className="font-geist text-[88px] leading-none font-semibold text-fg tabular-nums">
              #{myRank || '–'}
            </motion.p>
            <p className="text-fg/60">
              of {standings.length} · <span className="font-semibold text-fg tabular-nums">{(me?.score || 0).toLocaleString()}</span> points
            </p>
            <p className="text-fg/50 text-[14px] mt-4">Eyes on the big screen…</p>
          </motion.div>
        )}

        {/* Podium */}
        {game.phase === PHASES.PODIUM && (
          <motion.div key="end" className="flex-1 flex flex-col items-center justify-center text-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {scored && myRank > 0 && myRank <= 3 && <Confetti fire />}
            <PlayerAvatar icon={me?.avatar || avatar} name={name} size={88} highlight />
            {scored ? (
              <>
                <h2 className="font-geist text-[34px] font-semibold tracking-tight text-fg">
                  {myRank === 1 ? 'You won!' : myRank <= 3 ? `You placed #${myRank}!` : `You finished #${myRank}`}
                </h2>
                <p className="text-fg/60">
                  {(me?.score || 0).toLocaleString()} points · {me?.correctCount || 0} correct · best streak {me?.bestStreak || 0}
                </p>
              </>
            ) : (
              <h2 className="font-geist text-[30px] font-semibold text-fg">Thanks for voting!</h2>
            )}
            <button type="button" onClick={onExit} className="mt-4 glass rounded-full px-6 py-3 font-semibold text-fg cursor-pointer">
              Back to events
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
};

const PowerupTray = ({ me, onUse, disabled }) => {
  if (!me) return null;
  const owned = me.powerups || [];
  const armed = Object.keys(me.active || {});
  if (!owned.length && !armed.length) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2" aria-label="Power-ups">
      {armed.map((id) => (
        <span key={`a-${id}`} className="rounded-full px-3.5 py-2 text-[13px] font-semibold bg-[rgb(var(--accent-rgb))] text-ink-950 flex items-center gap-1.5">
          <Icon name={POWERUPS[id].icon} className="!text-[17px]" /> {POWERUPS[id].label} active
        </span>
      ))}
      {owned.map((id, i) => (
        <motion.button
          key={`${id}-${i}`}
          type="button"
          onClick={() => onUse && onUse(id)}
          disabled={disabled || armed.includes(id)}
          whileTap={{ scale: 0.92 }}
          className="glass rounded-full px-3.5 py-2 text-[13px] font-semibold text-fg flex items-center gap-1.5 cursor-pointer disabled:cursor-default disabled:opacity-70"
          title={POWERUPS[id].hint}
        >
          <Icon name={POWERUPS[id].icon} className="!text-[17px]" style={{ color: 'var(--accent-ink)' }} /> {POWERUPS[id].label}
        </motion.button>
      ))}
    </div>
  );
};

const Shell = ({ children, game, me, onExit }) => (
  <div className="relative min-h-[calc(100svh-5rem)] flex flex-col px-4 sm:px-6 py-6 gap-5">
    <div className="flex items-center justify-between gap-3">
      <button type="button" onClick={onExit} className="glass rounded-full pl-3 pr-4 h-10 text-[13px] font-semibold text-fg/80 hover:text-fg flex items-center gap-1 cursor-pointer">
        <Icon name="arrow_back" className="!text-[18px]" /> Leave
      </button>
      {game && (
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[13px] text-fg/60 truncate">
            {typeLabel(game.type)}
            {game.phase !== PHASES.LOBBY && game.phase !== PHASES.PODIUM ? ` · ${game.qIndex + 1}/${game.total}` : ''}
          </span>
          {me && isScored(game.type) && (
            <span className="glass rounded-full px-3 py-1.5 text-[13px] font-semibold text-fg tabular-nums">{me.score.toLocaleString()}</span>
          )}
        </div>
      )}
      <MuteButton />
    </div>
    {children}
  </div>
);

export default PlayerGame;
