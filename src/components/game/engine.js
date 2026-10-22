/*
 * Connect Arena game engine: the pure rules of a live game room.
 * The host owns the authoritative state and applies player actions to it;
 * players only ever see `publicState(state)`. When the real backend lands,
 * the server runs these same functions and the screens stay unchanged.
 */

export const PHASES = {
  LOBBY: 'lobby',
  QUESTION: 'question',
  REVEAL: 'reveal',
  LEADERBOARD: 'leaderboard',
  PODIUM: 'podium',
};

export const POWERUPS = {
  double: { id: 'double', label: 'Double points', icon: 'bolt', hint: '2× points on this question' },
  fifty: { id: 'fifty', label: '50 / 50', icon: 'content_cut', hint: 'Removes two wrong answers' },
  freeze: { id: 'freeze', label: 'Time freeze', icon: 'ac_unit', hint: '+5 seconds for you' },
  shield: { id: 'shield', label: 'Shield', icon: 'shield', hint: 'Keeps your streak if wrong' },
};
const POWERUP_IDS = Object.keys(POWERUPS);

export const AVATARS = ['rocket_launch', 'pets', 'music_note', 'sports_esports', 'local_fire_department', 'bolt', 'diamond', 'eco', 'star', 'face'];

const BASE_POINTS = 500;
const SPEED_POINTS = 500;
const STREAK_BONUS = 100;
const FREEZE_MS = 5000;

export const timeLimitFor = (type) => (type === 'Rapid Fire' ? 10 : type === 'Poll' ? 25 : 20) * 1000;

export const isScored = (type) => type !== 'Poll';

export const createRoom = (activity) => ({
  code: activity.roomCode,
  title: activity.title,
  type: activity.type,
  questions: (activity.questions || []).filter((q) => Array.isArray(q.options) && q.options.length >= 2),
  phase: PHASES.LOBBY,
  qIndex: -1,
  startedAt: 0,
  deadline: 0,
  players: {},
  // per question: { [playerId]: { option, at, points, correct } }
  answers: {},
  // ranking before the latest question, so the leaderboard can animate movement
  previousRanks: {},
});

export const playerList = (state) => Object.values(state.players);

export const ranked = (state) =>
  playerList(state).sort((a, b) => b.score - a.score || a.joinedAt - b.joinedAt);

const pickPowerup = (seed) => POWERUP_IDS[Math.abs(seed) % POWERUP_IDS.length];

// ---------------------------------------------------------------------------
// Host-side transitions
// ---------------------------------------------------------------------------

export const addPlayer = (state, { id, name, avatar }) => {
  if (state.players[id]) {
    return { ...state, players: { ...state.players, [id]: { ...state.players[id], name, avatar, connected: true } } };
  }
  return {
    ...state,
    players: {
      ...state.players,
      [id]: {
        id,
        name: (name || 'Player').slice(0, 20),
        avatar: avatar || AVATARS[0],
        score: 0,
        streak: 0,
        bestStreak: 0,
        correctCount: 0,
        // Everyone starts with one 50/50; more are earned through streaks
        powerups: ['fifty'],
        active: {}, // power-ups armed for the current question
        hidden: [], // option indexes removed by 50/50 for the current question
        extraMs: 0, // time freeze for the current question
        joinedAt: Date.now(),
        connected: true,
      },
    },
  };
};

export const removePlayer = (state, id) => {
  const players = { ...state.players };
  delete players[id];
  return { ...state, players };
};

export const startQuestion = (state, index, now = Date.now()) => {
  const q = state.questions[index];
  if (!q) return { ...state, phase: PHASES.PODIUM };
  const players = {};
  Object.values(state.players).forEach((p) => {
    players[p.id] = { ...p, active: {}, hidden: [], extraMs: 0 };
  });
  const previousRanks = {};
  ranked(state).forEach((p, i) => {
    previousRanks[p.id] = i;
  });
  return {
    ...state,
    phase: PHASES.QUESTION,
    qIndex: index,
    startedAt: now,
    deadline: now + timeLimitFor(state.type),
    players,
    answers: { ...state.answers, [index]: {} },
    previousRanks,
  };
};

// The question closes when the clock runs out (including any personal time
// freezes for players still answering) or when everyone has answered.
export const questionShouldClose = (state, now = Date.now()) => {
  if (state.phase !== PHASES.QUESTION) return false;
  const answered = state.answers[state.qIndex] || {};
  const players = playerList(state);
  if (players.length > 0 && players.every((p) => answered[p.id])) return true;
  const latest = players.reduce(
    (max, p) => (answered[p.id] ? max : Math.max(max, state.deadline + (p.extraMs || 0))),
    state.deadline
  );
  return now >= latest;
};

export const submitAnswer = (state, playerId, option, now = Date.now()) => {
  const player = state.players[playerId];
  if (!player || state.phase !== PHASES.QUESTION) return state;
  const answered = state.answers[state.qIndex] || {};
  if (answered[playerId]) return state;
  const limit = timeLimitFor(state.type) + (player.extraMs || 0);
  const elapsed = now - state.startedAt;
  if (elapsed > limit + 400) return state; // late, ignore
  return {
    ...state,
    answers: { ...state.answers, [state.qIndex]: { ...answered, [playerId]: { option, at: now, elapsed } } },
  };
};

