import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useCart } from "../context/CartContext";

const LOGO =
  "https://customer-assets.emergentagent.com/job_sierra-lure-gear/artifacts/bj8ur19k_Naked%20Lure%20White.png";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const { totals, setDrawerOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Announcement bar */}
      <div
        className="w-full bg-[#0a0a0a] text-white text-[11px] sm:text-xs tracking-[0.2em] uppercase py-2 overflow-hidden"
        data-testid="announcement-bar"
      >
        <div className="flex whitespace-nowrap animate-ticker">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex shrink-0">
              {[
                "Free US shipping over $75",
                "Made for fishing patriots",
                "Heavyweight cotton · Built to last",
                "New drops every season",
                "Ship worldwide",
              ].map((t, i) => (
                <span key={`${k}-${i}`} className="px-8 flex items-center gap-8">
                  {t}
                  <span className="text-[#c8102e]">★</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header
        className="sticky top-0 z-40 bg-[#c8102e] border-b border-white/10"
        data-testid="site-header"
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex items-center justify-between h-28 py-3">
          <button
            className="md:hidden p-2 -ml-2 text-white"
            onClick={() => setMobileOpen(true)}
            data-testid="mobile-menu-open-btn"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center px-2" data-testid="header-logo-link">
            <img src={LOGO} alt="Naked Lure" className="h-20 sm:h-24 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-10" data-testid="desktop-nav">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `nl-link nl-link-light text-[13px] uppercase tracking-[0.18em] font-bold ${
                    isActive ? "text-white active" : "text-white/85 hover:text-white"
                  }`
                }
                data-testid={`nav-link-${n.label.toLowerCase()}`}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/shop"
              className="hidden sm:inline-flex p-2 text-white hover:text-white/70 transition-colors"
              data-testid="search-link"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative p-2 text-white hover:text-white/70 transition-colors"
              data-testid="open-cart-btn"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {totals.count > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-white text-[#c8102e] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  data-testid="cart-count-badge"
                >
                  {totals.count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" data-testid="mobile-menu">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[82%] max-w-sm bg-white p-6 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <img src={LOGO} alt="Naked Lure" className="h-10 w-10 object-contain" />
              <button
                onClick={() => setMobileOpen(false)}
                data-testid="mobile-menu-close-btn"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {navItems.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `font-display text-3xl font-bold ${isActive ? "text-[#c8102e]" : "text-[#0a0a0a]"}`
                  }
                  data-testid={`mobile-nav-link-${n.label.toLowerCase()}`}
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto text-xs uppercase tracking-[0.2em] text-[#555]">
              Made for Fishing Patriots
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
