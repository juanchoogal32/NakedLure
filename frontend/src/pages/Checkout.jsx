import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { createOrder } from "../lib/api";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";

const Checkout = () => {
  const { items, totals, clear } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [ship, setShip] = useState({
    full_name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "USA",
  });
  const [payment, setPayment] = useState("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  const change = (k) => (e) => setShip({ ...ship, [k]: e.target.value });
  const changeCard = (k) => (e) => setCard({ ...card, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setLoading(true);
    try {
      const order = await createOrder({ items, shipping: ship, payment_method: payment });
      setPlaced(order);
      clear();
      toast.success("Order confirmed!", { description: `Order #${order.order_number}` });
    } catch {
      toast.error("Checkout failed", { description: "Please verify your details and retry." });
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <section className="max-w-[800px] mx-auto px-5 md:px-10 py-24 text-center" data-testid="checkout-success">
        <CheckCircle2 className="w-16 h-16 text-[#c8102e] mx-auto mb-6" />
        <p className="text-xs uppercase tracking-[0.28em] text-[#c8102e] font-bold">Order Confirmed</p>
        <h1 className="font-display text-5xl md:text-6xl font-black tracking-tighter mt-4">
          Thank you, <span className="text-[#c8102e]">{placed.shipping.full_name.split(" ")[0]}</span>.
        </h1>
        <p className="text-[#555] mt-6 text-lg">
          Your order <span className="font-bold text-[#0a0a0a]" data-testid="order-number">{placed.order_number}</span> has
          been placed. A confirmation has been sent to{" "}
          <span className="font-bold text-[#0a0a0a]">{placed.shipping.email}</span>.
        </p>
        <div className="bg-[#f9f9f9] p-6 mt-10 text-left">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#555]">Subtotal</span>
            <span className="font-bold">${placed.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#555]">Shipping</span>
            <span className="font-bold">
              {placed.shipping_cost === 0 ? "FREE" : `$${placed.shipping_cost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#555]">Tax</span>
            <span className="font-bold">${placed.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="font-bold uppercase tracking-wider">Total</span>
            <span className="font-display text-2xl font-black">${placed.total.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center mt-10">
          <button className="btn-red" onClick={() => navigate("/shop")} data-testid="success-continue-btn">
            Keep Shopping
          </button>
          <button className="btn-outline" onClick={() => navigate("/")} data-testid="success-home-btn">
            Home
          </button>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="max-w-[600px] mx-auto px-5 md:px-10 py-24 text-center" data-testid="checkout-empty">
        <h1 className="font-display text-4xl font-black mb-4">Your cart is empty</h1>
        <p className="text-[#555] mb-8">Add a tee before checking out.</p>
        <Link to="/shop" className="btn-red" data-testid="checkout-empty-shop-btn">
          Shop the Collection
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-16" data-testid="checkout-page">
      <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-10">
        Secure <span className="text-[#c8102e]">Checkout</span>
      </h1>
      <div className="grid md:grid-cols-12 gap-12">
        <form onSubmit={submit} className="md:col-span-7 space-y-10" data-testid="checkout-form">
          {/* Shipping */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-5">Shipping Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" value={ship.full_name} onChange={change("full_name")} required tid="ship-name" />
              <Field label="Email" type="email" value={ship.email} onChange={change("email")} required tid="ship-email" />
              <Field label="Address" value={ship.address} onChange={change("address")} required tid="ship-address" full />
              <Field label="City" value={ship.city} onChange={change("city")} required tid="ship-city" />
              <Field label="State" value={ship.state} onChange={change("state")} required tid="ship-state" />
              <Field label="ZIP code" value={ship.zip_code} onChange={change("zip_code")} required tid="ship-zip" />
              <Field label="Country" value={ship.country} onChange={change("country")} required tid="ship-country" />
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-5 flex items-center gap-2">
              Payment <Lock className="w-4 h-4 text-[#c8102e]" />
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { k: "card", l: "Card" },
                { k: "paypal", l: "PayPal" },
                { k: "gcash", l: "GCash" },
              ].map((o) => (
                <button
                  type="button"
                  key={o.k}
                  onClick={() => setPayment(o.k)}
                  className={`py-3 text-xs uppercase tracking-[0.2em] font-bold border-2 transition-colors ${
                    payment === o.k
                      ? "border-[#c8102e] bg-[#c8102e] text-white"
                      : "border-gray-200 hover:border-[#0a0a0a]"
                  }`}
                  data-testid={`pay-${o.k}`}
                >
                  {o.l}
                </button>
              ))}
            </div>
            {payment === "card" && (
              <div className="grid sm:grid-cols-2 gap-4" data-testid="card-fields">
                <Field label="Card number" placeholder="4242 4242 4242 4242" value={card.number} onChange={changeCard("number")} required tid="card-number" full icon={<CreditCard className="w-4 h-4" />} />
                <Field label="Name on card" value={card.name} onChange={changeCard("name")} required tid="card-name" />
                <Field label="Expiry (MM/YY)" placeholder="12/28" value={card.expiry} onChange={changeCard("expiry")} required tid="card-expiry" />
                <Field label="CVV" placeholder="123" value={card.cvv} onChange={changeCard("cvv")} required tid="card-cvv" />
              </div>
            )}
            {payment !== "card" && (
              <div className="bg-[#f9f9f9] p-6 text-sm text-[#555]" data-testid="alt-pay-note">
                You'll be redirected to complete payment with{" "}
                <span className="font-bold text-[#0a0a0a] uppercase">{payment}</span> after placing the order.
                <p className="text-xs mt-2 italic">(Mock checkout — no real charge.)</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-red w-full md:w-auto md:px-16 py-5"
            data-testid="place-order-btn"
          >
            {loading ? "Processing..." : `Place Order · $${totals.total.toFixed(2)}`}
          </button>
        </form>

        {/* Summary */}
        <aside className="md:col-span-5" data-testid="checkout-summary">
          <div className="bg-[#0a0a0a] text-white p-8 md:sticky md:top-28">
            <h3 className="font-display text-2xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2">
              {items.map((i) => (
                <div key={`${i.product_id}-${i.size}`} className="flex gap-3" data-testid={`summary-item-${i.product_id}-${i.size}`}>
                  <div className="w-16 h-20 bg-[#1a1a1a] flex-shrink-0 overflow-hidden">
                    <img src={i.image_url} alt={i.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-bold">{i.name}</p>
                    <p className="text-white/60 text-xs mt-0.5">
                      Size {i.size} · Qty {i.quantity}
                    </p>
                    <p className="font-bold mt-1">${(i.price * i.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 mt-6 pt-5 space-y-2 text-sm">
              <Row l="Subtotal" v={`$${totals.subtotal.toFixed(2)}`} />
              <Row l="Shipping" v={totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`} />
              <Row l="Tax" v={`$${totals.tax.toFixed(2)}`} />
            </div>
            <div className="flex justify-between pt-4 mt-3 border-t border-white/10 items-end">
              <span className="text-xs uppercase tracking-[0.2em] font-bold">Total</span>
              <span className="font-display text-3xl font-black text-[#c8102e]" data-testid="summary-total">
                ${totals.total.toFixed(2)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

const Row = ({ l, v }) => (
  <div className="flex justify-between">
    <span className="text-white/60">{l}</span>
    <span className="font-bold">{v}</span>
  </div>
);

const Field = ({ label, value, onChange, type = "text", required, tid, placeholder, full, icon }) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#555] mb-2 flex items-center gap-2">
      {icon} {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full bg-white border-2 border-gray-200 focus:border-[#c8102e] px-4 py-3 outline-none"
      data-testid={tid}
    />
  </div>
);

export default Checkout;
