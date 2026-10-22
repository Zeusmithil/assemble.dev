import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import {
  PHASES,
  createRoom,
  applyPlayerAction,
  nextStep,
  questionShouldClose,
  revealQuestion,
  publicState,
  ranked,
  isScored,
  timeLimitFor,
} from './engine';
import { hostRoom, transportSupported } from './channel';
import { play } from './sound';
import { Icon, PlayerAvatar, MuteButton, Countdown, Confetti, answerStyle, typeLabel } from './gameUi';

const EASE = [0.22, 1, 0.36, 1];

const PrimaryAction = ({ children, onClick, icon = 'arrow_forward', disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-geist text-[15px] font-semibold text-ink-950 bg-[rgb(var(--accent-rgb))] shadow-[0_14px_36px_-14px_rgb(var(--accent-rgb)/0.9)] hover:brightness-[0.96] active:scale-[0.98] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {children}
    <Icon name={icon} className="!text-[19px]" />
  </button>
);

/**
 * Full-screen host view for a live activity. Meant for the organizer's laptop
 * or a projector; players join from the event page with the room code.
 */
export const HostGame = ({ activity, onEnd }) => {
  const reduced = useReducedMotion();
  const [room, setRoom] = useState(() => createRoom(activity));
  const channel = useRef(null);
  const playerCount = Object.keys(room.players).length;
  const prevCount = useRef(0);

  // Open the room and apply incoming player actions
  useEffect(() => {
    channel.current = hostRoom(activity.roomCode, (action) => setRoom((prev) => applyPlayerAction(prev, action)));
    return () => channel.current?.close();
  }, [activity.roomCode]);

  // Publish every change to players
  useEffect(() => {
    channel.current?.publish(publicState(room));
  }, [room]);

  // Join sound
  useEffect(() => {
    if (playerCount > prevCount.current && room.phase === PHASES.LOBBY) play('join');
    prevCount.current = playerCount;
  }, [playerCount, room.phase]);

  // Close the question when time is up or everyone answered
  useEffect(() => {
    if (room.phase !== PHASES.QUESTION) return undefined;
    const id = setInterval(() => {
      setRoom((prev) => {
        if (!questionShouldClose(prev)) return prev;
        play('reveal');
        return revealQuestion(prev);
      });
    }, 200);
    return () => clearInterval(id);
  }, [room.phase, room.qIndex]);

  useEffect(() => {
    if (room.phase === PHASES.QUESTION) play('go');
    if (room.phase === PHASES.PODIUM) play('fanfare');
  }, [room.phase, room.qIndex]);

  // Keep the page behind the overlay from scrolling
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleNext = () => setRoom((prev) => nextStep(prev));
  const handleSkip = () =>
    setRoom((prev) => {
      play('reveal');
      return revealQuestion(prev);
    });
  const onSecond = useCallback((s) => {
    if (s > 0 && s <= 5) play('tick');
  }, []);

  const q = room.questions[room.qIndex];
  const answered = room.answers[room.qIndex] || {};
  const scored = isScored(room.type);
  const standings = useMemo(() => ranked(room), [room]);

  if (!room.questions.length) {
    return (
      <Overlay title={activity.title} code={room.code} onEnd={onEnd} players={0}>
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 max-w-lg mx-auto">
          <Icon name="construction" className="!text-[48px] text-fg/40" />
          <h2 className="font-geist text-2xl font-semibold text-fg">This activity has no questions to play</h2>
          <p className="text-fg/60">Live games need multiple-choice questions. Add some in the activity editor and start it again.</p>
          <PrimaryAction onClick={onEnd} icon="close">Close</PrimaryAction>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay title={activity.title} code={room.code} type={room.type} onEnd={onEnd} players={playerCount} phase={room.phase} qIndex={room.qIndex} total={room.questions.length}>
      <AnimatePresence mode="wait">
        {/* ---------------- Lobby ---------------- */}
        {room.phase === PHASES.LOBBY && (
          <motion.section
            key="lobby"
            className="flex-1 flex flex-col items-center justify-center text-center gap-8"
            initial={{ opacity: 0, y: reduced ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -20 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div>
              <p className="text-[13px] uppercase tracking-[0.22em] text-fg/50">Join from the event page · Join game</p>
              <div className="mt-5 flex justify-center gap-2 sm:gap-3" aria-label={`Room code ${room.code}`}>
                {room.code.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: reduced ? 0 : 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * i, duration: 0.5, ease: EASE }}
                    className="glass-strong w-11 h-14 sm:w-16 sm:h-20 rounded-2xl flex items-center justify-center font-geist text-3xl sm:text-5xl font-semibold text-fg"
                  >
                    {ch}
                  </motion.span>
                ))}
              </div>
              {!transportSupported && (
                <p className="mt-4 text-[13px] text-[#e2667a]">This browser can’t run the demo connection between tabs.</p>
              )}
            </div>

            <div className="w-full max-w-3xl">
              <p className="text-fg/60 text-[14px] mb-4">
                {playerCount === 0 ? 'Waiting for players to join…' : `${playerCount} player${playerCount === 1 ? '' : 's'} ready`}
              </p>
              <div className="flex flex-wrap justify-center gap-3 min-h-[64px]">
                <AnimatePresence>
                  {Object.values(room.players).map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      className="glass rounded-full pl-1.5 pr-4 py-1.5 flex items-center gap-2.5"
                    >
                      <PlayerAvatar icon={p.avatar} name={p.name} size={34} />
                      <span className="font-medium text-fg text-[14px]">{p.name}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <PrimaryAction onClick={handleNext} icon="play_arrow" disabled={playerCount === 0}>
              Start game · {room.questions.length} question{room.questions.length === 1 ? '' : 's'}
            </PrimaryAction>
          </motion.section>
        )}

        {/* ---------------- Question & reveal ---------------- */}
        {(room.phase === PHASES.QUESTION || room.phase === PHASES.REVEAL) && q && (
          <motion.section
            key={`q-${room.qIndex}`}
            className="flex-1 flex flex-col gap-6 sm:gap-8 w-full max-w-5xl mx-auto"
            initial={{ opacity: 0, x: reduced ? 0 : 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : -60 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-start justify-between gap-6">
              <h2 className="font-geist text-[26px] sm:text-[40px] font-semibold tracking-tight leading-[1.12] text-fg">{q.question}</h2>
              {room.phase === PHASES.QUESTION ? (
                <Countdown deadline={room.deadline} total={timeLimitFor(room.type)} size={92} onSecond={onSecond} />
              ) : (
                <span className="glass rounded-full px-4 py-2 text-[13px] text-fg/70 shrink-0">Time’s up</span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {q.options.map((opt, i) => {
                const st = answerStyle(i);
                const isReveal = room.phase === PHASES.REVEAL;
                const correct = scored && i === q.correct;
                const votes = Object.values(answered).filter((a) => a.option === i).length;
                const share = playerCount ? votes / playerCount : 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                    animate={{
                      opacity: isReveal && scored && !correct ? 0.38 : 1,
                      y: 0,
                      scale: isReveal && correct ? 1.02 : 1,
                    }}
                    transition={{ delay: isReveal ? 0 : 0.08 * i, duration: 0.45, ease: EASE }}
                    className="relative overflow-hidden rounded-[22px] px-5 py-5 sm:py-6 flex items-center gap-4 text-ink-950"
                    style={{ background: st.bg, boxShadow: isReveal && correct ? `0 0 0 3px rgb(var(--fg-rgb)), 0 18px 40px -18px ${st.bg}` : 'none' }}
                  >
                    {isReveal && (
                      <motion.span
                        className="absolute inset-y-0 left-0 bg-black/10"
                        initial={{ width: 0 }}
                        animate={{ width: `${share * 100}%` }}
                        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
                      />
                    )}
                    <Icon name={st.shape} className="relative !text-[26px]" />
                    <span className="relative flex-1 font-geist text-[17px] sm:text-[20px] font-semibold leading-snug">{opt}</span>
                    {isReveal && (
                      <span className="relative font-geist text-[15px] font-semibold flex items-center gap-1">
                        {correct && <Icon name="check_circle" className="!text-[20px]" />}
                        {votes}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
              <p className="text-fg/60 text-[14px]">
                {room.phase === PHASES.QUESTION
                  ? `${Object.keys(answered).length} of ${playerCount} answered`
                  : q.explanation || (scored ? 'Correct answer highlighted.' : 'Here’s how everyone voted.')}
              </p>
              {room.phase === PHASES.QUESTION ? (
                <button type="button" onClick={handleSkip} className="glass rounded-full px-5 py-2.5 text-[13px] font-semibold text-fg/80 hover:text-fg cursor-pointer">
                  End question now
                </button>
              ) : (
                <PrimaryAction onClick={handleNext}>
                  {scored ? 'Show leaderboard' : room.qIndex + 1 < room.questions.length ? 'Next question' : 'Finish'}
                </PrimaryAction>
              )}
            </div>
          </motion.section>
        )}

        {/* ---------------- Leaderboard ---------------- */}
        {room.phase === PHASES.LEADERBOARD && (
          <Leaderboard key={`lb-${room.qIndex}`} room={room} standings={standings} onNext={handleNext} reduced={reduced} />
        )}

        {/* ---------------- Podium ---------------- */}
        {room.phase === PHASES.PODIUM && (
          <Podium key="podium" standings={standings} scored={scored} onEnd={onEnd} reduced={reduced} />
        )}
      </AnimatePresence>
    </Overlay>
  );
};

// Ranking that starts in the previous order and slides into the new one
const Leaderboard = ({ room, standings, onNext, reduced }) => {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setSettled(true), reduced ? 0 : 700);
    return () => clearTimeout(id);
  }, [reduced]);
  const before = [...standings].sort((a, b) => (room.previousRanks[a.id] ?? 99) - (room.previousRanks[b.id] ?? 99));
  const list = (settled ? standings : before).slice(0, 6);
  const answered = room.answers[room.qIndex] || {};
  const last = room.qIndex + 1 >= room.questions.length;
  return (
    <motion.section
      className="flex-1 flex flex-col gap-6 w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: reduced ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <h2 className="font-geist text-[32px] sm:text-[40px] font-semibold tracking-tight text-fg">
        Leaderboard
        <span className="font-display italic font-normal text-[color:var(--accent-ink)]"> after round {room.qIndex + 1}</span>
      </h2>
      <LayoutGroup>
        <ol className="space-y-2.5">
          {list.map((p, i) => {
            const gained = answered[p.id]?.points || 0;
            return (
              <motion.li
                key={p.id}
                layout
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="glass rounded-[20px] px-4 py-3 flex items-center gap-4"
              >
                <span className="w-8 text-center font-geist text-xl font-semibold text-fg/50">{i + 1}</span>
                <PlayerAvatar icon={p.avatar} name={p.name} size={40} highlight={i === 0} />
                <span className="flex-1 min-w-0">
                  <span className="block font-medium text-fg truncate">{p.name}</span>
                  {p.streak >= 2 && (
                    <span className="text-[12px] text-[color:var(--speaker-ink)] flex items-center gap-1">
                      <Icon name="local_fire_department" className="!text-[15px]" /> {p.streak} in a row
                    </span>
                  )}
                </span>
                {gained > 0 && settled && (
                  <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-[13px] font-semibold text-[color:var(--volunteer-ink)]">
                    +{gained}
                  </motion.span>
                )}
                <span className="font-geist text-xl font-semibold text-fg tabular-nums">{p.score.toLocaleString()}</span>
              </motion.li>
            );
          })}
        </ol>
      </LayoutGroup>
      <div className="flex justify-end mt-auto">
        <PrimaryAction onClick={onNext} icon={last ? 'emoji_events' : 'arrow_forward'}>
          {last ? 'Final results' : 'Next question'}
        </PrimaryAction>
      </div>
    </motion.section>
  );
};

const Podium = ({ standings, scored, onEnd, reduced }) => {
  const top = standings.slice(0, 3);
  // Display order: 2nd, 1st, 3rd
  const order = [top[1], top[0], top[2]];
  const heights = [150, 210, 110];
  const places = [2, 1, 3];
  return (
    <motion.section
      className="flex-1 flex flex-col items-center gap-8 w-full max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Confetti fire />
      <h2 className="font-geist text-[34px] sm:text-[46px] font-semibold tracking-tight text-fg text-center">
        {scored ? 'And the winners are' : 'Thanks for voting'}
        <span className="font-display italic font-normal text-[color:var(--accent-ink)]">{scored ? '…' : '!'}</span>
      </h2>

      {scored && (
        <div className="flex items-end justify-center gap-3 sm:gap-5 w-full">
          {order.map((p, i) =>
            p ? (
              <div key={p.id} className="flex flex-col items-center gap-3 w-[30%] max-w-[200px]">
                <motion.div
                  initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (2 - i) * 0.35, duration: 0.5, ease: EASE }}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <PlayerAvatar icon={p.avatar} name={p.name} size={places[i] === 1 ? 64 : 52} highlight={places[i] === 1} />
                  <span className="font-medium text-fg truncate max-w-full">{p.name}</span>
                  <span className="text-[13px] text-fg/60 tabular-nums">{p.score.toLocaleString()} pts</span>
                </motion.div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: heights[i] }}
                  transition={{ delay: 0.2 + (2 - i) * 0.35, duration: 0.7, ease: EASE }}
                  className="w-full rounded-t-[20px] glass-strong flex items-start justify-center pt-3 font-geist text-3xl font-semibold"
                  style={{ color: 'var(--accent-ink)' }}
                >
                  {places[i]}
                </motion.div>
              </div>
            ) : (
              <div key={`empty-${i}`} className="w-[30%] max-w-[200px]" />
            )
          )}
        </div>
      )}

      {standings.length > 3 && scored && (
        <ol className="w-full max-w-xl space-y-1.5">
          {standings.slice(3, 10).map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 text-[14px] text-fg/70">
              <span className="w-6 text-right tabular-nums">{i + 4}</span>
              <span className="flex-1 truncate">{p.name}</span>
              <span className="tabular-nums">{p.score.toLocaleString()}</span>
            </li>
          ))}
        </ol>
      )}

      <PrimaryAction onClick={onEnd} icon="check">Close game</PrimaryAction>
    </motion.section>
  );
};

// Full-screen frame with the room bar on top
// Rendered into #overlay-root (inside the themed app root, above the navbar)
const Overlay = (props) => {
  const target = document.getElementById('overlay-root');
  const content = <OverlayFrame {...props} />;
  return target ? createPortal(content, target) : content;
};

const OverlayFrame = ({ title, code, type, players, phase, qIndex, total, onEnd, children }) => (
  <div className="fixed inset-0 z-[80] bg-bg text-fg overflow-y-auto" role="dialog" aria-modal="true" aria-label={`Live game: ${title}`}>
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 60% 45% at 50% 0%, rgb(var(--accent-rgb) / 0.22), transparent 70%), radial-gradient(ellipse 50% 40% at 100% 100%, rgb(var(--accent-rgb) / 0.1), transparent 70%)',
      }}
      aria-hidden="true"
    />
    <div className="relative min-h-full flex flex-col px-4 sm:px-8 py-5 gap-6">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[rgb(var(--accent-rgb))] text-ink-950">
            <Icon name="sports_esports" className="!text-[22px]" />
          </span>
          <div className="min-w-0">
            <p className="font-geist font-semibold text-fg truncate">{title}</p>
            <p className="text-[12px] text-fg/55">
              {typeLabel(type)}
              {phase && phase !== PHASES.LOBBY && phase !== PHASES.PODIUM && total ? ` · Question ${qIndex + 1} of ${total}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="glass rounded-full px-3.5 py-2 text-[13px] text-fg/80 flex items-center gap-1.5">
            <Icon name="tag" className="!text-[16px]" />
            <span className="font-geist font-semibold tracking-wider">{code}</span>
          </span>
          <span className="glass rounded-full px-3.5 py-2 text-[13px] text-fg/80 flex items-center gap-1.5">
            <Icon name="group" className="!text-[16px]" /> {players}
          </span>
          <MuteButton />
          <button
            type="button"
            onClick={onEnd}
            className="glass rounded-full px-4 h-10 text-[13px] font-semibold text-fg/80 hover:text-fg cursor-pointer"
          >
            End game
          </button>
        </div>
      </header>
      {children}
    </div>
  </div>
);

export default HostGame;
