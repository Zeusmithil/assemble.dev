/*
 * Connection between the host screen and players.
 *
 * DEMO TRANSPORT: uses the browser's BroadcastChannel, so players can join
 * from other tabs/windows of the same browser. When the Python backend
 * exists, replace these two functions with WebSocket versions that keep the
 * same shape:
 *   hostRoom(code, onAction)  -> { publish(state), close() }
 *   joinRoom(code, onState)   -> { send(action), close() }
 */

const channelName = (code) => `connect-arena-${String(code).toUpperCase()}`;
const supported = typeof window !== 'undefined' && 'BroadcastChannel' in window;

export const transportSupported = supported;

export const hostRoom = (code, onAction) => {
  if (!supported) return { publish: () => {}, close: () => {} };
  const ch = new BroadcastChannel(channelName(code));
  let last = null;
  ch.onmessage = (e) => {
    const msg = e.data || {};
    if (msg.kind === 'action') onAction(msg.action);
    // A player that just opened the page asks for the current state
    if (msg.kind === 'hello' && last) ch.postMessage({ kind: 'state', state: last });
  };
  return {
    publish(state) {
      last = state;
      ch.postMessage({ kind: 'state', state });
    },
    close() {
      ch.postMessage({ kind: 'closed' });
      ch.close();
    },
  };
};

export const joinRoom = (code, { onState, onClosed }) => {
  if (!supported) return { send: () => {}, close: () => {} };
  const ch = new BroadcastChannel(channelName(code));
  ch.onmessage = (e) => {
    const msg = e.data || {};
    if (msg.kind === 'state') onState(msg.state);
    if (msg.kind === 'closed' && onClosed) onClosed();
  };
  ch.postMessage({ kind: 'hello' });
  return {
    send(action) {
      ch.postMessage({ kind: 'action', action });
    },
    hello() {
      ch.postMessage({ kind: 'hello' });
    },
    close() {
      ch.close();
    },
  };
};
