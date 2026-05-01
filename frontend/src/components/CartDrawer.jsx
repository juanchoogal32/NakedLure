import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { useCart } from "../context/CartContext";
import { Plus, Minus, X, ShoppingBag } from "lucide-react";

const CartDrawer = () => {
  const { items, totals, removeItem, updateQty, drawerOpen, setDrawerOpen } = useCart();

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col" data-testid="cart-drawer">
        <SheetHeader className="px-6 py-5 border-b">
          <SheetTitle className="font-display text-2xl tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" /> Your Cart ({totals.count})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" data-testid="cart-empty">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
              <ShoppingBag className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="font-display text-xl font-bold">Your cart is empty</h3>
            <p className="text-sm text-[#555] mt-2 mb-6">Cast a line and grab a tee.</p>
            <Link
              to="/shop"
              onClick={() => setDrawerOpen(false)}
              className="btn-red"
              data-testid="cart-empty-shop-btn"
            >
              Shop the Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {items.map((i) => (
                <div
                  key={`${i.product_id}-${i.size}`}
                  className="flex gap-4"
                  data-testid={`cart-item-${i.product_id}-${i.size}`}
                >
                  <div className="w-20 h-24 bg-[#111] flex-shrink-0 overflow-hidden">
                    <img src={i.image_url} alt={i.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm leading-tight">{i.name}</h4>
                        <p className="text-xs text-[#555] mt-1">Size: {i.size}</p>
                      </div>
                      <button
                        onClick={() => removeItem(i.product_id, i.size)}
                        className="text-gray-400 hover:text-[#c8102e]"
                        data-testid={`cart-remove-${i.product_id}-${i.size}`}
                        aria-label="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() => updateQty(i.product_id, i.size, i.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                          data-testid={`cart-decrement-${i.product_id}-${i.size}`}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold" data-testid={`cart-qty-${i.product_id}-${i.size}`}>
                          {i.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(i.product_id, i.size, i.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                          data-testid={`cart-increment-${i.product_id}-${i.size}`}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold">${(i.price * i.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t px-6 py-5 space-y-3 bg-[#f9f9f9]">
              <div className="flex justify-between text-sm">
                <span className="text-[#555]">Subtotal</span>
                <span className="font-bold" data-testid="cart-subtotal">${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#555]">Shipping</span>
                <span className="font-bold">
                  {totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#555]">Tax (est.)</span>
                <span className="font-bold">${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base pt-3 border-t border-gray-200">
                <span className="font-bold uppercase tracking-wider">Total</span>
                <span className="font-display text-xl font-black" data-testid="cart-total">
                  ${totals.total.toFixed(2)}
                </span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setDrawerOpen(false)}
                className="btn-red w-full mt-4"
                data-testid="cart-checkout-btn"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
