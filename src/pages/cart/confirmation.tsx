import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

import Layout from "../../layouts/Main";
import type { RootState } from "@/store";
import { clearCart } from "@/store/reducers/cart";

const ConfirmationPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<null | boolean>(null);

  // Compute total based on current cart items
  const total = cartItems.reduce((s, i) => s + i.price * i.count, 0);

  useEffect(() => {
    // generate order id only on the client after hydration
    setOrderId(`ORD-${Date.now().toString().slice(-6)}`);

    const verify = async () => {
      const { sessionId } = router.query ?? {};

      // If a sessionId is provided, verify with the backend.
      if (sessionId && typeof sessionId === "string") {
        setVerifying(true);
        try {
          const res = await fetch(
            `/api/payments/verify?sessionId=${encodeURIComponent(sessionId)}`
          );
          if (!res.ok) {
            setVerified(false);
            return;
          }
          const data = await res.json();
          if (data.status === "paid") {
            setVerified(true);
            // clear cart when payment is confirmed
            dispatch(clearCart());
          } else {
            setVerified(false);
          }
        } catch (err) {
          console.error(err);
          setVerified(false);
        } finally {
          setVerifying(false);
        }
      } else {
        setVerified(true);
      }
    };

    verify();
  }, [dispatch, router.query]);

  return (
    <Layout>
      <section className="block">
        <div className="container">
          <h3 className="block__title">Order confirmation</h3>

          <div className="order-confirmation">
            <p>Thank you for your purchase!</p>
            {verifying && <p>Verifying payment...</p>}
            {verified === false && (
              <p style={{ color: "red" }}>
                Payment not verified. If you were charged, contact support.
              </p>
            )}
            <p>
              Your order id: <strong>{orderId}</strong>
            </p>

            <div className="order-actions">
              <Link href="/products" className="btn btn--rounded btn--yellow">
                Continue shopping
              </Link>
              <Link href="/" className="btn btn--rounded btn--border">
                Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ConfirmationPage;
