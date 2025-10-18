import type { NextApiRequest, NextApiResponse } from "next";

import { createSession } from "./_store";

function simpleId() {
  return (
    "sess_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { amount, metadata } = req.body ?? {};
  if (typeof amount !== "number")
    return res.status(400).json({ error: "amount required" });

  const id = simpleId();
  const session = createSession(id, amount, metadata);

  // Return the session id to the client so the extension/landing page can pick it up
  res.status(201).json({ sessionId: session.id, amount: session.amount });
}
