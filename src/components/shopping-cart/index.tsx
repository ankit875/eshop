import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";

import CheckoutStatus from "../checkout-status";
import Item from "./item";

const ShoppingCart = () => {
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const priceTotal = () => {
    let totalPrice = 0;
    if (cartItems.length > 0) {
      cartItems.map((item) => (totalPrice += item.price * item.count));
    }

    return totalPrice;
  };

  const router = useRouter();

  const handleCheckout = async () => {
    // create a payment session on server then redirect to checkout with sessionId
    try {
      const resp = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: priceTotal() }),
      });
      if (!resp.ok) throw new Error("failed to create session");
      const { sessionId } = await resp.json();
      router.push(`/cart/checkout?sessionId=${encodeURIComponent(sessionId)}`);
    } catch (err) {
      console.error(err);
      router.push("/cart/checkout");
    }
  };

  return (
    <section className="cart">
      <div className="container">
        <div className="cart__intro">
          <h3 className="cart__title">Shopping Cart</h3>
          <CheckoutStatus step="cart" />
        </div>

        <div className="cart-list">
          {cartItems.length > 0 && (
            <table>
              <tbody>
                <tr>
                  <th style={{ textAlign: "left" }}>Product</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Ammount</th>
                  <th>Price</th>
                  <th />
                </tr>

                {cartItems.map((item) => (
                  <Item
                    key={item.id}
                    id={item.id}
                    thumb={item.thumb}
                    name={item.name}
                    color={item.color}
                    price={item.price}
                    size={item.size}
                    count={item.count}
                  />
                ))}
              </tbody>
            </table>
          )}

          {cartItems.length === 0 && <p>Nothing in the cart</p>}
        </div>

        <div className="cart-actions">
          <Link href="/products" className="cart__btn-back">
            <i className="icon-left" /> Continue Shopping
          </Link>
          <input
            type="text"
            placeholder="Promo Code"
            className="cart__promo-code"
          />

          <div className="cart-actions__items-wrapper">
            <p className="cart-actions__total">
              Total cost <strong>${priceTotal().toFixed(2)}</strong>
            </p>
            <button
              onClick={handleCheckout}
              className="btn btn--rounded btn--yellow"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
