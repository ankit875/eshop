import type { NextApiRequest, NextApiResponse } from "next";

import { getSession, markPaid } from "./_store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { sessionId } = req.body ?? {};
  if (!sessionId || typeof sessionId !== "string")
    return res.status(400).json({ error: "sessionId required" });

  const existing = getSession(sessionId);
  if (!existing) return res.status(404).json({ error: "session not found" });

  const updated = markPaid(sessionId);
  res.status(200).json({ sessionId: updated?.id, status: updated?.status });
}
