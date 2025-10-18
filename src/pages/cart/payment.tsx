/* eslint-disable */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "../../layouts/Main";

type Session = {
  sessionId: string;
  status: "created" | "paid" | "failed";
  amount?: number;
  metadata?: Record<string, unknown>;
};

const PaymentPage = () => {
  const router = useRouter();
  const { sessionId } = router.query;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    const fetchSession = async () => {
      const res = await fetch(
        `/api/payments/verify?sessionId=${encodeURIComponent(String(sessionId))}`
      );
      const data = await res.json();
      setSession(data);
    };
    fetchSession();
  }, [sessionId]);

  const simulatePay = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      // Mark session paid (for local testing). In production the extension or payment webhook should do this.
      await fetch("/api/payments/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      // Redirect back to confirmation
      router.push(
        `/cart/confirmation?sessionId=${encodeURIComponent(String(sessionId))}`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="block">
        <div className="container">
          <h3 className="block__title">Payment</h3>
          <p>
            Session: <strong>{String(sessionId)}</strong>
          </p>
          {session && <p>Status: {session.status}</p>}

          <p>
            The extension should pick up this session and complete the payment.
            After completion it must redirect the user back to{" "}
            <code>/cart/confirmation?sessionId=...</code>
          </p>

          <div style={{ marginTop: 20 }}>
            <button
              className="btn btn--rounded btn--yellow"
              onClick={simulatePay}
              disabled={loading}
            >
              {loading ? "Processing..." : "Simulate pay (for local testing)"}
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PaymentPage;
