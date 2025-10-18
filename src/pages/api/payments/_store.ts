// Simple in-memory payment session store for demo/testing only
type Session = {
  id: string;
  amount: number;
  status: "created" | "paid" | "failed";
  createdAt: number;
  metadata?: Record<string, any>;
};

// Use a global container so the sessions Map survives module reloads in dev
// and is shared across API route module instances.
const _global = globalThis as any;
if (!_global.__payment_sessions__) {
  _global.__payment_sessions__ = new Map<string, Session>();
}
const sessions: Map<string, Session> = _global.__payment_sessions__;

export function createSession(
  id: string,
  amount: number,
  metadata?: Record<string, any>
) {
  const session: Session = {
    id,
    amount,
    status: "created",
    createdAt: Date.now(),
    metadata,
  };
  sessions.set(id, session);
  return session;
}

export function getSession(id: string) {
  return sessions.get(id) ?? null;
}

// Dev helper: return all sessions (not intended for production)
export function listSessions() {
  return Array.from(sessions.values());
}

export function markPaid(id: string) {
  const s = sessions.get(id);
  if (!s) return null;
  s.status = "paid";
  sessions.set(id, s);
  return s;
}

export function clearSessions() {
  sessions.clear();
}