export const usePowerup = (state, playerId, powerupId) => {
  const player = state.players[playerId];
  if (!player || state.phase !== PHASES.QUESTION) return state;
  if (!player.powerups.includes(powerupId) || player.active[powerupId]) return state;
  const answered = state.answers[state.qIndex] || {};
  if (answered[playerId]) return state;
  const q = state.questions[state.qIndex];
  const next = {
    ...player,
    powerups: player.powerups.filter((p, i) => i !== player.powerups.indexOf(powerupId)),
    active: { ...player.active, [powerupId]: true },
  };
  if (powerupId === 'fifty' && isScored(state.type)) {
    const wrong = q.options.map((_, i) => i).filter((i) => i !== q.correct);
    // Remove two (or as many as possible while leaving one wrong answer)
    const removeCount = Math.min(2, Math.max(0, wrong.length - 1));
    next.hidden = wrong.sort(() => Math.random() - 0.5).slice(0, removeCount);
  }
  if (powerupId === 'freeze') next.extraMs = FREEZE_MS;
  return { ...state, players: { ...state.players, [playerId]: next } };
};

// Score the current question and move to the reveal
export const revealQuestion = (state) => {
  if (state.phase !== PHASES.QUESTION) return state;
  const q = state.questions[state.qIndex];
  const scored = isScored(state.type);
  const limit = timeLimitFor(state.type);
  const answered = { ...(state.answers[state.qIndex] || {}) };
  const players = {};
  Object.values(state.players).forEach((p) => {
    const a = answered[p.id];
    const correct = scored && a && a.option === q.correct;
    let points = 0;
    let streak = p.streak;
    let powerups = p.powerups;
    if (scored) {
      if (correct) {
        const speed = Math.max(0, 1 - a.elapsed / (limit + (p.extraMs || 0)));
        streak = p.streak + 1;
        points = Math.round(BASE_POINTS + SPEED_POINTS * speed + STREAK_BONUS * Math.min(streak - 1, 5));
        if (p.active.double) points *= 2;
        // Streaks of 2, 4, 6… earn a new power-up (max 3 held)
        if (streak % 2 === 0 && powerups.length < 3) {
          powerups = [...powerups, pickPowerup(p.joinedAt + streak + state.qIndex)];
        }
      } else if (!p.active.shield) {
        streak = 0;
      }
    }
    if (a) answered[p.id] = { ...a, correct, points };
    players[p.id] = {
      ...p,
      score: p.score + points,
      streak,
      bestStreak: Math.max(p.bestStreak, streak),
      correctCount: p.correctCount + (correct ? 1 : 0),
      powerups,
    };
  });
  return { ...state, phase: PHASES.REVEAL, players, answers: { ...state.answers, [state.qIndex]: answered } };
};

export const showLeaderboard = (state) => ({ ...state, phase: PHASES.LEADERBOARD });

export const nextStep = (state, now = Date.now()) => {
  if (state.phase === PHASES.LOBBY) return startQuestion(state, 0, now);
  if (state.phase === PHASES.REVEAL) {
    return isScored(state.type) ? showLeaderboard(state) : advance(state, now);
  }
  if (state.phase === PHASES.LEADERBOARD) return advance(state, now);
  return state;
};

const advance = (state, now) =>
  state.qIndex + 1 < state.questions.length ? startQuestion(state, state.qIndex + 1, now) : { ...state, phase: PHASES.PODIUM };

// Apply an action sent by a player
export const applyPlayerAction = (state, action, now = Date.now()) => {
  switch (action.type) {
    case 'join':
      return addPlayer(state, action.player);
    case 'leave':
      return state.phase === PHASES.LOBBY ? removePlayer(state, action.playerId) : state;
    case 'answer':
      return submitAnswer(state, action.playerId, action.option, now);
    case 'powerup':
      return usePowerup(state, action.playerId, action.powerup);
    default:
      return state;
  }
};

// ---------------------------------------------------------------------------
// What players are allowed to see: no correct answer until the reveal
// ---------------------------------------------------------------------------
export const publicState = (state) => {
  const q = state.questions[state.qIndex];
  const showAnswer = state.phase === PHASES.REVEAL || state.phase === PHASES.LEADERBOARD || state.phase === PHASES.PODIUM;
  const answered = state.answers[state.qIndex] || {};
  const tally = q ? q.options.map((_, i) => Object.values(answered).filter((a) => a.option === i).length) : [];
  return {
    code: state.code,
    title: state.title,
    type: state.type,
    phase: state.phase,
    qIndex: state.qIndex,
    total: state.questions.length,
    startedAt: state.startedAt,
    deadline: state.deadline,
    timeLimit: timeLimitFor(state.type),
    question: q
      ? {
          text: q.question,
          options: q.options,
          correct: showAnswer ? q.correct : null,
          explanation: showAnswer ? q.explanation || '' : '',
        }
      : null,
    tally: showAnswer ? tally : null,
    answeredCount: Object.keys(answered).length,
    answers: showAnswer ? answered : Object.fromEntries(Object.keys(answered).map((id) => [id, { locked: true }])),
    players: state.players,
    previousRanks: state.previousRanks,
  };
};
