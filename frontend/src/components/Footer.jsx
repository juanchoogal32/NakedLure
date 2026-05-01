import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail } from "lucide-react";

const LOGO =
  "https://customer-assets.emergentagent.com/job_34afdf14-6d91-4e00-af4a-38ae101f3446/artifacts/vkap8h59_Naked%20Lure.png";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white" data-testid="site-footer">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="mb-6">
            <img src={LOGO} alt="Naked Lure" className="h-20 md:h-24 w-auto object-contain" />
          </div>
          <p className="text-white/70 leading-relaxed max-w-md">
            Patriotic fishing apparel for anglers who value freedom, adventure, and wild water. Built rugged.
            Worn proud.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 border border-white/20 flex items-center justify-center hover:bg-[#c8102e] hover:border-[#c8102e] transition-colors"
              data-testid="footer-instagram"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 border border-white/20 flex items-center justify-center hover:bg-[#c8102e] hover:border-[#c8102e] transition-colors"
              data-testid="footer-facebook"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="mailto:hello@nakedlure.com"
              className="w-11 h-11 border border-white/20 flex items-center justify-center hover:bg-[#c8102e] hover:border-[#c8102e] transition-colors"
              data-testid="footer-email"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#c8102e] font-bold mb-5">Shop</h4>
          <ul className="space-y-3 text-white/80">
            <li><Link to="/shop" className="hover:text-white">All Shirts</Link></li>
            <li><Link to="/shop?category=Fishing%20Shirts" className="hover:text-white">Fishing</Link></li>
            <li><Link to="/shop?category=Patriotic%20Graphics" className="hover:text-white">Patriotic</Link></li>
            <li><Link to="/shop?category=Outdoor%20Lifestyle" className="hover:text-white">Outdoor</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#c8102e] font-bold mb-5">Brand</h4>
          <ul className="space-y-3 text-white/80">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/admin" className="hover:text-white">Admin</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#c8102e] font-bold mb-5">Newsletter</h4>
          <p className="text-white/70 text-sm mb-4">
            Get new drops, field stories, and 10% off your first order.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex"
            data-testid="footer-newsletter-form"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 bg-transparent border border-white/30 px-4 py-3 text-sm outline-none focus:border-[#c8102e]"
              data-testid="newsletter-email-input"
            />
            <button
              type="submit"
              className="bg-[#c8102e] hover:bg-white hover:text-[#c8102e] transition-colors px-5 text-xs uppercase font-bold tracking-[0.15em]"
              data-testid="newsletter-submit-btn"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p data-testid="footer-copyright">© 2026 Naked Lure. All rights reserved.</p>
          <p className="uppercase tracking-[0.25em] text-white/80" data-testid="footer-tagline">
            Made for Fishing Patriots
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
