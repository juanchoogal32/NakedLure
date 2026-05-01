import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Truck, ShieldCheck, Award, Flag } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1491847658187-eeea406aa32a?auto=format&fit=crop&w=2000&q=80";
const LIFESTYLE_IMG =
  "https://images.pexels.com/photos/11315282/pexels-photo-11315282.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1100&w=1500";

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchProducts({ featured: true }).then(setFeatured).catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden" data-testid="hero-section">
        <img
          src={HERO_IMG}
          alt="Eastern Sierra California"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="grain absolute inset-0" />

        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col justify-end pb-20 md:pb-28">
          <div className="max-w-3xl">
            <span
              className="inline-flex items-center gap-2 text-white/90 text-xs uppercase tracking-[0.28em] font-bold mb-6 fade-up"
              data-testid="hero-eyebrow"
            >
              <span className="w-8 h-[2px] bg-[#c8102e]" /> Eastern Sierra · California
            </span>
            <h1
              className="font-display text-white font-black text-5xl sm:text-6xl lg:text-8xl leading-[0.95] tracking-tighter mb-6 fade-up fade-up-delay-1"
              data-testid="hero-title"
            >
              Naked <span className="text-[#c8102e]">Lure</span>
              <span className="block text-white/90 text-2xl sm:text-3xl lg:text-4xl italic font-normal mt-4 tracking-tight">
                Patriotic fishing apparel.
              </span>
            </h1>
            <p
              className="text-white/85 text-base md:text-lg max-w-xl leading-relaxed mb-9 fade-up fade-up-delay-2"
              data-testid="hero-tagline"
            >
              Heavyweight cotton tees built for the angler who chases wild water, mountain air, and
              red‑white‑and‑blue freedom. Cast. Catch. Represent.
            </p>
            <div className="flex flex-wrap items-center gap-4 fade-up fade-up-delay-3">
              <Link to="/shop" className="btn-red" data-testid="hero-shop-btn">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="text-white underline-offset-4 underline decoration-[#c8102e] decoration-2 uppercase text-xs tracking-[0.2em] font-bold hover:text-[#c8102e]"
                data-testid="hero-story-link"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {[
            { icon: Truck, title: "Free US Shipping", sub: "Orders over $75" },
            { icon: ShieldCheck, title: "Built Rugged", sub: "Heavyweight cotton" },
            { icon: Award, title: "USA Designed", sub: "From the Sierra" },
            { icon: Flag, title: "Patriot Owned", sub: "Made to represent" },
          ].map((f, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4 py-6 md:py-8 px-4 text-center md:text-left"
              data-testid={`trust-item-${i}`}
            >
              <f.icon className="w-7 h-7 text-[#c8102e] shrink-0" />
              <div>
                <p className="font-bold text-sm uppercase tracking-wider">{f.title}</p>
                <p className="text-xs text-[#555] mt-0.5">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28" data-testid="featured-section">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#c8102e] font-bold mb-4">
              <span className="inline-block w-8 h-[2px] bg-[#c8102e] align-middle mr-3" />
              The Collection
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight">
              Featured Shirts
            </h2>
          </div>
          <Link
            to="/shop"
            className="btn-outline"
            data-testid="featured-view-all-btn"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12" data-testid="featured-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Lifestyle / brand split */}
      <section className="bg-[#0a0a0a] text-white" data-testid="lifestyle-section">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={LIFESTYLE_IMG}
              alt="Fishing lifestyle"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-[#c8102e] text-white px-4 py-2 text-xs uppercase tracking-[0.2em] font-bold">
              Field Tested
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#c8102e] font-bold mb-5">
              <span className="inline-block w-8 h-[2px] bg-[#c8102e] align-middle mr-3" />
              Fishing Lifestyle · Patriot Identity
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight leading-[0.95] mb-6">
              For the ones who cast at sunrise and salute the stripes.
            </h2>
            <p className="text-white/70 leading-relaxed text-lg max-w-xl mb-8">
              Naked Lure is made for alpine lakes, tailwater rivers, and rust-belt ponds. Every tee is
              heavyweight cotton, screen‑printed loud, and proudly American in spirit. We don't do
              subtle — we do honest, and we do it sharp.
            </p>
            <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                { k: "6.5oz", v: "Cotton Weight" },
                { k: "100%", v: "USA Designed" },
                { k: "4.9★", v: "Angler Rated" },
              ].map((s, i) => (
                <div key={i} data-testid={`stat-${i}`}>
                  <div className="font-display text-3xl md:text-4xl font-black text-[#c8102e]">{s.k}</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/60 mt-1">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link to="/about" className="btn-red" data-testid="lifestyle-about-btn">
                Read Our Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28" data-testid="categories-section">
        <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-center mb-12">
          Shop by <span className="text-[#c8102e]">Category</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { t: "Fishing Shirts", d: "Built for the water" },
            { t: "Patriotic Graphics", d: "Loud & proud" },
            { t: "Outdoor Lifestyle", d: "For the trail & beyond" },
          ].map((c, i) => (
            <Link
              key={c.t}
              to={`/shop?category=${encodeURIComponent(c.t)}`}
              className="group relative overflow-hidden border-2 border-[#0a0a0a] p-10 md:p-14 flex flex-col justify-between min-h-[240px] bg-white hover:bg-[#0a0a0a] hover:text-white transition-colors"
              data-testid={`category-link-${i}`}
            >
              <span className="text-[80px] md:text-[120px] font-display font-black leading-none text-gray-100 group-hover:text-white/10 absolute -top-4 right-4 transition-colors">
                0{i + 1}
              </span>
              <p className="text-xs uppercase tracking-[0.28em] font-bold text-[#c8102e] relative">
                Category
              </p>
              <div className="relative">
                <h3 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-2">
                  {c.t}
                </h3>
                <p className="text-sm opacity-70 mb-5">{c.d}</p>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold">
                  Shop Now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
