import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "./_store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { sessionId } = req.query ?? {};
  if (!sessionId || typeof sessionId !== "string")
    return res.status(400).json({ error: "sessionId required" });

  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: "session not found" });

  res
    .status(200)
    .json({
      sessionId: session.id,
      status: session.status,
      amount: session.amount,
      metadata: session.metadata ?? {},
    });
}
