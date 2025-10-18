/* eslint-disable */
// Simple in-memory payment session store for demo/testing only
type SessionStatus = "created" | "paid" | "failed";

type Metadata = Record<string, unknown>;

type Session = {
  id: string;
  amount: number;
  status: SessionStatus;
  createdAt: number;
  metadata?: Metadata;
};

// Use a global container so the sessions Map survives module reloads in dev
// and is shared across API route module instances.
declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var __payment_sessions__: Map<string, Session> | undefined;
}

if (!globalThis.__payment_sessions__) {
  globalThis.__payment_sessions__ = new Map<string, Session>();
}
const sessions: Map<string, Session> = globalThis.__payment_sessions__ as Map<
  string,
  Session
>;

export function createSession(id: string, amount: number, metadata?: Metadata) {
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

export function getSession(id: string): Session | null {
  return sessions.get(id) ?? null;
}

// Dev helper: return all sessions (not intended for production)
export function listSessions(): Session[] {
  return Array.from(sessions.values());
}

export function markPaid(id: string): Session | null {
  const s = sessions.get(id);
  if (!s) return null;
  s.status = "paid";
  sessions.set(id, s);
  return s;
}

export function clearSessions(): void {
  sessions.clear();
}
