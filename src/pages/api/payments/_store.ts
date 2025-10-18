// Simple in-memory payment session store for demo/testing only
type Session = {
  id: string;
  amount: number;
  status: "created" | "paid" | "failed";
  createdAt: number;
  metadata?: Record<string, any>;
};

const sessions = new Map<string, Session>();

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
